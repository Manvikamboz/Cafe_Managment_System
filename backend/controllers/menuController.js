const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenu = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({}).sort({ createdAt: -1 });
  res.json(menuItems);
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrl } = req.body;

  const itemExists = await MenuItem.findOne({ name });

  if (itemExists) {
    res.status(400);
    throw new Error('Menu item already exists');
  }

  const menuItem = new MenuItem({
    name,
    price,
    description,
    category,
    imageUrl: imageUrl || '',
  });

  const createdItem = await menuItem.save();
  res.status(201).json(createdItem);
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrl, isAvailable } = req.body;

  const item = await MenuItem.findById(req.params.id);

  if (item) {
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;
    item.category = category || item.category;
    item.imageUrl = imageUrl || item.imageUrl;
    item.isAvailable = isAvailable !== undefined ? isAvailable : item.isAvailable;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (item) {
    await MenuItem.deleteOne({ _id: item._id });
    res.json({ message: 'Menu item removed' });
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

module.exports = {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
