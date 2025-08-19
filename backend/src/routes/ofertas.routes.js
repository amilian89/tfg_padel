const express = require('express');
const { getOfertas, getOfertaPorId, crearOferta, getMisOfertas, deleteOferta } = require('../controllers/ofertas.controller');
const { verifyToken } = require('../middleware/verifyToken');
const { requireRole } = require('../middleware/requireRole');

const router = express.Router();

// Ruta para obtener todas las ofertas (usuarios autenticados)
router.get('/', verifyToken, getOfertas);

// Ruta para obtener mis ofertas (solo club)
router.get('/mias', verifyToken, requireRole('club'), getMisOfertas);

// Ruta para obtener una oferta por ID (usuarios autenticados)
router.get('/:id', verifyToken, getOfertaPorId);

// Ruta para crear nueva oferta (solo club)
router.post('/', verifyToken, requireRole('club'), crearOferta);

// Ruta para eliminar oferta (solo club propietario)
router.delete('/:id', verifyToken, requireRole('club'), deleteOferta);

module.exports = router; 