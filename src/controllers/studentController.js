const Sport = require('../models/Sport');
const Registration = require('../models/Registration');

exports.homePage = async (req, res, next) => {
  try {
    const sports = await Sport.find({ is_active: true });
    res.status(200).json({
      success: true,
      message: 'Sports Day Home Page',
      sports,
    });
  } catch (error) {
    next(error);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user_id: req.user._id });
    const total = registrations.length;
    const pending = registrations.filter((r) => r.payment_status === 'pending').length;
    const approved = registrations.filter((r) => r.payment_status === 'approved').length;

    res.status(200).json({
      success: true,
      user: req.user,
      summary: { total, pending, approved },
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

exports.browseSports = async (req, res, next) => {
  try {
    const sports = await Sport.find({ is_active: true });
    res.status(200).json({ success: true, sports });
  } catch (error) {
    next(error);
  }
};

exports.myRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user_id: req.user._id }).populate('sport_id');
    res.status(200).json({ success: true, registrations });
  } catch (error) {
    next(error);
  }
};
