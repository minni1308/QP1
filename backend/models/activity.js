const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['DEPARTMENT', 'SUBJECT', 'TEACHER', 'SETTINGS'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
    required: true
  }
});

module.exports = mongoose.model('Activity', activitySchema); 