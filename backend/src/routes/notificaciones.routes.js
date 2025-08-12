const express = require('express');
const router = express.Router();
const { 
  listarNotificaciones, 
  marcarComoLeida, 
  obtenerContadorNoLeidas 
} = require('../controllers/notificaciones.controller');
const { verifyToken } = require('../middleware/verifyToken');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /notificaciones - Listar notificaciones con paginación
router.get('/', listarNotificaciones);

// PUT /notificaciones/:id/leida - Marcar notificación como leída
router.put('/:id/leida', marcarComoLeida);

// GET /notificaciones/unread-count - Obtener contador de no leídas
router.get('/unread-count', obtenerContadorNoLeidas);

module.exports = router; 