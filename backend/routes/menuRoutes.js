const express = require('express');
const router = express.Router();
const {
  getMenu,
  getMenuItemById,
} = require('../controllers/menuController');

router.route('/')
  .get(getMenu);

router.route('/:id')
  .get(getMenuItemById);

module.exports = router;
