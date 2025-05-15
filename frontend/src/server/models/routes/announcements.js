// src/server/routes/announcements.js
const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Obtener todos los anuncios activos
router.get('/', auth, async (req, res) => {
  try {
    const currentDate = new Date();
    
    const announcements = await Announcement.find({
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: currentDate } }
      ]
    })
    .sort({ date: -1, priority: -1 })
    .limit(10);
    
    res.json({
      success: true,
      announcements
    });
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener anuncios' 
    });
  }
});

// Obtener un anuncio específico por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anuncio no encontrado' 
      });
    }
    
    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error al obtener anuncio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener anuncio' 
    });
  }
});

// Crear un nuevo anuncio (solo admin)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { title, content, image, expiresAt, priority } = req.body;
    
    const announcement = new Announcement({
      title,
      content,
      image,
      expiresAt,
      priority,
      createdBy: req.user._id
    });
    
    await announcement.save();
    
    res.status(201).json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error al crear anuncio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al crear anuncio' 
    });
  }
});

// Actualizar un anuncio (solo admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'content', 'image', 'expiresAt', 'priority'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).json({ 
      success: false, 
      message: 'Actualizaciones no válidas' 
    });
  }
  
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anuncio no encontrado' 
      });
    }
    
    updates.forEach(update => announcement[update] = req.body[update]);
    await announcement.save();
    
    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    console.error('Error al actualizar anuncio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al actualizar anuncio' 
    });
  }
});

// Eliminar un anuncio (solo admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anuncio no encontrado' 
      });
    }
    
    res.json({
      success: true,
      message: 'Anuncio eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al eliminar anuncio' 
    });
  }
});

module.exports = router;