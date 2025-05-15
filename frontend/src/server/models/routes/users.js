// src/server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// Actualizar token push
router.put('/push-token', auth, async (req, res) => {
  try {
    const { pushToken } = req.body;
    
    if (!pushToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token push no proporcionado' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pushToken },
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Token push actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar token push:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al actualizar token push' 
    });
  }
});

// Obtener estadísticas de entrenamiento del usuario
router.get('/workout-stats', auth, async (req, res) => {
  try {
    // Cálculo de entrenamientos totales
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
    
    // Cálculo de entrenamientos de la semana actual
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = await Workout.countDocuments({
      user: req.user._id,
      date: { $gte: oneWeekAgo }
    });
    
    // Cálculo de puntos obtenidos en el mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyPointsAggregation = await Workout.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$pointsEarned' }
        }
      }
    ]);
    
    const monthlyPoints = monthlyPointsAggregation.length > 0 
      ? monthlyPointsAggregation[0].totalPoints 
      : 0;
    
    res.json({
      success: true,
      stats: {
        totalWorkouts,
        weeklyWorkouts,
        monthlyPoints
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al obtener estadísticas' 
    });
  }
});

// Actualizar perfil de usuario
router.put('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'profilePicture'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).json({ 
      success: false, 
      message: 'Actualizaciones no válidas' 
    });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    
    // Eliminar la contraseña del objeto que se devuelve
    const userObject = user.toObject();
    delete userObject.password;
    
    res.json({
      success: true,
      user: userObject
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al actualizar perfil' 
    });
  }
});

module.exports = router;