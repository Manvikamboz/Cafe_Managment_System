const express = require('express');
const router = express.Router();
const {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMenu)
  .post(protect, authorize('admin', 'staff'), createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, authorize('admin', 'staff'), updateMenuItem)
  .delete(protect, authorize('admin', 'staff'), deleteMenuItem);

module.exports = router;
