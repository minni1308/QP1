const express = require('express');
const router = express.Router();
const Activity = require('../../models/activity');
const authenticate = require('../../authenticate');
const cors = require('../cors');

// Get recent activities
router.get('/', [cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin], async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, message: 'Error fetching activities' });
  }
});

// Add new activity
router.post('/', [cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin], async (req, res) => {
  try {
    const { description, type } = req.body;
    
    const activity = new Activity({
      description,
      type,
      timestamp: new Date(),
      user: req.user._id
    });

    await activity.save();
    res.json({ success: true, activity });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ success: false, message: 'Error adding activity' });
  }
});

module.exports = router; 