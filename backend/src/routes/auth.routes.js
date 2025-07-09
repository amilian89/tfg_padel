const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// Ruta para registro de usuarios
router.post('/register', register);

// Ruta para login de usuarios
router.post('/login', login);

module.exports = router;
