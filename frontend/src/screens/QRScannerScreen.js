// backend/seeds/machineSeed.js
const mongoose = require('mongoose');
const Machine = require('../models/Machine');
const config = require('../config/db');

mongoose.connect(config.url)
  .then(() => console.log('Conectado a MongoDB para sembrar datos'))
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });

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
    console.log('Colección de máquinas limpiada');
    
    // Insertar las nuevas máquinas
    const result = await Machine.insertMany(machines);
    console.log(`Se insertaron ${result.length} máquinas en la base de datos`);
    
    // Cerrar la conexión
    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  } catch (err) {
    console.error('Error al sembrar la base de datos:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Ejecutar la función para sembrar la base de datos
seedDB();