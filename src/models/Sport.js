const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  rules: { type: String, trim: true },
  fee: { type: Number, default: 0, min: 0 },
  max_players: { type: Number, default: 20, min: 1 },
  venue: { type: String, trim: true },
  event_date: { type: Date },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sport', sportSchema);
