const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Admissions', 'Courses', 'Fees', 'Scholarships', 'Hostel', 'Placements', 'Examinations', 'Campus', 'Faculty', 'General'],
      default: 'General'
    },
    active: {
      type: Boolean,
      default: true
    },
    clickCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

faqSchema.index({ question: 'text', answer: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);
module.exports = FAQ;
