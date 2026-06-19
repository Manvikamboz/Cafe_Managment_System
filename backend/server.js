// Smart Café Server initialized
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const socketService = require('./services/socketService');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socketService.init(server);

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/eateries', require('./routes/eateryRoutes'));

// Seed function
const Eatery = require('./models/Eatery');
const MenuItem = require('./models/MenuItem');

async function seedMenu() {
  const eateryCount = await Eatery.countDocuments();
  if (eateryCount === 0) {
    console.log('Database empty. Seeding eateries and menus...');
    
    // 1. Create Eateries
    const eateries = [
      {
        name: 'The Gourmet Bistro',
        type: 'restaurant',
        description: 'An elegant dining experience featuring authentic Italian pastas, fresh organic salads, and fine desserts.',
        cuisine: ['Italian', 'Continental', 'Salads'],
        priceRange: '$$$',
        costForTwo: 1200,
        rating: 4.6,
        address: '102 MG Road, Bangalore',
        lat: 12.9716,
        lng: 77.5946,
        operatingHours: '11:00 AM - 11:00 PM',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        popularDishes: ['Truffle Pasta', 'Wild Berry Salad', 'Amethyst Mousse']
      },
      {
        name: 'Corner House Café',
        type: 'cafe',
        description: 'Cozy neighborhood cafe serving specialty brews, fresh pastries, waffles, and hand-crafted desserts.',
        cuisine: ['Beverages', 'Dessert', 'Bakery'],
        priceRange: '$$',
        costForTwo: 500,
        rating: 4.5,
        address: '45 Indiranagar Double Rd, Bangalore',
        lat: 12.9750,
        lng: 77.5990,
        operatingHours: '10:00 AM - 10:30 PM',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        popularDishes: ['Rose Petal Latte', 'Lavender Honey Cake', 'Blueberry Waffles']
      },
      {
        name: 'Sharma Ji Ki Famous Chaat',
        type: 'street-food',
        description: 'Legendary street food stall known for mouth-watering spicy chaat, crispy samosas, and chilled yogurt blends.',
        cuisine: ['North Indian', 'Street Food', 'Snacks'],
        priceRange: '$',
        costForTwo: 150,
        rating: 4.7,
        address: 'Shop 12, Koramangala 5th Block, Bangalore',
        lat: 12.9690,
        lng: 77.5890,
        operatingHours: '4:00 PM - 9:30 PM',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80',
        popularDishes: ['Aloo Tikki Chaat', 'Gol Gappa', 'Samosa Kachori']
      },
      {
        name: 'South Spice Kitchen',
        type: 'restaurant',
        description: 'Authentic South Indian restaurant serving crispy ghee dosas, filter coffee, and traditional Chettinad curries.',
        cuisine: ['South Indian', 'Chettinad'],
        priceRange: '$$',
        costForTwo: 400,
        rating: 4.4,
        address: '77 Jayanagar 4th Block, Bangalore',
        lat: 12.9620,
        lng: 77.6010,
        operatingHours: '7:30 AM - 9:30 PM',
        imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
        popularDishes: ['Ghee Roast Dosa', 'Filter Coffee', 'Idli Vada Combo']
      },
      {
        name: 'Golden Dragon Express',
        type: 'restaurant',
        description: 'Chinatown-style diner bringing you spicy Hakka noodles, steamed dim sums, and delicious pan-Asian favorites.',
        cuisine: ['Chinese', 'Thai', 'Asian'],
        priceRange: '$$',
        costForTwo: 700,
        rating: 4.2,
        address: '14 Malleshwaram 15th Cross, Bangalore',
        lat: 12.9810,
        lng: 77.5850,
        operatingHours: '12:00 PM - 10:30 PM',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        popularDishes: ['Hakka Noodles', 'Spring Rolls', 'Dim Sums']
      }
    ];

    const createdEateries = await Eatery.insertMany(eateries);
    console.log(`Seeded ${createdEateries.length} eateries.`);

    // 2. Create Menu Items referencing created eateries
    const menuItems = [];

    // The Gourmet Bistro items
    const bistro = createdEateries.find(e => e.name === 'The Gourmet Bistro');
    menuItems.push(
      { name: 'Truffle Purple Gnocchi', description: 'Handmade purple potato gnocchi with white truffle cream sauce', price: 380, category: 'Main Course', eatery: bistro._id, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80' },
      { name: 'Wild Berry Salad', description: 'Fresh seasonal berries, goat cheese, glazed walnuts, and aged balsamic reduction', price: 260, category: 'Salads', eatery: bistro._id, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
      { name: 'Amethyst Blueberry Mousse', description: 'Blueberry mirror-glazed mousse on a white chocolate sponge base', price: 180, category: 'Dessert', eatery: bistro._id, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80' }
    );

    // Corner House Café items
    const cafe = createdEateries.find(e => e.name === 'Corner House Café');
    menuItems.push(
      { name: 'Rose Petal Latte', description: 'Velvety espresso with rose-infused warm milk, sweetened with organic honey', price: 150, category: 'Coffee', eatery: cafe._id, imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Lavender Honey Cake', description: 'Spongy layer cake with lavender hints and organic wildflower honey frosting', price: 140, category: 'Dessert', eatery: cafe._id, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sparkling Hibiscus Tea', description: 'Chilled cold-brewed organic hibiscus tea with club soda and fresh mint', price: 120, category: 'Beverage', eatery: cafe._id, imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=400&q=80' }
    );

    // Sharma Ji Ki Famous Chaat items
    const chaat = createdEateries.find(e => e.name === 'Sharma Ji Ki Famous Chaat');
    menuItems.push(
      { name: 'Aloo Tikki Chaat', description: 'Crispy potato patties topped with spicy mint chutney, sweet tamarind chutney, and curd', price: 60, category: 'Chaat', eatery: chaat._id, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' },
      { name: 'Gol Gappa (Pani Puri)', description: 'Crispy semolina puris filled with potato, chickpeas, and refreshing tangy spiced water', price: 40, category: 'Chaat', eatery: chaat._id, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
      { name: 'Samosa Kachori Plate', description: 'One potato samosa and one kachori crushed and served with hot yellow peas curry and sev', price: 70, category: 'Snacks', eatery: chaat._id, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80' }
    );

    // South Spice Kitchen items
    const south = createdEateries.find(e => e.name === 'South Spice Kitchen');
    menuItems.push(
      { name: 'Ghee Roast Dosa', description: 'Crispy golden crepe roasted with pure ghee, served with sambar and trio of chutneys', price: 90, category: 'Dosa', eatery: south._id, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80' },
      { name: 'Idli Vada Combo', description: 'Two steamed fluffy rice cakes and one crispy lentil donut served piping hot', price: 70, category: 'Breakfast', eatery: south._id, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
      { name: 'Traditional Filter Coffee', description: 'Authentic chicory blend frothed with hot milk in a traditional brass tumbler', price: 45, category: 'Coffee', eatery: south._id, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' }
    );

    // Golden Dragon Express items
    const dragon = createdEateries.find(e => e.name === 'Golden Dragon Express');
    menuItems.push(
      { name: 'Spicy Hakka Noodles', description: 'Stir-fried noodles tossed with fresh julienned vegetables and spicy schezwan sauce', price: 160, category: 'Noodles', eatery: dragon._id, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
      { name: 'Veg Spring Rolls', description: 'Crispy golden fried wrappers stuffed with seasoned cabbage, carrots, and glass noodles', price: 130, category: 'Starters', eatery: dragon._id, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
      { name: 'Steamed Crystal Dim Sums', description: 'Delicate translucent dumplings filled with minced exotic vegetables and water chestnuts', price: 180, category: 'Starters', eatery: dragon._id, imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80' }
    );

    await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${menuItems.length} menu items.`);
  }
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedMenu();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('\n========================================================================');
    console.error('⚠️  CRITICAL DATABASE CONNECTION ERROR');
    console.error('------------------------------------------------------------------------');
    console.error(`Error details: ${error.message}`);
    console.error('------------------------------------------------------------------------');
    console.error('Please ensure that:');
    console.error('1. MongoDB is installed and running on your local machine.');
    console.error('   To start MongoDB locally (Linux): sudo systemctl start mongod');
    console.error('2. Or, configure a valid cloud MONGO_URI in your backend/.env file.');
    console.error('========================================================================\n');

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

startServer();
