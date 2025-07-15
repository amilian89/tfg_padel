const express = require('express');
const { getOfertas, getOfertaPorId, crearOferta } = require('../controllers/ofertas.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Ruta para obtener todas las ofertas (usuarios autenticados)
router.get('/', verifyToken, getOfertas);

// Ruta para obtener una oferta por ID (usuarios autenticados)
router.get('/:id', verifyToken, getOfertaPorId);

// Ruta para crear nueva oferta (solo club)
router.post('/', verifyToken, requireRole('club'), crearOferta);

module.exports = router; 