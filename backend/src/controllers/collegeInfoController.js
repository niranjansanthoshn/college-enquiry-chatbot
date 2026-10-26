const CollegeInfo = require('../models/CollegeInfo');

// GET /api/college-info
const getCollegeInfo = async (req, res, next) => {
  try {
    let info = await CollegeInfo.findOne();
    if (!info) {
      info = await CollegeInfo.create({});
    }
    res.json({ success: true, data: info });
  } catch (error) {
    next(error);
  }
};

// PUT /api/college-info (Admin only)
const updateCollegeInfo = async (req, res, next) => {
  try {
    let info = await CollegeInfo.findOne();
    if (!info) {
      info = await CollegeInfo.create(req.body);
    } else {
      info = await CollegeInfo.findByIdAndUpdate(info._id, req.body, {
        new: true,
        runValidators: true
      });
    }
    res.json({ success: true, message: 'College information updated successfully.', data: info });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollegeInfo,
  updateCollegeInfo
};
