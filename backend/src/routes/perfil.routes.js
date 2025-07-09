const express = require('express');
const { getPerfil, actualizarPerfil } = require('../controllers/perfil.controller');

const router = express.Router();

// Ruta para obtener perfil de usuario
router.get('/perfil/:usuarioId', getPerfil);

// Ruta para actualizar perfil de usuario
router.put('/perfil/:usuarioId', actualizarPerfil);

module.exports = router; 