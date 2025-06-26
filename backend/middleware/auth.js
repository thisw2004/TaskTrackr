const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if not token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user from payload
    req.user = decoded;
    
    // Check if user still exists in database
    const userExists = await User.findById(decoded.id);
    if (!userExists) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed. Please log in again.',
      error: err.message
    });
  }
};