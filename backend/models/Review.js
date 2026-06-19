const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  eateryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eatery',
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: 'Anonymous User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
