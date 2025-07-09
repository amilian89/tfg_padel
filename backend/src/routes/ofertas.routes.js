const express = require('express');
const { getOfertas, getOfertaPorId, crearOferta } = require('../controllers/ofertas.controller');

const router = express.Router();

// Ruta para obtener todas las ofertas
router.get('/', getOfertas);

// Ruta para obtener una oferta por ID
router.get('/:id', getOfertaPorId);

// Ruta para crear nueva oferta
router.post('/', crearOferta);

module.exports = router; 