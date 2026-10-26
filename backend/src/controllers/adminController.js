const User = require('../models/User');
const Course = require('../models/Course');
const FAQ = require('../models/FAQ');
const ChatConversation = require('../models/ChatConversation');
const Enquiry = require('../models/Enquiry');
const KnowledgeItem = require('../models/KnowledgeItem');

// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalConversations,
      totalCourses,
      totalEnquiries,
      pendingEnquiries,
      resolvedEnquiries,
      topFaqs,
      recentConversations,
      categoryStats
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      ChatConversation.countDocuments(),
      Course.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ status: 'resolved' }),
      FAQ.find().sort({ clickCount: -1 }).limit(5).select('question clickCount category'),
      ChatConversation.find().sort({ createdAt: -1 }).limit(5).select('title category createdAt messages'),
      ChatConversation.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalConversations,
          totalCourses,
          totalEnquiries,
          pendingEnquiries,
          resolvedEnquiries
        },
        topFaqs,
        categoryStats,
        recentConversations
      }
    });
  } catch (error) {
    next(error);
  }
};

// Knowledge base controllers
const getKnowledgeItems = async (req, res, next) => {
  try {
    const items = await KnowledgeItem.find().sort({ updatedAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

const createKnowledgeItem = async (req, res, next) => {
  try {
    const { title, category, content, tags, active } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const item = await KnowledgeItem.create({
      title,
      category: category || 'General',
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      active: active !== undefined ? active : true
    });

    res.status(201).json({ success: true, message: 'Knowledge item created.', data: item });
  } catch (error) {
    next(error);
  }
};

const updateKnowledgeItem = async (req, res, next) => {
  try {
    const item = await KnowledgeItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Knowledge item not found.' });
    }
    res.json({ success: true, message: 'Knowledge item updated.', data: item });
  } catch (error) {
    next(error);
  }
};

const deleteKnowledgeItem = async (req, res, next) => {
  try {
    const item = await KnowledgeItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Knowledge item not found.' });
    }
    res.json({ success: true, message: 'Knowledge item deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem
};
