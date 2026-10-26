const FAQ = require('../models/FAQ');

// GET /api/faqs
const getFaqs = async (req, res, next) => {
  try {
    const { category, search, active } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { question: searchRegex },
        { answer: searchRegex }
      ];
    }

    const faqs = await FAQ.find(filter).sort({ clickCount: -1, createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

// POST /api/faqs (Admin only)
const createFaq = async (req, res, next) => {
  try {
    const { question, answer, category, active } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'General',
      active: active !== undefined ? active : true
    });

    res.status(201).json({ success: true, message: 'FAQ created successfully.', data: faq });
  } catch (error) {
    next(error);
  }
};

// PUT /api/faqs/:id (Admin only)
const updateFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
    res.json({ success: true, message: 'FAQ updated successfully.', data: faq });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/faqs/:id (Admin only)
const deleteFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/faqs/:id/click
const incrementFaqClick = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  incrementFaqClick
};
