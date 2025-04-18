const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), config.secret);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
}; 