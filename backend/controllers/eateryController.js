const asyncHandler = require('express-async-handler');
const Eatery = require('../models/Eatery');
const User = require('../models/User');

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// @desc    Get all eateries with search, filters, and distance proximity
// @route   GET /api/eateries
// @access  Public
const getEateries = asyncHandler(async (req, res) => {
  const { type, cuisine, priceRange, q, userLat, userLng } = req.query;

  let filter = {};

  if (type) {
    filter.type = type;
  }

  if (cuisine) {
    // case insensitive match in cuisine array
    filter.cuisine = { $in: [new RegExp(cuisine, 'i')] };
  }

  if (priceRange) {
    filter.priceRange = priceRange;
  }

  if (q) {
    const searchRegex = new RegExp(q, 'i');
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { address: searchRegex },
      { cuisine: { $in: [searchRegex] } },
      { popularDishes: { $in: [searchRegex] } }
    ];
  }

  let eateries = await Eatery.find(filter).lean();

  // If user location is provided, calculate distance and sort
  if (userLat && userLng) {
    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);
    
    eateries = eateries.map(e => {
      const distance = calculateDistance(uLat, uLng, e.lat, e.lng);
      return { ...e, distance: parseFloat(distance.toFixed(2)) };
    });

    // Sort by nearest
    eateries.sort((a, b) => a.distance - b.distance);
  } else {
    // Default sort by rating (high to low)
    eateries.sort((a, b) => b.rating - a.rating);
  }

  res.json(eateries);
});

// @desc    Get single eatery details
// @route   GET /api/eateries/:id
// @access  Public
const getEateryById = asyncHandler(async (req, res) => {
  const eatery = await Eatery.findById(req.params.id).lean();

  if (eatery) {
    res.json(eatery);
  } else {
    res.status(404);
    throw new Error('Eatery not found');
  }
});

// @desc    Create an eatery
// @route   POST /api/eateries
// @access  Private/Admin/Staff
const createEatery = asyncHandler(async (req, res) => {
  const { name, type, description, cuisine, priceRange, costForTwo, address, lat, lng, operatingHours, imageUrl, popularDishes } = req.body;

  const eateryExists = await Eatery.findOne({ name, address });
  if (eateryExists) {
    res.status(400);
    throw new Error('Eatery already exists at this address');
  }

  const eatery = new Eatery({
    name,
    type: type || 'restaurant',
    description,
    cuisine: cuisine || [],
    priceRange: priceRange || '$$',
    costForTwo: Number(costForTwo) || 200,
    address,
    lat: Number(lat),
    lng: Number(lng),
    operatingHours: operatingHours || '9:00 AM - 10:00 PM',
    imageUrl: imageUrl || '',
    popularDishes: popularDishes || [],
    owner: req.user.role === 'staff' ? req.user._id : req.body.owner || req.user._id
  });

  const createdEatery = await eatery.save();
  res.status(201).json(createdEatery);
});

// @desc    Update eatery details
// @route   PUT /api/eateries/:id
// @access  Private/Admin/Staff
const updateEatery = asyncHandler(async (req, res) => {
  const eatery = await Eatery.findById(req.params.id);

  if (!eatery) {
    res.status(404);
    throw new Error('Eatery not found');
  }

  // Check ownership unless admin
  if (req.user.role !== 'admin' && eatery.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this eatery');
  }

  const { name, type, description, cuisine, priceRange, costForTwo, address, lat, lng, operatingHours, imageUrl, popularDishes } = req.body;

  eatery.name = name || eatery.name;
  eatery.type = type || eatery.type;
  eatery.description = description || eatery.description;
  eatery.cuisine = cuisine || eatery.cuisine;
  eatery.priceRange = priceRange || eatery.priceRange;
  eatery.costForTwo = costForTwo !== undefined ? Number(costForTwo) : eatery.costForTwo;
  eatery.address = address || eatery.address;
  eatery.lat = lat !== undefined ? Number(lat) : eatery.lat;
  eatery.lng = lng !== undefined ? Number(lng) : eatery.lng;
  eatery.operatingHours = operatingHours || eatery.operatingHours;
  eatery.imageUrl = imageUrl || eatery.imageUrl;
  eatery.popularDishes = popularDishes || eatery.popularDishes;

  const updatedEatery = await eatery.save();
  res.json(updatedEatery);
});

// @desc    Delete eatery
// @route   DELETE /api/eateries/:id
// @access  Private/Admin/Staff
const deleteEatery = asyncHandler(async (req, res) => {
  const eatery = await Eatery.findById(req.params.id);

  if (!eatery) {
    res.status(404);
    throw new Error('Eatery not found');
  }

  // Check ownership unless admin
  if (req.user.role !== 'admin' && eatery.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this eatery');
  }

  await Eatery.deleteOne({ _id: eatery._id });
  res.json({ message: 'Eatery removed' });
});

// @desc    Toggle favorite status for eatery
// @route   POST /api/eateries/:id/favorite
// @access  Private
const toggleFavoriteEatery = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const eateryId = req.params.id;
  const eatery = await Eatery.findById(eateryId);
  if (!eatery) {
    res.status(404);
    throw new Error('Eatery not found');
  }

  const isFavorite = user.favorites.includes(eateryId);

  if (isFavorite) {
    user.favorites = user.favorites.filter(fav => fav.toString() !== eateryId);
  } else {
    user.favorites.push(eateryId);
  }

  await user.save();
  res.json({
    message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    favorites: user.favorites
  });
});

module.exports = {
  getEateries,
  getEateryById,
  createEatery,
  updateEatery,
  deleteEatery,
  toggleFavoriteEatery
};
