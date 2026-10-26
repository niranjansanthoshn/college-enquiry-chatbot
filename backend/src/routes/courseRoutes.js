const express = require('express');
const router = express.Router();
const {
  getCourses,
  getDepartments,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/departments', getDepartments);
router.get('/:id', getCourseById);
router.post('/', authenticate, requireAdmin, createCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

module.exports = router;
