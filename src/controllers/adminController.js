const Sport = require('../models/Sport');
const Registration = require('../models/Registration');
const User = require('../models/User');

exports.adminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSports = await Sport.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const pendingPayments = await Registration.countDocuments({ payment_status: 'pending' });
    const approvedPayments = await Registration.find({ payment_status: 'approved' }).populate('sport_id');
    const revenueCollected = approvedPayments.reduce((sum, reg) => sum + (reg.sport_id?.fee || 0), 0);

    const recentActivity = await Registration.find()
      .sort({ registered_at: -1 })
      .limit(10)
      .populate('user_id sport_id');

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalSports,
        totalRegistrations,
        pendingPayments,
        revenueCollected,
      },
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

exports.listSports = async (req, res, next) => {
  try {
    const sports = await Sport.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, sports });
  } catch (error) {
    next(error);
  }
};

exports.manageRegistrations = async (req, res, next) => {
  try {
    const { payment_status, sport } = req.query;
    const filter = {};

    if (payment_status) filter.payment_status = payment_status;

    const registrations = await Registration.find(filter)
      .populate('user_id sport_id')
      .sort({ registered_at: -1 });

    res.status(200).json({ success: true, registrations });
  } catch (error) {
    next(error);
  }
};
