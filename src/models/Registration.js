const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  payment_ref: { type: String, trim: true },
  payment_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  registered_at: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Registration', registrationSchema);
