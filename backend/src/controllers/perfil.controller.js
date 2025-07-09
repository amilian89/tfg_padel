const prisma = require('../prisma/client');

// OBTENER PERFIL DE USUARIO
const getPerfil = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Buscar el usuario por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      include: {
        club: true,
        demandante: true
      }
    });

    // Si no se encuentra el usuario
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Preparar la respuesta según el rol
    const perfil = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      rol: usuario.rol,
      fechaRegistro: usuario.fechaRegistro
    };

    // Añadir datos específicos según el rol
    if (usuario.rol === 'club' && usuario.club) {
      perfil.club = {
        id: usuario.club.id,
        nombreClub: usuario.club.nombreClub,
        direccion: usuario.club.direccion,
        ciudad: usuario.club.ciudad,
        codigoPostal: usuario.club.codigoPostal,
        provincia: usuario.club.provincia,
        pais: usuario.club.pais,
        descripcion: usuario.club.descripcion,
        sitioWeb: usuario.club.sitioWeb,
        telefonoContacto: usuario.club.telefonoContacto
      };
    } else if (usuario.rol === 'demandante' && usuario.demandante) {
      perfil.demandante = {
        id: usuario.demandante.id,
        fechaNacimiento: usuario.demandante.fechaNacimiento,
        experiencia: usuario.demandante.experiencia,
        formacion: usuario.demandante.formacion,
        nivelIngles: usuario.demandante.nivelIngles,
        otrosIdiomas: usuario.demandante.otrosIdiomas,
        disponibilidad: usuario.demandante.disponibilidad,
        puedeViajar: usuario.demandante.puedeViajar,
        curriculumUrl: usuario.demandante.curriculumUrl,
        fotoPerfilUrl: usuario.demandante.fotoPerfilUrl
      };
    }

    // Devolver respuesta exitosa
    res.status(200).json(perfil);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// ACTUALIZAR PERFIL DE USUARIO
const actualizarPerfil = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const datosActualizados = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      include: {
        club: true,
        demandante: true
      }
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Actualizar datos básicos del usuario
    const datosUsuario = {};
    if (datosActualizados.nombre) datosUsuario.nombre = datosActualizados.nombre;
    if (datosActualizados.apellidos) datosUsuario.apellidos = datosActualizados.apellidos;
    if (datosActualizados.telefono) datosUsuario.telefono = datosActualizados.telefono;

    // Actualizar usuario si hay cambios
    if (Object.keys(datosUsuario).length > 0) {
      await prisma.usuario.update({
        where: { id: parseInt(usuarioId) },
        data: datosUsuario
      });
    }

    // Actualizar datos específicos según el rol
    if (usuarioExistente.rol === 'club') {
      const datosClub = {};
      
      if (datosActualizados.nombreClub) datosClub.nombreClub = datosActualizados.nombreClub;
      if (datosActualizados.direccion) datosClub.direccion = datosActualizados.direccion;
      if (datosActualizados.ciudad) datosClub.ciudad = datosActualizados.ciudad;
      if (datosActualizados.codigoPostal) datosClub.codigoPostal = datosActualizados.codigoPostal;
      if (datosActualizados.provincia) datosClub.provincia = datosActualizados.provincia;
      if (datosActualizados.pais) datosClub.pais = datosActualizados.pais;
      if (datosActualizados.descripcion) datosClub.descripcion = datosActualizados.descripcion;
      if (datosActualizados.sitioWeb) datosClub.sitioWeb = datosActualizados.sitioWeb;
      if (datosActualizados.telefonoContacto) datosClub.telefonoContacto = datosActualizados.telefonoContacto;

      if (Object.keys(datosClub).length > 0) {
        await prisma.club.update({
          where: { usuarioId: parseInt(usuarioId) },
          data: datosClub
        });
      }

    } else if (usuarioExistente.rol === 'demandante') {
      const datosDemandante = {};
      
      if (datosActualizados.fechaNacimiento) datosDemandante.fechaNacimiento = new Date(datosActualizados.fechaNacimiento);
      if (datosActualizados.experiencia) datosDemandante.experiencia = datosActualizados.experiencia;
      if (datosActualizados.formacion) datosDemandante.formacion = datosActualizados.formacion;
      if (datosActualizados.nivelIngles) datosDemandante.nivelIngles = datosActualizados.nivelIngles;
      if (datosActualizados.otrosIdiomas) datosDemandante.otrosIdiomas = datosActualizados.otrosIdiomas;
      if (datosActualizados.disponibilidad) datosDemandante.disponibilidad = datosActualizados.disponibilidad;
      if (datosActualizados.puedeViajar !== undefined) datosDemandante.puedeViajar = datosActualizados.puedeViajar;
      if (datosActualizados.curriculumUrl) datosDemandante.curriculumUrl = datosActualizados.curriculumUrl;
      if (datosActualizados.fotoPerfilUrl) datosDemandante.fotoPerfilUrl = datosActualizados.fotoPerfilUrl;

      if (Object.keys(datosDemandante).length > 0) {
        await prisma.demandante.update({
          where: { usuarioId: parseInt(usuarioId) },
          data: datosDemandante
        });
      }
    }

    // Obtener el perfil actualizado
    const perfilActualizado = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      include: {
        club: true,
        demandante: true
      }
    });

    // Preparar la respuesta
    const perfil = {
      id: perfilActualizado.id,
      email: perfilActualizado.email,
      nombre: perfilActualizado.nombre,
      apellidos: perfilActualizado.apellidos,
      telefono: perfilActualizado.telefono,
      rol: perfilActualizado.rol,
      fechaRegistro: perfilActualizado.fechaRegistro
    };

    if (perfilActualizado.rol === 'club' && perfilActualizado.club) {
      perfil.club = {
        id: perfilActualizado.club.id,
        nombreClub: perfilActualizado.club.nombreClub,
        direccion: perfilActualizado.club.direccion,
        ciudad: perfilActualizado.club.ciudad,
        codigoPostal: perfilActualizado.club.codigoPostal,
        provincia: perfilActualizado.club.provincia,
        pais: perfilActualizado.club.pais,
        descripcion: perfilActualizado.club.descripcion,
        sitioWeb: perfilActualizado.club.sitioWeb,
        telefonoContacto: perfilActualizado.club.telefonoContacto
      };
    } else if (perfilActualizado.rol === 'demandante' && perfilActualizado.demandante) {
      perfil.demandante = {
        id: perfilActualizado.demandante.id,
        fechaNacimiento: perfilActualizado.demandante.fechaNacimiento,
        experiencia: perfilActualizado.demandante.experiencia,
        formacion: perfilActualizado.demandante.formacion,
        nivelIngles: perfilActualizado.demandante.nivelIngles,
        otrosIdiomas: perfilActualizado.demandante.otrosIdiomas,
        disponibilidad: perfilActualizado.demandante.disponibilidad,
        puedeViajar: perfilActualizado.demandante.puedeViajar,
        curriculumUrl: perfilActualizado.demandante.curriculumUrl,
        fotoPerfilUrl: perfilActualizado.demandante.fotoPerfilUrl
      };
    }

    // Devolver respuesta exitosa
    res.status(200).json({
      mensaje: 'Perfil actualizado correctamente',
      perfil
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getPerfil,
  actualizarPerfil
}; 