const express = require('express');
const { getPerfil, actualizarPerfil, getMiPerfil, actualizarMiPerfil } = require('../controllers/perfil.controller');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Rutas para obtener y actualizar el perfil del usuario autenticado
router.get('/usuarios/perfil', verifyToken, getMiPerfil);
router.put('/usuarios/perfil', verifyToken, actualizarMiPerfil);

// Rutas existentes para obtener perfil de usuario específico (usuarios autenticados)
router.get('/:usuarioId', verifyToken, getPerfil);

// Ruta para actualizar perfil de usuario específico (usuarios autenticados)
router.put('/:usuarioId', verifyToken, actualizarPerfil);

module.exports = router; 