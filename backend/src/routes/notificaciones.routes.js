const express = require('express');
const { crearNotificacion, listarNotificaciones } = require('../controllers/notificaciones.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Ruta para crear una notificación (usuarios autenticados)
router.post('/', verifyToken, crearNotificacion);

// Ruta para listar notificaciones de un usuario (usuarios autenticados)
router.get('/:usuarioId', verifyToken, listarNotificaciones);

module.exports = router; 