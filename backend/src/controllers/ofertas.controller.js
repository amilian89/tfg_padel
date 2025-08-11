const prisma = require('../prisma/client');

// OBTENER TODAS LAS OFERTAS CON PAGINACIÓN
const getOfertas = async (req, res) => {
  try {
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    // Validar parámetros
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({
        error: 'Parámetros de paginación inválidos. page >= 1, pageSize entre 1 y 100'
      });
    }

    // Calcular skip para la paginación
    const skip = (page - 1) * pageSize;

    // Obtener ofertas con paginación
    const ofertas = await prisma.oferta.findMany({
      include: {
        club: {
          select: {
            nombreClub: true,
            ciudad: true,
            provincia: true
          }
        }
      },
      orderBy: {
        fechaPublicacion: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    // Obtener el total de ofertas para la paginación
    const total = await prisma.oferta.count();

    // Devolver respuesta con información de paginación
    res.status(200).json({
      items: ofertas,
      page: page,
      pageSize: pageSize,
      total: total,
      hasMore: skip + ofertas.length < total
    });

  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// OBTENER OFERTA POR ID
const getOfertaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la oferta por ID
    const oferta = await prisma.oferta.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        club: {
          select: {
            nombreClub: true,
            ciudad: true,
            provincia: true,
            direccion: true,
            telefonoContacto: true,
            sitioWeb: true
          }
        }
      }
    });

    // Si no se encuentra la oferta
    if (!oferta) {
      return res.status(404).json({
        error: 'Oferta no encontrada'
      });
    }

    // Devolver respuesta exitosa
    res.status(200).json(oferta);

  } catch (error) {
    console.error('Error al obtener oferta por ID:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// CREAR NUEVA OFERTA
const crearOferta = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      tipoDeporte,
      tipoContrato,
      jornada,
      salario,
      ubicacion,
      requisitosExperiencia,
      requisitosFormacion,
      requisitosIdiomas,
      fechaLimite
    } = req.body;

    // Obtener el usuario autenticado del token JWT
    const usuarioId = req.usuario.id;

    // Validar campos requeridos
    if (!titulo || !descripcion || !tipoDeporte || !salario) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: titulo, descripcion, tipoDeporte, salario'
      });
    }

    // Buscar el club del usuario autenticado
    const club = await prisma.club.findUnique({
      where: { usuarioId: usuarioId }
    });

    if (!club) {
      return res.status(400).json({
        error: 'El usuario no tiene un perfil de club'
      });
    }

    // Crear la nueva oferta
    const nuevaOferta = await prisma.oferta.create({
      data: {
        clubId: club.id,
        titulo,
        descripcion,
        fechaPublicacion: new Date(),
        fechaLimite: new Date(fechaLimite),
        tipoDeporte,
        tipoContrato: tipoContrato || 'Indefinido',
        jornada: jornada || 'Completa',
        salario: parseFloat(salario),
        ubicacion,
        requisitosExperiencia: requisitosExperiencia || '',
        requisitosFormacion: requisitosFormacion || '',
        requisitosIdiomas: requisitosIdiomas || '',
        estado: 'activa',
        fechaActualizacion: new Date(),
        fechaCierre: null
      },
      include: {
        club: {
          select: {
            nombreClub: true,
            ciudad: true,
            provincia: true
          }
        }
      }
    });

    // Devolver respuesta exitosa
    res.status(201).json(nuevaOferta);

  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getOfertas,
  getOfertaPorId,
  crearOferta
}; 