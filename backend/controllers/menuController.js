const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items (optionally filtered by eatery)
// @route   GET /api/menu
// @access  Public
const getMenu = asyncHandler(async (req, res) => {
  const { eateryId } = req.query;
  const filter = eateryId ? { eatery: eateryId } : {};
  const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 }).populate('eatery');
  res.json(menuItems);
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('eatery');
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin/Staff
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrl, eateryId } = req.body;

  if (!eateryId) {
    res.status(400);
    throw new Error('Eatery ID is required');
  }

  const itemExists = await MenuItem.findOne({ name, eatery: eateryId });
  if (itemExists) {
    res.status(400);
    throw new Error('Menu item already exists in this eatery');
  }

  const menuItem = new MenuItem({
    name,
    price: Number(price),
    description,
    category,
    imageUrl: imageUrl || '',
    eatery: eateryId
  });

  const createdItem = await menuItem.save();
  res.status(201).json(createdItem);
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin/Staff
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category, imageUrl, isAvailable } = req.body;

  const item = await MenuItem.findById(req.params.id);

  if (item) {
    item.name = name || item.name;
    item.price = price !== undefined ? Number(price) : item.price;
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
// @access  Private/Admin/Staff
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
