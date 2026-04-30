const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/role')
  .put(protect, authorize('admin'), updateUserRole);

module.exports = router;
