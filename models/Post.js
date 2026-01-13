const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);