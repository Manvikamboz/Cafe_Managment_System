const asyncHandler = require('express-async-handler');
const { Feedback } = require('../models');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, rating, message } = req.body;

  if (!name || !email || !rating || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const feedback = await Feedback.create({ name, email, rating, message });
  res.status(201).json({ message: 'Feedback submitted', feedback });
});

// @desc    Get all feedback (for Wall of Fame)
// @route   GET /api/feedback
// @access  Public
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({}).sort({ createdAt: -1 });
  res.json(feedback);
});

module.exports = { submitFeedback, getFeedback };

