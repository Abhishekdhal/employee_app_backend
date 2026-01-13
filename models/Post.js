const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  // 1. Author ID (So we know who posted)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  userName: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },

  // 2. THIS WAS MISSING: Likes Array
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],

  // 3. THIS WAS MISSING: Comments Array
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      userName: { type: String },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);


// const mongoose = require('mongoose');

// const PostSchema = new mongoose.Schema({
//   userName: { type: String, required: true },
//   role: { type: String, required: true },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Post', PostSchema);