const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// 1. APPLY FOR LEAVE (Employee)
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newLeave = new Leave({
      userId: user._id,
      userName: user.name,
      ...req.body // type, startDate, endDate, reason
    });
    
    await newLeave.save();
    res.status(201).json({ message: 'Leave applied successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ALL LEAVES (Employer Only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    // Check Role
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access Denied: Employers Only' });
    }

    // Fetch pending leaves first
    const leaves = await Leave.find().sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. APPROVE/REJECT LEAVE (Employer Only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Employers Only' });
    }

    const { status } = req.body; // 'approved' or 'rejected'
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status: status },
      { new: true }
    );

    res.json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;