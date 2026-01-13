const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// 1. GET ALL POSTS
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE A POST
router.post('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      userId: user._id,
      userName: user.name,
      role: user.role === 'employer' ? 'Employer' : 'Employee',
      content: req.body.content,
      likes: [],    // 🛡️ Explicitly initialize empty arrays
      comments: []
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. LIKE / UNLIKE POST (CRASH PROOF)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 🛡️ SAFETY CHECK: If this is an old post without a 'likes' list, create it now.
    if (!post.likes) post.likes = [];

    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      post.likes.push(req.user.id); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("LIKE ERROR:", err); // Log error to Vercel logs
    res.status(500).json({ error: err.message });
  }
});

// 4. ADD COMMENT (CRASH PROOF)
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    // 🛡️ SAFETY CHECK: If this is an old post without a 'comments' list, create it now.
    if (!post.comments) post.comments = [];

    const newComment = {
      userId: user._id,
      userName: user.name,
      text: req.body.text
    };

    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;