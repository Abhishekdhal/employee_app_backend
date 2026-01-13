const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Diwali Party"
  date: { type: String, required: true },  // e.g., "2026-01-26"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);