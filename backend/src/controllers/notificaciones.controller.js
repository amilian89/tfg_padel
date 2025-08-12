const prisma = require('../prisma/client');

// LISTAR NOTIFICACIONES CON PAGINACIÓN
const listarNotificaciones = async (req, res) => {
  try {
    const { usuarioId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Validar parámetros
    if (!usuarioId) {
      return res.status(400).json({
        error: 'Falta parámetro requerido: usuarioId'
      });
    }

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        error: 'Parámetros de paginación inválidos'
      });
    }

    const skip = (page - 1) * pageSize;

    // Obtener notificaciones del usuario
    const notificaciones = await prisma.notificacion.findMany({
      where: {
        usuarioId: parseInt(usuarioId)
      },
      orderBy: {
        fechaCreacion: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    // Obtener total de notificaciones
    const total = await prisma.notificacion.count({
      where: {
        usuarioId: parseInt(usuarioId)
      }
    });

    res.status(200).json({
      items: notificaciones,
      page: page,
      pageSize: pageSize,
      total: total,
      hasMore: skip + notificaciones.length < total
    });

  } catch (error) {
    console.error('Error al listar notificaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// MARCAR NOTIFICACIÓN COMO LEÍDA
const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la notificación existe
    const notificacion = await prisma.notificacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notificacion) {
      return res.status(404).json({
        error: 'Notificación no encontrada'
      });
    }

    // Marcar como leída
    const notificacionActualizada = await prisma.notificacion.update({
      where: { id: parseInt(id) },
      data: {
        leida: true
      }
    });

    res.status(200).json(notificacionActualizada);

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// OBTENER CONTADOR DE NOTIFICACIONES NO LEÍDAS
const obtenerContadorNoLeidas = async (req, res) => {
  try {
    const { usuarioId } = req.query;

    if (!usuarioId) {
      return res.status(400).json({
        error: 'Falta parámetro requerido: usuarioId'
      });
    }

    const contador = await prisma.notificacion.count({
      where: {
        usuarioId: parseInt(usuarioId),
        leida: false
      }
    });

    res.status(200).json({
      contador: contador
    });

  } catch (error) {
    console.error('Error al obtener contador de notificaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// CREAR NOTIFICACIÓN (helper interno)
const crearNotificacion = async (usuarioId, tipo, contenido, urlRedireccion) => {
  try {
    return await prisma.notificacion.create({
      data: {
        usuarioId: parseInt(usuarioId),
        tipo,
        contenido,
        urlRedireccion,
        fechaCreacion: new Date(),
        leida: false
      }
    });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

module.exports = {
  listarNotificaciones,
  marcarComoLeida,
  obtenerContadorNoLeidas,
  crearNotificacion
}; 