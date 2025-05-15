// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/db');

// Importar rutas
const machineRoutes = require('./routes/machines');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 55000;  // Cambiado a 55000

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(config.url)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Rutas
app.use('/api/machines', machineRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de GymApp' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});