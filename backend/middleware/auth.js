// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No hay token, autorización denegada'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');

    // Agregar usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({
      success: false,
      message: 'Token no válido'
    });
  }
};