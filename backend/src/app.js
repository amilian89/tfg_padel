const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const ofertasRoutes = require('./routes/ofertas.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/ofertas', ofertasRoutes);
app.use('/', solicitudesRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
