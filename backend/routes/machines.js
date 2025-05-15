// routes/machines.js
const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// GET todas las máquinas
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT actualizar estado de máquina
router.put('/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Máquina no encontrada' });
    
    machine.status = req.body.status;
    const updatedMachine = await machine.save();
    res.json(updatedMachine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;