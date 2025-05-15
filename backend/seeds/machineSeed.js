// backend/seeds/machineSeed.js
const mongoose = require('mongoose');
const Machine = require('../models/Machine');
const config = require('../config/db');

mongoose.connect(config.url);

const machines = [
  { name: 'Barra 1', type: 'Barra', description: 'Barra olímpica para ejercicios de press', status: 'Libre' },
  { name: 'Barra 2', type: 'Barra', description: 'Barra para press de banco', status: 'Libre' },
  { name: 'Barra 3', type: 'Barra', description: 'Barra para sentadillas', status: 'Libre' },
  { name: 'Barra 4', type: 'Barra', description: 'Barra para peso muerto', status: 'Libre' },
  { name: 'Polea 1', type: 'Polea', description: 'Polea alta para espalda', status: 'Libre' },
  { name: 'Polea 2', type: 'Polea', description: 'Polea baja para remo', status: 'Libre' },
  { name: 'Polea 3', type: 'Polea', description: 'Polea para tríceps', status: 'Libre' },
  { name: 'Polea 4', type: 'Polea', description: 'Polea para bíceps', status: 'Libre' },
  { name: 'Polea 5', type: 'Polea', description: 'Crossover izquierdo', status: 'Libre' },
  { name: 'Polea 6', type: 'Polea', description: 'Crossover derecho', status: 'Libre' },
  { name: 'Polea 7', type: 'Polea', description: 'Polea para abdominales', status: 'Libre' },
  { name: 'Polea 8', type: 'Polea', description: 'Polea para hombro', status: 'Libre' }
];

const seedDB = async () => {
  try {
    // Limpiar la colección antes de sembrar nuevos datos
    await Machine.deleteMany({});
    await Machine.insertMany(machines);
    console.log('Base de datos poblada con máquinas');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDB();