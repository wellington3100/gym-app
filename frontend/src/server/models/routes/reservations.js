// src/server/routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Machine = require('../models/Machine');
const auth = require('../middleware/auth');
const { sendPushNotification } = require('../utils/notifications');

// Obtener próxima reserva
router.get('/upcoming', auth, async (req, res) => {
  try {
    const currentDate = new Date();
    
    const reservation = await Reservation.findOne({
      user: req.user._id,
      startTime: { $gt: currentDate },
      status: 'scheduled'
    })
    .sort({ startTime: 1 })
    .populate('machine');
    
    if (!reservation) {
      return res.json({
        success: true,
        reservation: null
      });
    }
    
    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Error al obtener reserva próxima:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener reserva próxima' 
    });
  }
});

// Obtener todas las reservas del usuario
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    const reservations = await Reservation.find(query)
      .sort({ startTime: -1 })
      .populate('machine');
    
    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener reservas' 
    });
  }
});

// Crear una nueva reserva
router.post('/', auth, async (req, res) => {
  try {
    const { machineId, exercise, startTime, endTime } = req.body;
    
    // Verificar que la máquina existe
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ 
        success: false, 
        message: 'Máquina no encontrada' 
      });
    }
    
    // Verificar disponibilidad
    const conflictingReservation = await Reservation.findOne({
      machine: machineId,
      status: 'scheduled',
      $or: [
        { 
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });
    
    if (conflictingReservation) {
      return res.status(400).json({ 
        success: false, 
        message: 'La máquina ya está reservada para este horario' 
      });
    }
    
    // Crear la reserva
    const reservation = new Reservation({
      user: req.user._id,
      machine: machineId,
      exercise,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'scheduled'
    });
    
    await reservation.save();
    
    // Actualizar estado de la máquina si la reserva es inmediata
    const currentDate = new Date();
    const reservationStartTime = new Date(startTime);
    
    if (reservationStartTime <= currentDate) {
      machine.status = 'in-use';
      await machine.save();
    }
    
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('machine');
    
    res.status(201).json({
      success: true,
      reservation: populatedReservation
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al crear reserva' 
    });
  }
});

// Obtener detalles de una reserva específica
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('machine');
    
    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reserva no encontrada' 
      });
    }
    
    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Error al obtener detalles de reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener detalles de reserva' 
    });
  }
});

// Cancelar una reserva
router.delete('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'scheduled'
    });
    
    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reserva no encontrada o no puede ser cancelada' 
      });
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    // Actualizar estado de la máquina si estaba en uso
    const machine = await Machine.findById(reservation.machine);
    if (machine && machine.status === 'in-use') {
      machine.status = 'available';
      await machine.save();
    }
    
    res.json({
      success: true,
      message: 'Reserva cancelada correctamente'
    });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al cancelar reserva' 
    });
  }
});

module.exports = router;