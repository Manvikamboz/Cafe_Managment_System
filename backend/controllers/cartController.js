const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  let cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;

  if (!menuItemId) {
    res.status(400);
    throw new Error('Menu item ID is required');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Find index if item already exists in cart
  const itemIndex = cart.items.findIndex(item => 
    item.menuItem.toString() === menuItemId.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += (Number(quantity) || 1);
  } else {
    cart.items.push({ menuItem: menuItemId, quantity: Number(quantity) || 1 });
  }

  await cart.save();
  
  // Return populated cart
  const updatedCart = await Cart.findById(cart._id).populate('items.menuItem');
  res.json(updatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => 
    item.menuItem.toString() === menuItemId.toString()
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.menuItem');
    res.json(updatedCart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== req.params.itemId
    );
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.menuItem');
    res.json(updatedCart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
