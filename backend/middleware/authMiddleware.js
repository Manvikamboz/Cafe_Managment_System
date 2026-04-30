const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
    ? req.headers.authorization.split(' ')[1] 
    : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error(`User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`);
    }
  };
};

module.exports = { protect, authorize };
