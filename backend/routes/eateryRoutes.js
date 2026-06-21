const express = require('express');
const router = express.Router();
const {
  getEateries,
  getEateryById,
  toggleFavoriteEatery
} = require('../controllers/eateryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEateries);

router.route('/:id')
  .get(getEateryById);

router.route('/:id/favorite')
  .post(protect, toggleFavoriteEatery);

module.exports = router;
