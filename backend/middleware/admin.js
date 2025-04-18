module.exports = function(req, res, next) {
  // Check if user exists and is admin
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  next();
}; 