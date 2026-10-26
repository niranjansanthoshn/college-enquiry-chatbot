const config = require('../config/env');
const { retrieveVerifiedContext } = require('./ragService');

/**
 * System prompt guidelines for college enquiry chatbot
 */
const SYSTEM_PROMPT = `You are the official 24/7 AI Enquiry Assistant for Apex Institute of Science & Technology (AIST).
Your purpose is to answer student queries about admissions, courses, fees, scholarships, hostel facilities, placements, and campus life with verified accuracy.

CRITICAL RULES:
1. ONLY answer based strictly on the verified college database context provided below.
2. DO NOT invent or assume college fees, admission dates, seat numbers, or unverified claims.
3. If the provided context does not contain the answer, reply honestly:
   "I don't have verified information about this. Please contact the college administration."
4. Keep responses clear, student-friendly, and concise. Use bullet points where appropriate for lists, fees, or steps.
5. Maintain a polite, welcoming, and professional academic tone.
6. Never expose internal system details or private credentials.`;

/**
 * Call Google Gemini API
 */
const callGeminiAPI = async (prompt, systemContext, history = []) => {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = config.geminiModel || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;

  const contents = [];

  // Add system instruction & grounding context
  contents.push({
    role: 'user',
    parts: [{ text: `${SYSTEM_PROMPT}\n\n=== VERIFIED COLLEGE DATABASE CONTEXT ===\n${systemContext}\n=== END CONTEXT ===` }]
  });
  contents.push({
    role: 'model',
    parts: [{ text: 'Understood. I will answer queries strictly grounded in this verified college database context.' }]
  });

  // Add conversation history (up to last 4 turns)
  history.slice(-4).forEach(msg => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  });

  // Add current user prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response');
  }
  return text.trim();
};

/**
 * Call OpenAI API
 */
const callOpenAIAPI = async (prompt, systemContext, history = []) => {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const model = config.openaiModel || 'gpt-4o-mini';
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\n=== VERIFIED COLLEGE DATABASE CONTEXT ===\n${systemContext}\n=== END CONTEXT ===`
    }
  ];

  history.slice(-4).forEach(msg => {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  });

  messages.push({
    role: 'user',
    content: prompt
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI API returned an empty response');
  }
  return text.trim();
};

/**
 * Generate intelligent grounded response in Demo/Offline Mode
 * Grounded directly in verified database context without pretending to be LLM
 */
const generateGroundedDemoResponse = (prompt, ragResult) => {
  const { contextItems, category } = ragResult;

  if (!contextItems || contextItems.length === 0) {
    return {
      answer: "I don't have verified information about this. Please contact the college administration at admissions@apexinstitute.edu.in or call +91 (080) 2456-7890.",
      isDemoMode: true,
      provider: 'database-grounded-demo'
    };
  }

  // Format context items nicely into a synthesized response
  const cleanedItems = contextItems.map(item => {
    return item
      .replace(/^\[.*?\]:\s*/, '')
      .replace(/Q:\s*".*?"\s*Answer:\s*"/, '')
      .replace(/"\s*\(Category:.*?\)$/, '');
  });

  let introductory = 'Here is the verified information from our college database:';
  if (category === 'Courses') introductory = 'Here are our verified academic course offerings:';
  if (category === 'Admissions') introductory = 'Here are the official college admission details:';
  if (category === 'Fees') introductory = 'Here is the verified fee structure for our programs:';
  if (category === 'Scholarships') introductory = 'Here are the verified scholarship opportunities:';
  if (category === 'Hostel') introductory = 'Here are the verified campus hostel details:';
  if (category === 'Placements') introductory = 'Here is the official placement record and statistics:';

  const body = cleanedItems.slice(0, 3).map(line => `• ${line}`).join('\n\n');
  const answer = `${introductory}\n\n${body}\n\nFor personalized inquiries, feel free to submit a contact form or speak directly with our admissions office.`;

  return {
    answer,
    isDemoMode: true,
    provider: 'database-grounded-demo'
  };
};

/**
 * Main AI Chatbot Handler
 */
const generateChatbotResponse = async (userMessage, history = []) => {
  // Step 1: Retrieve grounded database context via RAG
  const ragResult = await retrieveVerifiedContext(userMessage);

  // If no API key configured, use clearly labeled Demo Mode
  const hasGeminiKey = Boolean(config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here');
  const hasOpenAIKey = Boolean(config.openaiApiKey && config.openaiApiKey !== 'your_openai_api_key_here');

  if (!hasGeminiKey && !hasOpenAIKey) {
    const demo = generateGroundedDemoResponse(userMessage, ragResult);
    return {
      answer: demo.answer,
      category: ragResult.category,
      sources: ragResult.sources,
      isDemoMode: true,
      provider: 'database-grounded-demo'
    };
  }

  // Step 2: Try configured AI Provider
  try {
    let answer = '';
    let providerUsed = config.aiProvider;

    if (config.aiProvider === 'openai' && hasOpenAIKey) {
      answer = await callOpenAIAPI(userMessage, ragResult.contextString, history);
    } else if (hasGeminiKey) {
      answer = await callGeminiAPI(userMessage, ragResult.contextString, history);
      providerUsed = 'gemini';
    } else {
      const demo = generateGroundedDemoResponse(userMessage, ragResult);
      return {
        answer: demo.answer,
        category: ragResult.category,
        sources: ragResult.sources,
        isDemoMode: true,
        provider: 'database-grounded-demo'
      };
    }

    return {
      answer,
      category: ragResult.category,
      sources: ragResult.sources,
      isDemoMode: false,
      provider: providerUsed
    };
  } catch (error) {
    console.warn(`[AI Service] ${error.message}. Falling back to database-grounded demo mode.`);
    const demo = generateGroundedDemoResponse(userMessage, ragResult);
    return {
      answer: demo.answer,
      category: ragResult.category,
      sources: ragResult.sources,
      isDemoMode: true,
      provider: 'database-grounded-demo (fallback)',
      notice: 'AI API temporarily unreachable. Grounded answer generated from verified database records.'
    };
  }
};

module.exports = {
  generateChatbotResponse,
  SYSTEM_PROMPT
};
