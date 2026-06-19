const express = require('express');
const router = express.Router();
const {
  getEateries,
  getEateryById,
  createEatery,
  updateEatery,
  deleteEatery,
  toggleFavoriteEatery
} = require('../controllers/eateryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEateries)
  .post(protect, authorize('admin', 'staff'), createEatery);

router.route('/:id')
  .get(getEateryById)
  .put(protect, authorize('admin', 'staff'), updateEatery)
  .delete(protect, authorize('admin', 'staff'), deleteEatery);

router.route('/:id/favorite')
  .post(protect, toggleFavoriteEatery);

module.exports = router;
