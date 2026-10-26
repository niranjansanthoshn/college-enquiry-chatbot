const mongoose = require('mongoose');

const knowledgeItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Admissions', 'Courses', 'Fees', 'Scholarships', 'Hostel', 'Placements', 'Examinations', 'Campus', 'Faculty', 'General'],
      default: 'General'
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    tags: {
      type: [String],
      default: []
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

knowledgeItemSchema.index({ title: 'text', content: 'text', tags: 'text' });

const KnowledgeItem = mongoose.model('KnowledgeItem', knowledgeItemSchema);
module.exports = KnowledgeItem;
