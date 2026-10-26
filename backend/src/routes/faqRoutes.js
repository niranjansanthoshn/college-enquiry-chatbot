const express = require('express');
const router = express.Router();
const {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  incrementFaqClick
} = require('../controllers/faqController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getFaqs);
router.patch('/:id/click', incrementFaqClick);
router.post('/', authenticate, requireAdmin, createFaq);
router.put('/:id', authenticate, requireAdmin, updateFaq);
router.delete('/:id', authenticate, requireAdmin, deleteFaq);

module.exports = router;
