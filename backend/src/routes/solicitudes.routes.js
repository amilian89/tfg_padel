const express = require('express');
const { solicitarOferta, listarSolicitudes, responderSolicitud } = require('../controllers/solicitudes.controller');

const router = express.Router();

// Ruta para listar solicitudes
router.get('/solicitudes', listarSolicitudes);

// Ruta para responder a una solicitud
router.put('/solicitudes/:id/responder', responderSolicitud);

// Ruta para solicitar una oferta
router.post('/ofertas/:id/solicitar', solicitarOferta);

module.exports = router; 