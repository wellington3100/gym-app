// backend/routes/waitlist.js
const express = require('express');
const router = express.Router();
const Waitlist = require('../models/Waitlist');
const Machine = require('../models/Machine');

// Obtener lista de espera para una máquina - SIN AUTENTICACIÓN
router.get('/:machineId', async (req, res) => {
  try {
    console.log(`Solicitud para obtener lista de espera para máquina ${req.params.machineId}`);
    const waitlist = await Waitlist.find({ machine: req.params.machineId })
      .populate('user', 'name')
      .sort({ timestamp: 1 });
    
    res.json({
      success: true,
      waitlist
    });
  } catch (error) {
    console.error('Error al obtener lista de espera:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// Unirse a la lista de espera - SIN AUTENTICACIÓN
router.post('/:machineId', async (req, res) => {
  try {
    console.log(`Solicitud para unirse a lista de espera para máquina ${req.params.machineId}`);
    
    // Para simplificar, usamos un ID de usuario hardcoded
    const userId = req.body.userId || "5f7f7b1c1c9d440000b9e123"; // ID ficticio
    
    // Verificar si la máquina existe
    const machine = await Machine.findById(req.params.machineId);
    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Máquina no encontrada'
      });
    }
    
    // Añadir a la lista de espera
    const waitlistEntry = new Waitlist({
      machine: req.params.machineId,
      user: userId,
      timestamp: new Date()
    });
    
    await waitlistEntry.save();
    
    res.status(201).json({
      success: true,
      waitlistEntry: {
        _id: waitlistEntry._id,
        user: {
          _id: userId,
          name: "Usuario Actual" // Nombre ficticio para simplificar
        },
        timestamp: waitlistEntry.timestamp
      }
    });
  } catch (error) {
    console.error('Error al unirse a la lista de espera:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

module.exports = router;