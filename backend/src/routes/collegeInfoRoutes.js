const express = require('express');
const router = express.Router();
const { getCollegeInfo, updateCollegeInfo } = require('../controllers/collegeInfoController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getCollegeInfo);
router.put('/', authenticate, requireAdmin, updateCollegeInfo);

module.exports = router;
