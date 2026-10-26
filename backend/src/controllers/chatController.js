const ChatConversation = require('../models/ChatConversation');
const { generateChatbotResponse } = require('../services/aiService');

// POST /api/chat
const handleChat = async (req, res, next) => {
  try {
    const { message, conversationId, sessionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    const trimmedMessage = message.trim();
    const userId = req.user ? req.user._id : null;
    const effectiveSessionId = sessionId || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    let conversation = null;
    let history = [];

    // Find existing conversation
    if (conversationId) {
      const query = { _id: conversationId };
      if (userId) {
        query.userId = userId;
      } else {
        query.sessionId = effectiveSessionId;
      }
      conversation = await ChatConversation.findOne(query);
      if (conversation) {
        history = conversation.messages.map(m => ({
          role: m.role,
          content: m.content
        }));
      }
    }

    // Step 1: Call AI service with RAG grounding
    const aiResult = await generateChatbotResponse(trimmedMessage, history);

    const userMsgObj = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };

    const assistantMsgObj = {
      role: 'assistant',
      content: aiResult.answer,
      sources: aiResult.sources || [],
      isDemoMode: Boolean(aiResult.isDemoMode),
      timestamp: new Date()
    };

    // Step 2: Persist conversation
    if (!conversation) {
      // Create a nice title from first user message
      const generatedTitle = trimmedMessage.length > 40
        ? `${trimmedMessage.substring(0, 37)}...`
        : trimmedMessage;

      conversation = await ChatConversation.create({
        userId,
        sessionId: effectiveSessionId,
        title: generatedTitle,
        category: aiResult.category || 'General',
        messages: [userMsgObj, assistantMsgObj]
      });
    } else {
      conversation.messages.push(userMsgObj);
      conversation.messages.push(assistantMsgObj);
      conversation.category = aiResult.category || conversation.category;
      await conversation.save();
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        sessionId: effectiveSessionId,
        message: assistantMsgObj,
        category: aiResult.category,
        sources: aiResult.sources,
        isDemoMode: aiResult.isDemoMode,
        provider: aiResult.provider,
        notice: aiResult.notice
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/history
const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { sessionId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.json({ success: true, count: 0, data: [] });
    }

    const conversations = await ChatConversation.find(query)
      .select('title category createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = conversations.map(c => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      messageCount: c.messages ? c.messages.length : 0,
      lastMessage: c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].content : '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/history/:id
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    // Check ownership if user is authenticated student
    if (req.user && req.user.role !== 'admin' && conversation.userId && conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this conversation.' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chat/history/:id
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    if (req.user && req.user.role !== 'admin' && conversation.userId && conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await ChatConversation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chat/history
const clearAllConversations = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login required to clear all conversations.' });
    }

    await ChatConversation.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'All your chat conversations have been cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChat,
  getChatHistory,
  getConversationById,
  deleteConversation,
  clearAllConversations
};
