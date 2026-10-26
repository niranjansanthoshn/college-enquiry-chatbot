const express = require('express');
const router = express.Router();
const {
  handleChat,
  getChatHistory,
  getConversationById,
  deleteConversation,
  clearAllConversations
} = require('../controllers/chatController');
const { optionalAuth, authenticate } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');

router.post('/', chatLimiter, optionalAuth, handleChat);
router.get('/history', optionalAuth, getChatHistory);
router.get('/history/:id', optionalAuth, getConversationById);
router.delete('/history/:id', optionalAuth, deleteConversation);
router.delete('/history', authenticate, clearAllConversations);

module.exports = router;
