const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true // e.g. "4 Years (8 Semesters)"
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true
    },
    fees: {
      type: String,
      required: [true, 'Fee details are required'],
      trim: true // e.g. "₹85,000 per year"
    },
    seats: {
      type: Number,
      default: 60
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Text index for course search
courseSchema.index({ name: 'text', department: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
