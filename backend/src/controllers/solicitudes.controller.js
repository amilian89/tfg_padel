const prisma = require('../prisma/client');
const { emitToUser } = require('../realtime/pusher');
const { crearNotificacion } = require('./notificaciones.controller');

// SOLICITAR OFERTA
const solicitarOferta = async (req, res) => {
  try {
    const { id: ofertaId } = req.params;
    const { mensajeSolicitud } = req.body;

    // Obtener el usuario autenticado del token JWT
    const usuarioId = req.usuario.id;

    // Validar campos requeridos
    if (!mensajeSolicitud) {
      return res.status(400).json({
        error: 'Falta campo requerido: mensajeSolicitud'
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

    // Buscar el demandante del usuario autenticado
    const demandante = await prisma.demandante.findUnique({
      where: { usuarioId: usuarioId }
    });

    if (!demandante) {
      return res.status(400).json({
        error: 'El usuario no tiene un perfil de demandante'
      });
    }

    // Verificar si ya existe una solicitud para este demandante en esta oferta
    const solicitudExistente = await prisma.solicitud.findFirst({
      where: {
        ofertaId: parseInt(ofertaId),
        demandanteId: demandante.id
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
        demandanteId: demandante.id,
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
                nombreClub: true,
                usuarioId: true
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

    // Crear notificación para el club
    try {
      const clubUsuarioId = nuevaSolicitud.oferta.club.usuarioId;
      const contenido = `Nuevo candidato en '${nuevaSolicitud.oferta.titulo}'`;
      const urlRedireccion = `/solicitudes`;
      
      await crearNotificacion(clubUsuarioId, 'nueva_solicitud', contenido, urlRedireccion);
      
      // Emitir evento en tiempo real
      emitToUser(clubUsuarioId, 'notificacion:nueva', {
        solicitudId: nuevaSolicitud.id,
        ofertaId: nuevaSolicitud.ofertaId,
        tipo: 'nueva_solicitud',
        contenido
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      // No fallar la solicitud si la notificación falla
    }

    // Devolver respuesta exitosa
    res.status(201).json(nuevaSolicitud);

  } catch (error) {
    console.error('Error al solicitar oferta:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// LISTAR SOLICITUDES CON PAGINACIÓN
const listarSolicitudes = async (req, res) => {
  try {
    const { rol } = req.query;
    
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Validar parámetros de paginación
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        error: 'Parámetros de paginación inválidos. page >= 1, pageSize entre 1 y 100'
      });
    }

    // Obtener el usuario autenticado del token JWT
    const usuarioId = req.usuario.id;

    // Validar parámetros requeridos
    if (!rol) {
      return res.status(400).json({
        error: 'Falta parámetro requerido: rol'
      });
    }

    // Validar que el rol sea válido
    if (rol !== 'club' && rol !== 'demandante') {
      return res.status(400).json({
        error: 'El rol debe ser "club" o "demandante"'
      });
    }

    // Verificar que el rol del usuario autenticado coincida con el solicitado
    if (req.usuario.rol !== rol) {
      return res.status(403).json({
        error: 'No tienes permisos para ver solicitudes de este rol'
      });
    }

    // Calcular skip para la paginación
    const skip = (page - 1) * pageSize;

    let solicitudes = [];
    let total = 0;

    if (rol === 'demandante') {
      // Buscar el demandante del usuario
      const demandante = await prisma.demandante.findUnique({
        where: { usuarioId: usuarioId }
      });

      if (!demandante) {
        return res.status(400).json({
          error: 'Usuario no encontrado o no es un demandante'
        });
      }

      // Obtener solicitudes del demandante con paginación
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
        },
        skip: skip,
        take: pageSize
      });

      // Obtener total de solicitudes del demandante
      total = await prisma.solicitud.count({
        where: {
          demandanteId: demandante.id
        }
      });

    } else if (rol === 'club') {
      // Buscar el club del usuario
      const club = await prisma.club.findUnique({
        where: { usuarioId: usuarioId }
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
        return res.status(200).json({
          items: [],
          page: page,
          pageSize: pageSize,
          total: 0,
          hasMore: false
        });
      }

      // Obtener solicitudes de las ofertas del club con paginación
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
        },
        skip: skip,
        take: pageSize
      });

      // Obtener total de solicitudes de las ofertas del club
      total = await prisma.solicitud.count({
        where: {
          ofertaId: {
            in: ofertaIds
          }
        }
      });
    }

    // Devolver respuesta con información de paginación
    res.status(200).json({
      items: solicitudes,
      page: page,
      pageSize: pageSize,
      total: total,
      hasMore: skip + solicitudes.length < total
    });

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
            usuarioId: true,
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

    // Crear notificación para el demandante
    try {
      const demandanteUsuarioId = solicitudActualizada.demandante.usuarioId;
      const contenido = `Tu solicitud en '${solicitudActualizada.oferta.titulo}' ha sido ${estado}`;
      const urlRedireccion = `/mis-solicitudes`;
      
      await crearNotificacion(demandanteUsuarioId, 'respuesta_solicitud', contenido, urlRedireccion);
      
      // Emitir evento en tiempo real
      emitToUser(demandanteUsuarioId, 'notificacion:nueva', {
        solicitudId: solicitudActualizada.id,
        ofertaId: solicitudActualizada.ofertaId,
        tipo: 'respuesta_solicitud',
        estado,
        contenido
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      // No fallar la respuesta si la notificación falla
    }

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