// src/server/models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;