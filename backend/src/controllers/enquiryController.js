const Enquiry = require('../models/Enquiry');

// POST /api/enquiries (Public)
const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required enquiry fields.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. Our admissions office will get back to you shortly.',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/enquiries (Admin or student's own)
const getEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // If regular student, filter only their email enquiries
    if (req.user && req.user.role === 'student') {
      filter.email = req.user.email.toLowerCase();
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/enquiries/:id (Admin only)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const updateData = {};

    if (status) {
      if (!['pending', 'in-progress', 'resolved'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
      }
      updateData.status = status;
    }

    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    res.json({ success: true, message: 'Enquiry updated successfully.', data: enquiry });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/enquiries/:id (Admin only)
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
};
