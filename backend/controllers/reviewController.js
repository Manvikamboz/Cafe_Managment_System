const asyncHandler = require('express-async-handler');
const { Review, MenuItem } = require('../models');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).populate('menuItemId');
  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
const createReview = asyncHandler(async (req, res) => {
  const { menuItemId, email, rating, comment } = req.body;

  if (!menuItemId || !email || !rating || !comment) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  const review = await Review.create({
    menuItemId,
    email,
    rating,
    comment,
  });

  res.status(201).json(review);
});

module.exports = {
  getReviews,
  createReview,
};
