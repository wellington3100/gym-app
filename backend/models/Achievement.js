// backend/models/Achievement.js
const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', AchievementSchema);