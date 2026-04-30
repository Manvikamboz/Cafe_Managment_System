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

// Connect to Database
connectDB();

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

// Seed function (keeping a version of it)
const MenuItem = require('./models/MenuItem');
async function seedMenu() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    const items = [
      { name: 'Rose Petal Latte', description: 'Velvety espresso with rose-infused milk and organic honey', price: 5.5, category: 'Coffee', imageUrl: '/images/latte.png' },
      { name: 'Amethyst Mousse', description: 'Blueberry mirror-glazed mousse with white chocolate base', price: 8.0, category: 'Dessert', imageUrl: '/images/mousse.png' },
      { name: 'Raspberry Cloud Croissant', description: 'Flaky pastry filled with raspberry cream and rose dust', price: 6.5, category: 'Pastry', imageUrl: '/images/croissant.png' },
      { name: 'Pink Dragon Smoothie', description: 'Pitaya, mango, and coconut milk blend', price: 7.5, category: 'Beverage', imageUrl: '' },
      { name: 'Truffle Purple Gnocchi', description: 'Handmade purple potato gnocchi with truffle cream', price: 18.0, category: 'Main', imageUrl: '' },
      { name: 'Lavender Honey Cake', description: 'Spongy cake with lavender hints and honey frosting', price: 7.0, category: 'Dessert', imageUrl: '' },
      { name: 'Sparkling Hibiscus Tea', description: 'Cold-brewed hibiscus with sparkling water and mint', price: 4.5, category: 'Beverage', imageUrl: '' },
      { name: 'Wild Berry Salad', description: 'Fresh berries, goat cheese, and balsamic glaze', price: 12.0, category: 'Salad', imageUrl: '' }
    ];
    await MenuItem.insertMany(items);
    console.log('Seeded expanded gourmet menu items');
  }
}
seedMenu();

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
