import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ChatContext = createContext();

export const SUGGESTED_QUESTIONS = [
  'What courses are available in this college?',
  'What is the admission procedure?',
  'What are the college fees?',
  'What scholarships are available?',
  'Is hostel accommodation available?',
  'What are the placement opportunities?',
  'What documents are required for admission?',
  'How can I contact the college office?',
];

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content: 'Hello! 👋 Welcome to Apex Institute of Science & Technology. I am your 24/7 AI Enquiry Assistant. How can I assist you today with courses, admissions, fees, hostel, or placements?',
      sources: ['Apex Institute Official Knowledge Base'],
      isDemoMode: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [conversationId, setConversationId] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    let id = sessionStorage.getItem('chatSessionId');
    if (!id) {
      id = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('chatSessionId', id);
    }
    return id;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [inputDraft, setInputDraft] = useState('');

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await api.post('/chat', {
        message: text.trim(),
        conversationId,
        sessionId,
      });

      if (response.data && response.data.success) {
        const botData = response.data.data;
        const botMessage = {
          role: 'assistant',
          content: botData.message.content,
          sources: botData.sources || [],
          isDemoMode: botData.isDemoMode || false,
          provider: botData.provider,
          notice: botData.notice,
          timestamp: botData.message.timestamp || new Date().toISOString(),
        };

        if (botData.conversationId) {
          setConversationId(botData.conversationId);
        }

        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(response.data?.message || 'Failed to get answer from chatbot.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Unable to reach the enquiry service at this moment. Please check your internet connection or try again shortly.';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ ${errorMsg}`,
          sources: [],
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearConversation = () => {
    const newSessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);
    setConversationId(null);
    setError(null);
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation cleared! How can I assist you with your college enquiry today?',
        sources: ['Apex Institute Official Knowledge Base'],
        isDemoMode: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const loadConversation = async (convId) => {
    setIsTyping(true);
    try {
      const res = await api.get(`/chat/history/${convId}`);
      if (res.data.success && res.data.data) {
        setConversationId(convId);
        setMessages(
          res.data.data.messages.map((m) => ({
            role: m.role,
            content: m.content,
            sources: m.sources || [],
            isDemoMode: m.isDemoMode || false,
            timestamp: m.timestamp,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        error,
        conversationId,
        inputDraft,
        setInputDraft,
        suggestedQuestions: SUGGESTED_QUESTIONS,
        sendMessage,
        clearConversation,
        loadConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
