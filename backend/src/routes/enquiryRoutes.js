const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');

router.post('/', createEnquiry);
router.get('/', optionalAuth, getEnquiries);
router.patch('/:id', authenticate, requireAdmin, updateEnquiryStatus);
router.delete('/:id', authenticate, requireAdmin, deleteEnquiry);

module.exports = router;
