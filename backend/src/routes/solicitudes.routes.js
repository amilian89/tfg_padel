const express = require('express');
const { solicitarOferta, listarSolicitudes, responderSolicitud } = require('../controllers/solicitudes.controller');
const { verifyToken } = require('../middleware/verifyToken');
const { requireRole } = require('../middleware/requireRole');

const router = express.Router();

// Ruta para listar solicitudes (usuarios autenticados)
router.get('/', verifyToken, listarSolicitudes);

// Ruta para responder a una solicitud (solo club)
router.put('/:id/responder', verifyToken, requireRole('club'), responderSolicitud);

// Ruta para solicitar una oferta (solo demandante)
router.post('/ofertas/:id/solicitar', verifyToken, requireRole('demandante'), solicitarOferta);

module.exports = router; 