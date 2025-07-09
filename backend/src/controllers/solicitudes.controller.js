const prisma = require('../prisma/client');

// SOLICITAR OFERTA
const solicitarOferta = async (req, res) => {
  try {
    const { id: ofertaId } = req.params;
    const { demandanteId, mensajeSolicitud } = req.body;

    // Validar campos requeridos
    if (!demandanteId || !mensajeSolicitud) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: demandanteId, mensajeSolicitud'
      });
    }

    // Verificar que la oferta existe
    const oferta = await prisma.oferta.findUnique({
      where: { id: parseInt(ofertaId) }
    });

    if (!oferta) {
      return res.status(404).json({
        error: 'Oferta no encontrada'
      });
    }

    // Verificar que el demandante existe
    const demandante = await prisma.demandante.findUnique({
      where: { id: parseInt(demandanteId) }
    });

    if (!demandante) {
      return res.status(404).json({
        error: 'Demandante no encontrado'
      });
    }

    // Verificar si ya existe una solicitud para este demandante en esta oferta
    const solicitudExistente = await prisma.solicitud.findFirst({
      where: {
        ofertaId: parseInt(ofertaId),
        demandanteId: parseInt(demandanteId)
      }
    });

    if (solicitudExistente) {
      return res.status(400).json({
        error: 'Ya has enviado una solicitud para esta oferta'
      });
    }

    // Crear la nueva solicitud
    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        ofertaId: parseInt(ofertaId),
        demandanteId: parseInt(demandanteId),
        fechaSolicitud: new Date(),
        estado: 'pendiente',
        mensajeSolicitud,
        mensajeRespuesta: null,
        fechaRespuesta: null,
        fechaFinalizacion: null
      },
      include: {
        oferta: {
          select: {
            titulo: true,
            club: {
              select: {
                nombreClub: true
              }
            }
          }
        },
        demandante: {
          select: {
            usuario: {
              select: {
                nombre: true,
                apellidos: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Devolver respuesta exitosa
    res.status(201).json(nuevaSolicitud);

  } catch (error) {
    console.error('Error al solicitar oferta:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// LISTAR SOLICITUDES
const listarSolicitudes = async (req, res) => {
  try {
    const { usuarioId, rol } = req.query;

    // Validar parámetros requeridos
    if (!usuarioId || !rol) {
      return res.status(400).json({
        error: 'Faltan parámetros requeridos: usuarioId, rol'
      });
    }

    // Validar que el rol sea válido
    if (rol !== 'club' && rol !== 'demandante') {
      return res.status(400).json({
        error: 'El rol debe ser "club" o "demandante"'
      });
    }

    let solicitudes = [];

    if (rol === 'demandante') {
      // Buscar el demandante del usuario
      const demandante = await prisma.demandante.findUnique({
        where: { usuarioId: parseInt(usuarioId) }
      });

      if (!demandante) {
        return res.status(400).json({
          error: 'Usuario no encontrado o no es un demandante'
        });
      }

      // Obtener todas las solicitudes del demandante
      solicitudes = await prisma.solicitud.findMany({
        where: {
          demandanteId: demandante.id
        },
        include: {
          oferta: {
            select: {
              titulo: true,
              tipoDeporte: true,
              salario: true,
              ubicacion: true,
              club: {
                select: {
                  nombreClub: true,
                  ciudad: true
                }
              }
            }
          }
        },
        orderBy: {
          fechaSolicitud: 'desc'
        }
      });

    } else if (rol === 'club') {
      // Buscar el club del usuario
      const club = await prisma.club.findUnique({
        where: { usuarioId: parseInt(usuarioId) }
      });

      if (!club) {
        return res.status(400).json({
          error: 'Usuario no encontrado o no es un club'
        });
      }

      // Obtener todas las ofertas del club
      const ofertasDelClub = await prisma.oferta.findMany({
        where: { clubId: club.id },
        select: { id: true }
      });

      const ofertaIds = ofertasDelClub.map(oferta => oferta.id);

      if (ofertaIds.length === 0) {
        return res.status(200).json([]);
      }

      // Obtener todas las solicitudes de las ofertas del club
      solicitudes = await prisma.solicitud.findMany({
        where: {
          ofertaId: {
            in: ofertaIds
          }
        },
        include: {
          oferta: {
            select: {
              titulo: true,
              tipoDeporte: true,
              salario: true,
              ubicacion: true
            }
          },
          demandante: {
            select: {
              usuario: {
                select: {
                  nombre: true,
                  apellidos: true,
                  email: true,
                  telefono: true
                }
              },
              experiencia: true,
              formacion: true
            }
          }
        },
        orderBy: {
          fechaSolicitud: 'desc'
        }
      });
    }

    // Devolver respuesta exitosa
    res.status(200).json(solicitudes);

  } catch (error) {
    console.error('Error al listar solicitudes:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// RESPONDER SOLICITUD
const responderSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, mensajeRespuesta } = req.body;

    // Validar campos requeridos
    if (!estado) {
      return res.status(400).json({
        error: 'El campo estado es requerido'
      });
    }

    // Validar que el estado sea válido
    if (estado !== 'aceptada' && estado !== 'rechazada') {
      return res.status(400).json({
        error: 'El estado debe ser "aceptada" o "rechazada"'
      });
    }

    // Verificar que la solicitud existe
    const solicitudExistente = await prisma.solicitud.findUnique({
      where: { id: parseInt(id) }
    });

    if (!solicitudExistente) {
      return res.status(404).json({
        error: 'Solicitud no encontrada'
      });
    }

    // Verificar que la solicitud esté pendiente
    if (solicitudExistente.estado !== 'pendiente') {
      return res.status(400).json({
        error: 'La solicitud ya ha sido respondida'
      });
    }

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.solicitud.update({
      where: { id: parseInt(id) },
      data: {
        estado,
        mensajeRespuesta: mensajeRespuesta || null,
        fechaRespuesta: new Date()
      },
      include: {
        oferta: {
          select: {
            titulo: true,
            club: {
              select: {
                nombreClub: true
              }
            }
          }
        },
        demandante: {
          select: {
            usuario: {
              select: {
                nombre: true,
                apellidos: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Devolver respuesta exitosa
    res.status(200).json(solicitudActualizada);

  } catch (error) {
    console.error('Error al responder solicitud:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  solicitarOferta,
  listarSolicitudes,
  responderSolicitud
}; 