// src/server/models/Machine.js
const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['cardio', 'strength', 'functional', 'other']
  },
  location: {
    x: Number, // Coordenada X en el mapa del gimnasio
    y: Number, // Coordenada Y en el mapa del gimnasio
    zone: String // Zona del gimnasio (e.g., "Cardio", "Pesas", etc.)
  },
  image: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance'],
    default: 'available'
  },
  qrCode: {
    type: String,
    unique: true
  }
});

const Machine = mongoose.model('Machine', MachineSchema);

module.exports = Machine;