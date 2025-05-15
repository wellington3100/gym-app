// backend/models/Machine.js
const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Barra', 'Polea'], required: true },
  description: { type: String },
  status: { type: String, enum: ['Libre', 'Ocupado'], default: 'Libre' }
});

module.exports = mongoose.model('Machine', machineSchema);