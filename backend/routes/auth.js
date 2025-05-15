// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de autenticación funcionando' });
});

// Registrar usuario
router.post('/register', async (req, res) => {
  console.log('---------------------');
  console.log('Solicitud de registro recibida:');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  
  try {
    const { name, email, password } = req.body;
    
    // Verificar que se proporcionaron todos los campos
    if (!name || !email || !password) {
      console.log('Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }
    
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      console.log('Usuario ya existe:', email);
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }
    
    // Crear nuevo usuario
    user = new User({
      name,
      email,
      password
    });
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Guardar usuario
    await user.save();
    console.log('Usuario guardado correctamente:', {
      id: user._id,
      name: user.name,
      email: user.email
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.toString()
    });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  console.log('---------------------');
  console.log('Solicitud de login recibida:');
  console.log('Email:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para:', email);
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user._id },
      'mysecretkey',
      { expiresIn: '1h' }
    );
    
    console.log('Login exitoso para:', email);
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.toString()
    });
  }
});

module.exports = router;
module.exports = router;