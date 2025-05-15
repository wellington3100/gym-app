// src/server/models/Workout.js
const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine'
  },
  exercise: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // en minutos
    required: true
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
