const express = require('express');
const { getPerfil, actualizarPerfil } = require('../controllers/perfil.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Ruta para obtener perfil de usuario (usuarios autenticados)
router.get('/:usuarioId', verifyToken, getPerfil);

// Ruta para actualizar perfil de usuario (usuarios autenticados)
router.put('/:usuarioId', verifyToken, actualizarPerfil);

module.exports = router; 