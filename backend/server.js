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
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/eateries', require('./routes/eateryRoutes'));



// Serve frontend in production / API status in development
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

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
