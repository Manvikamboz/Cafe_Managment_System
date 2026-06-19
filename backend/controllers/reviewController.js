const asyncHandler = require('express-async-handler');
const { Review, Eatery } = require('../models');

// @desc    Get all reviews or reviews by eatery
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { eateryId } = req.query;
  let query = {};
  if (eateryId) {
    query.eateryId = eateryId;
  }
  const reviews = await Review.find(query)
    .sort({ createdAt: -1 })
    .populate('eateryId')
    .populate('menuItemId');
  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
const createReview = asyncHandler(async (req, res) => {
  const { eateryId, menuItemId, email, userName, rating, comment } = req.body;

  if (!eateryId || !email || !rating || !comment) {
    res.status(400);
    throw new Error('Eatery, email, rating, and comment are required');
  }

  const eatery = await Eatery.findById(eateryId);
  if (!eatery) {
    res.status(404);
    throw new Error('Eatery not found');
  }

  const review = await Review.create({
    eateryId,
    menuItemId: menuItemId || null,
    email,
    userName: userName || 'Anonymous Foodie',
    rating: Number(rating),
    comment,
  });

  // Recalculate average rating for the eatery
  const reviews = await Review.find({ eateryId });
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    eatery.rating = parseFloat(avgRating.toFixed(1));
    await eatery.save();
  }

  res.status(201).json(review);
});

module.exports = {
  getReviews,
  createReview,
};
