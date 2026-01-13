const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true }, // Store name for easier display
  type: { type: String, required: true }, // Sick, Casual, etc.
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leave', LeaveSchema);