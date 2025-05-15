// backend/models/Waitlist.js
const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Waitlist', WaitlistSchema);