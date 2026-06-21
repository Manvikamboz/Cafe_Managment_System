/**
 * Seed Script — run to populate the Atlas DB with initial eateries & menu items across India
 * Usage: node backend/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Eatery = require('./models/Eatery');
const MenuItem = require('./models/MenuItem');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to Atlas');

  console.log('🧹 Clearing existing eateries and menu items...');
  await Eatery.deleteMany({});
  await MenuItem.deleteMany({});

  console.log('🌱 Seeding eateries across India...');

  const eateries = await Eatery.insertMany([
    // Delhi (North)
    {
      name: 'Connaught Place Diner',
      type: 'restaurant',
      description: 'Elegant dining experience with rich North Indian butter chicken, dal makhani, and stuffed naans.',
      cuisine: ['North Indian', 'Mughlai'],
      priceRange: '$$$',
      costForTwo: 1200,
      rating: 4.6,
      address: 'Block H, Connaught Place, New Delhi',
      lat: 28.6304, lng: 77.2177,
      operatingHours: '11:00 AM - 11:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Butter Chicken', 'Dal Makhani', 'Garlic Naan']
    },
    {
      name: 'Karol Bagh Chole Bhature',
      type: 'street-food',
      description: 'Famous spicy chole and large fluffy bhature served with pickle and green chillies.',
      cuisine: ['North Indian', 'Street Food'],
      priceRange: '$',
      costForTwo: 180,
      rating: 4.7,
      address: 'Karol Bagh Market, New Delhi',
      lat: 28.6441, lng: 77.1881,
      operatingHours: '8:00 AM - 4:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Chole Bhature', 'Lassi']
    },
    // Mumbai (West)
    {
      name: 'Bandra Coastal Kitchen',
      type: 'restaurant',
      description: 'Authentic Maharashtrian and coastal Konkan seafood specialities prepared with fresh spices.',
      cuisine: ['Seafood', 'Coastal', 'Maharashtrian'],
      priceRange: '$$$',
      costForTwo: 1500,
      rating: 4.5,
      address: 'Carter Road, Bandra West, Mumbai',
      lat: 19.0596, lng: 72.8295,
      operatingHours: '12:00 PM - 11:30 PM',
      imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Surmai Fry', 'Prawns Koliwada', 'Sol Kadhi']
    },
    {
      name: 'Colaba Cafe House',
      type: 'cafe',
      description: 'Charming vintage cafe serving local bakery specialities, bun maska, and cutting chai.',
      cuisine: ['Beverages', 'Dessert', 'Bakery'],
      priceRange: '$$',
      costForTwo: 450,
      rating: 4.4,
      address: 'Colaba Causeway, Mumbai',
      lat: 18.9220, lng: 72.8347,
      operatingHours: '7:00 AM - 10:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Bun Maska', 'Irani Chai', 'Mawa Cake']
    },
    // Bangalore (South)
    {
      name: 'The Gourmet Bistro',
      type: 'restaurant',
      description: 'An elegant dining experience featuring authentic Italian pastas, fresh organic salads, and fine desserts.',
      cuisine: ['Italian', 'Continental', 'Salads'],
      priceRange: '$$$',
      costForTwo: 1200,
      rating: 4.6,
      address: '102 MG Road, Bangalore',
      lat: 12.9716, lng: 77.5946,
      operatingHours: '11:00 AM - 11:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Truffle Pasta', 'Wild Berry Salad', 'Amethyst Mousse']
    },
    {
      name: 'South Spice Kitchen',
      type: 'restaurant',
      description: 'Authentic South Indian restaurant serving crispy ghee roast dosas, filter coffee, and idli vada combos.',
      cuisine: ['South Indian', 'Karnataka'],
      priceRange: '$$',
      costForTwo: 400,
      rating: 4.6,
      address: '77 Jayanagar 4th Block, Bangalore',
      lat: 12.9620, lng: 77.6010,
      operatingHours: '7:30 AM - 9:30 PM',
      imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Ghee Roast Dosa', 'Filter Coffee', 'Idli Vada Combo']
    },
    // Kolkata (East)
    {
      name: 'Park Street Kathi Roll',
      type: 'street-food',
      description: 'Home of the original Kolkata kathi roll, loaded with juicy grilled fillings and special zesty sauces.',
      cuisine: ['Bengali', 'Street Food', 'Snacks'],
      priceRange: '$',
      costForTwo: 200,
      rating: 4.7,
      address: 'Park Street Crossing, Kolkata',
      lat: 22.5530, lng: 88.3512,
      operatingHours: '12:00 PM - 10:00 PM',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80',
      popularDishes: ['Double Egg Chicken Roll', 'Paneer Tikka Roll']
    }
  ]);

  console.log(`✅ Seeded ${eateries.length} eateries across India`);

  const cpDiner = eateries.find(e => e.name === 'Connaught Place Diner');
  const kbChole = eateries.find(e => e.name === 'Karol Bagh Chole Bhature');
  const coastal = eateries.find(e => e.name === 'Bandra Coastal Kitchen');
  const colaba  = eateries.find(e => e.name === 'Colaba Cafe House');
  const bistro  = eateries.find(e => e.name === 'The Gourmet Bistro');
  const south   = eateries.find(e => e.name === 'South Spice Kitchen');
  const kolkata = eateries.find(e => e.name === 'Park Street Kathi Roll');

  const menuItems = await MenuItem.insertMany([
    // Delhi Menu
    { name: 'Special Butter Chicken', price: 420, category: 'Main Course', eatery: cpDiner._id, description: 'Tender tandoori chicken cooked in a rich, creamy tomato butter sauce', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' },
    { name: 'Slow Cooked Dal Makhani', price: 320, category: 'Main Course', eatery: cpDiner._id, description: 'Black lentils slow cooked overnight with butter and fresh cream', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Garlic Butter Naan', price: 80, category: 'Bread', eatery: cpDiner._id, description: 'Traditional leavened flatbread topped with chopped garlic and butter', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
    
    { name: 'Paneer Stuffed Bhature Plate', price: 140, category: 'Main Course', eatery: kbChole._id, description: 'Two large golden bhature stuffed with spiced paneer, served with spicy chole curry', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' },
    { name: 'Chilled Sweet Lassi', price: 80, category: 'Beverages', eatery: kbChole._id, description: 'Thick creamy sweet yogurt drink served in a traditional clay kulhad', imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&w=400&q=80' },

    // Mumbai Menu
    { name: 'Surmai Fry Tali', price: 480, category: 'Main Course', eatery: coastal._id, description: 'Fresh king fish shallow fried in Malvani spices, served with curry, rice, and bhakri', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Konkan Prawns Koliwada', price: 380, category: 'Starters', eatery: coastal._id, description: 'Crispy batter-fried prawns spiced with local Koli masala', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80' },
    { name: 'Sol Kadhi', price: 90, category: 'Beverages', eatery: coastal._id, description: 'Refreshing pink drink made from kokum extract and fresh coconut milk with hints of garlic', imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=400&q=80' },

    { name: 'Bun Maska Toast', price: 80, category: 'Snacks', eatery: colaba._id, description: 'Soft sweet bun toasted and generously loaded with local salted butter', imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80' },
    { name: 'Special Irani Chai', price: 60, category: 'Beverages', eatery: colaba._id, description: 'Rich, creamy and thick black tea slow-brewed with sweet condensed milk', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },

    // Bangalore Menu
    { name: 'Truffle Purple Gnocchi', price: 380, category: 'Main Course', eatery: bistro._id, description: 'Handmade purple potato gnocchi with white truffle cream sauce', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80' },
    { name: 'Wild Berry Salad', price: 260, category: 'Salads', eatery: bistro._id, description: 'Fresh seasonal berries, goat cheese, glazed walnuts, and aged balsamic reduction', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
    
    { name: 'Ghee Roast Dosa', price: 95, category: 'Dosa', eatery: south._id, description: 'Crispy golden crepe roasted with pure ghee, served with sambar and trio of chutneys', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80' },
    { name: 'Traditional Filter Coffee', price: 45, category: 'Coffee', eatery: south._id, description: 'Authentic chicory blend frothed with hot milk in a traditional brass tumbler', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },

    // Kolkata Menu
    { name: 'Double Egg Chicken Kathi Roll', price: 130, category: 'Snacks', eatery: kolkata._id, description: 'Flaky paratha layered with egg, stuffed with grilled chicken chunks, onions and spices', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
  ]);

  console.log(`✅ Seeded ${menuItems.length} menu items`);
  console.log('🎉 Database seed complete!');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
