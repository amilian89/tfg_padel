function requireRole(rolEsperado) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== rolEsperado) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
}

module.exports = requireRole; 