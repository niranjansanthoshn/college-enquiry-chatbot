const Course = require('../models/Course');

// GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const { search, department, active } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { courseCode: searchRegex },
        { department: searchRegex },
        { description: searchRegex }
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/departments
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Course.distinct('department');
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// POST /api/courses (Admin only)
const createCourse = async (req, res, next) => {
  try {
    const { name, courseCode, department, duration, eligibility, fees, description, seats, active } = req.body;

    if (!name || !courseCode || !department || !duration || !eligibility || !fees) {
      return res.status(400).json({ success: false, message: 'Please provide all required course fields.' });
    }

    const existing = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Course code ${courseCode} already exists.` });
    }

    const course = await Course.create({
      name,
      courseCode: courseCode.toUpperCase(),
      department,
      duration,
      eligibility,
      fees,
      description,
      seats: seats ? Number(seats) : 60,
      active: active !== undefined ? active : true
    });

    res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
  } catch (error) {
    next(error);
  }
};

// PUT /api/courses/:id (Admin only)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    res.json({ success: true, message: 'Course updated successfully.', data: course });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/courses/:id (Admin only)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getDepartments,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
