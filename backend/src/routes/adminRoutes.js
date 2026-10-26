const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem
} = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticate, requireAdmin);

router.get('/analytics', getAnalytics);
router.get('/knowledge', getKnowledgeItems);
router.post('/knowledge', createKnowledgeItem);
router.put('/knowledge/:id', updateKnowledgeItem);
router.delete('/knowledge/:id', deleteKnowledgeItem);

module.exports = router;
