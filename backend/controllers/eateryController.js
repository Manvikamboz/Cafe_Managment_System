const asyncHandler = require('express-async-handler');
const Eatery = require('../models/Eatery');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

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

const getImageUrlForType = (type, name = '', lat = null, lng = null) => {
  // If Google Maps API key is present in environment, generate street view photo dynamically
  if (process.env.GOOGLE_MAPS_API_KEY && lat && lng) {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  }

  // Hash function to get a deterministic index based on eatery name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash);

  const cafeImages = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80'
  ];

  const streetFoodImages = [
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1613447226241-ac401261a84f?auto=format&fit=crop&w=800&q=80'
  ];

  const restaurantImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
  ];

  if (type === 'cafe') {
    return cafeImages[index % cafeImages.length];
  }
  if (type === 'street-food') {
    return streetFoodImages[index % streetFoodImages.length];
  }
  return restaurantImages[index % restaurantImages.length];
};

const getPopularDishesForType = (type) => {
  if (type === 'cafe') return ['Rose Petal Latte', 'Lavender Honey Cake', 'Blueberry Waffles'];
  if (type === 'street-food') return ['Aloo Tikki Chaat', 'Gol Gappa', 'Samosa Kachori'];
  return ['Truffle Pasta', 'Wild Berry Salad', 'Amethyst Mousse'];
};

