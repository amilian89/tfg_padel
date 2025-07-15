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

    // Obtener el usuario autenticado del token JWT
    const usuarioAutenticadoId = req.usuario.id;

    // Verificar que el usuario solo puede actualizar su propio perfil
    if (parseInt(usuarioId) !== usuarioAutenticadoId) {
      return res.status(403).json({
        error: 'Solo puedes actualizar tu propio perfil'
      });
    }

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

// OBTENER MI PERFIL (usuario autenticado)
const getMiPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Buscar el usuario por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
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
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        rol: usuario.rol,
        fechaRegistro: usuario.fechaRegistro
      }
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

// ACTUALIZAR MI PERFIL (usuario autenticado)
const actualizarMiPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { usuario: datosUsuario, club: datosClub, demandante: datosDemandante } = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: usuarioId },
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
    if (datosUsuario) {
      const datosUsuarioUpdate = {};
      if (datosUsuario.nombre) datosUsuarioUpdate.nombre = datosUsuario.nombre;
      if (datosUsuario.apellidos) datosUsuarioUpdate.apellidos = datosUsuario.apellidos;
      if (datosUsuario.telefono) datosUsuarioUpdate.telefono = datosUsuario.telefono;
      if (datosUsuario.email) datosUsuarioUpdate.email = datosUsuario.email;

      if (Object.keys(datosUsuarioUpdate).length > 0) {
        await prisma.usuario.update({
          where: { id: usuarioId },
          data: datosUsuarioUpdate
        });
      }
    }

    // Actualizar datos específicos según el rol
    if (usuarioExistente.rol === 'club' && datosClub) {
      const datosClubUpdate = {};
      
      if (datosClub.nombreClub) datosClubUpdate.nombreClub = datosClub.nombreClub;
      if (datosClub.direccion) datosClubUpdate.direccion = datosClub.direccion;
      if (datosClub.ciudad) datosClubUpdate.ciudad = datosClub.ciudad;
      if (datosClub.codigoPostal) datosClubUpdate.codigoPostal = datosClub.codigoPostal;
      if (datosClub.provincia) datosClubUpdate.provincia = datosClub.provincia;
      if (datosClub.pais) datosClubUpdate.pais = datosClub.pais;
      if (datosClub.descripcion) datosClubUpdate.descripcion = datosClub.descripcion;
      if (datosClub.sitioWeb) datosClubUpdate.sitioWeb = datosClub.sitioWeb;
      if (datosClub.telefonoContacto) datosClubUpdate.telefonoContacto = datosClub.telefonoContacto;

      if (Object.keys(datosClubUpdate).length > 0) {
        await prisma.club.update({
          where: { usuarioId: usuarioId },
          data: datosClubUpdate
        });
      }

    } else if (usuarioExistente.rol === 'demandante' && datosDemandante) {
      const datosDemandanteUpdate = {};
      
      if (datosDemandante.fechaNacimiento) datosDemandanteUpdate.fechaNacimiento = new Date(datosDemandante.fechaNacimiento);
      if (datosDemandante.experiencia) datosDemandanteUpdate.experiencia = datosDemandante.experiencia;
      if (datosDemandante.formacion) datosDemandanteUpdate.formacion = datosDemandante.formacion;
      if (datosDemandante.nivelIngles) datosDemandanteUpdate.nivelIngles = datosDemandante.nivelIngles;
      if (datosDemandante.otrosIdiomas) datosDemandanteUpdate.otrosIdiomas = datosDemandante.otrosIdiomas;
      if (datosDemandante.disponibilidad) datosDemandanteUpdate.disponibilidad = datosDemandante.disponibilidad;
      if (datosDemandante.puedeViajar !== undefined) datosDemandanteUpdate.puedeViajar = datosDemandante.puedeViajar;
      if (datosDemandante.curriculumUrl) datosDemandanteUpdate.curriculumUrl = datosDemandante.curriculumUrl;
      if (datosDemandante.fotoPerfilUrl) datosDemandanteUpdate.fotoPerfilUrl = datosDemandante.fotoPerfilUrl;

      if (Object.keys(datosDemandanteUpdate).length > 0) {
        await prisma.demandante.update({
          where: { usuarioId: usuarioId },
          data: datosDemandanteUpdate
        });
      }
    }

    // Obtener el perfil actualizado
    const perfilActualizado = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        club: true,
        demandante: true
      }
    });

    // Preparar la respuesta
    const perfil = {
      usuario: {
        id: perfilActualizado.id,
        email: perfilActualizado.email,
        nombre: perfilActualizado.nombre,
        apellidos: perfilActualizado.apellidos,
        telefono: perfilActualizado.telefono,
        rol: perfilActualizado.rol,
        fechaRegistro: perfilActualizado.fechaRegistro
      }
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
  actualizarPerfil,
  getMiPerfil,
  actualizarMiPerfil
}; 