const seedMenuForEatery = async (eateryId, type) => {
  let items = [];
  if (type === 'cafe') {
    items = [
      { name: 'Specialty Latte', price: 180, category: 'Beverages', description: 'Brewed with high-quality arabica beans', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
      { name: 'Choco Croissant', price: 120, category: 'Bakery', description: 'Flaky pastry filled with rich dark chocolate', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80' },
      { name: 'Blueberry Muffin', price: 110, category: 'Bakery', description: 'Soft muffin loaded with wild blueberries', imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=400&q=80' }
    ];
  } else if (type === 'street-food') {
    items = [
      { name: 'Special Pav Bhaji', price: 130, category: 'Snacks', description: 'Buttery mashed vegetables served with soft hot pav', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' },
      { name: 'Crispy Pani Puri', price: 60, category: 'Snacks', description: '8 hollow puris stuffed with potatoes and served with spicy sweet water', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' },
      { name: 'Masala Chai', price: 40, category: 'Beverages', description: 'Traditional Indian spiced milk tea', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' }
    ];
  } else {
    items = [
      { name: 'Butter Chicken Special', price: 380, category: 'Main Course', description: 'Tender chicken in rich creamy tomato gravy', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' },
      { name: 'Paneer Tikka Masala', price: 320, category: 'Main Course', description: 'Spiced cottage cheese chunks in tandoori gravy', imageUrl: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=400&q=80' },
      { name: 'Garlic Naan Flatbread', price: 70, category: 'Bread', description: 'Butter naan topped with garlic pieces', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' }
    ];
  }

  const seededItems = items.map(item => ({
    ...item,
    eatery: eateryId
  }));
  await MenuItem.insertMany(seededItems);
};

const ensureEateriesNearLocation = async (uLat, uLng) => {
  const allEateries = await Eatery.find({});
  const nearby = allEateries.filter(e => calculateDistance(uLat, uLng, e.lat, e.lng) <= 10);
  
  if (nearby.length >= 3) {
    return;
  }

  console.log(`📡 Only ${nearby.length} eateries within 10km of (${uLat}, ${uLng}). Fetching from OSM/Overpass...`);

  let fetchedElements = [];
  try {
    const query = `[out:json][timeout:8];(node["amenity"="restaurant"](around:8000,${uLat},${uLng});node["amenity"="cafe"](around:8000,${uLat},${uLng});node["amenity"="fast_food"](around:8000,${uLat},${uLng}););out body 6;`;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.elements && data.elements.length > 0) {
        fetchedElements = data.elements;
      }
    }
  } catch (err) {
    console.error('⚠️ Overpass API fetch failed, falling back to mock generator:', err.message);
  }

  if (fetchedElements.length > 0) {
    for (const el of fetchedElements) {
      const name = el.tags.name;
      if (!name) continue;
      
      const exists = allEateries.some(e => e.name.toLowerCase() === name.toLowerCase() && calculateDistance(el.lat, el.lon, e.lat, e.lng) < 0.2);
      if (exists) continue;

      const type = el.tags.amenity === 'cafe' ? 'cafe' : (el.tags.amenity === 'fast_food' ? 'street-food' : 'restaurant');
      let address = el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:suburb'] || `Located near user coordinates`;

      const newEatery = await Eatery.create({
        name,
        type,
        description: el.tags.description || `A popular local ${type} featuring authentic dishes and a cozy vibe.`,
        cuisine: el.tags.cuisine ? el.tags.cuisine.split(';').map(c => c.trim()) : [type === 'cafe' ? 'Cafe' : (type === 'street-food' ? 'Street Food' : 'Multi-cuisine')],
        priceRange: type === 'restaurant' ? '$$$' : (type === 'cafe' ? '$$' : '$'),
        costForTwo: type === 'restaurant' ? 800 : (type === 'cafe' ? 450 : 180),
        rating: parseFloat((4.1 + Math.random() * 0.7).toFixed(1)),
        address,
        lat: el.lat,
        lng: el.lon,
        operatingHours: '11:00 AM - 10:30 PM',
        imageUrl: getImageUrlForType(type, name, el.lat, el.lon),
        popularDishes: getPopularDishesForType(type)
      });

      await seedMenuForEatery(newEatery._id, type);
    }
  } else {
    console.log('🌱 Generating mock eateries around coordinates...');
    const mockNames = [
      { name: 'Zaika Tandoori Nights', type: 'restaurant', cuisines: ['North Indian', 'Mughlai'] },
      { name: 'The Chai Corner & Snacks', type: 'street-food', cuisines: ['Street Food', 'Snacks'] },
      { name: 'Brew & Bake Café', type: 'cafe', cuisines: ['Beverages', 'Bakery', 'Desserts'] },
      { name: 'Udupi Sagar Deluxe', type: 'restaurant', cuisines: ['South Indian', 'Fast Food'] }
    ];

    for (let i = 0; i < mockNames.length; i++) {
      const item = mockNames[i];
      const offsetLat = (Math.random() - 0.5) * 0.02;
      const offsetLng = (Math.random() - 0.5) * 0.02;
      const lat = uLat + offsetLat;
      const lng = uLng + offsetLng;

      let addressName = 'Local Market St';
      try {
        const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: { 'User-Agent': 'FoodSpotApp' }
        });
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData && revData.display_name) {
            addressName = revData.display_name.split(',').slice(0, 3).join(', ');
          }
        }
      } catch (err) {
        console.error('Nominatim reverse geocode failed:', err.message);
      }

      const newEatery = await Eatery.create({
        name: item.name,
        type: item.type,
        description: `Delivering delicious, freshly-made food right to your doorstep.`,
        cuisine: item.cuisines,
        priceRange: item.type === 'restaurant' ? '$$$' : (item.type === 'cafe' ? '$$' : '$'),
        costForTwo: item.type === 'restaurant' ? 700 : (item.type === 'cafe' ? 350 : 120),
        rating: parseFloat((4.2 + Math.random() * 0.6).toFixed(1)),
        address: addressName,
        lat,
        lng,
        operatingHours: '9:00 AM - 11:00 PM',
        imageUrl: getImageUrlForType(item.type, item.name, lat, lng),
        popularDishes: getPopularDishesForType(item.type)
      });

      await seedMenuForEatery(newEatery._id, item.type);
    }
  }
};

// @desc    Get all eateries with search, filters, and distance proximity
// @route   GET /api/eateries
// @access  Public
const getEateries = asyncHandler(async (req, res) => {
  const { type, cuisine, priceRange, q, userLat, userLng } = req.query;

  if (userLat && userLng) {
    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);
    await ensureEateriesNearLocation(uLat, uLng);
  }

  let filter = {};

  if (type) {
    filter.type = type;
  }

  if (cuisine) {
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

  // Dynamically assign unique/hash-based images for each eatery to avoid repetition
  eateries = eateries.map(e => ({
    ...e,
    imageUrl: getImageUrlForType(e.type, e.name, e.lat, e.lng)
  }));

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
    eatery.imageUrl = getImageUrlForType(eatery.type, eatery.name, eatery.lat, eatery.lng);
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
