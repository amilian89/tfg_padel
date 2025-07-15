const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');


// REGISTRO DE USUARIO
const register = async (req, res) => {
  try {
    // Extraer datos anidados
    const { usuario = {}, club = {}, demandante = {} } = req.body;
    const {
      email,
      password,
      nombre,
      apellidos,
      telefono,
      rol
    } = usuario;

    // Validación de campos obligatorios comunes
    if (!email || !password || !nombre || !apellidos || !telefono || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario y su perfil correspondiente en una transacción
    const resultado = await prisma.$transaction(async (prisma) => {
      // Crear el usuario
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          email,
          password: passwordEncriptada,
          nombre,
          apellidos,
          telefono,
          rol
        }
      });

      // Crear perfil según el rol
      if (rol === 'club') {
        // Validar campos requeridos para Club
        if (!club.nombreClub || !club.direccion || !club.ciudad) {
          throw new Error('Para registrarse como club, se requieren: nombreClub, direccion, ciudad');
        }

        // Crear perfil de Club
        await prisma.club.create({
          data: {
            usuarioId: nuevoUsuario.id,
            nombreClub: club.nombreClub,
            direccion: club.direccion,
            ciudad: club.ciudad,
            codigoPostal: club.codigoPostal || '',
            provincia: club.provincia || '',
            pais: club.pais || 'España',
            descripcion: club.descripcion || '',
            sitioWeb: club.sitioWeb || '',
            telefonoContacto: club.telefonoContacto || telefono
          }
        });
      } else if (rol === 'demandante') {
        // Validar campos requeridos para Demandante
        if (!demandante.fechaNacimiento) {
          throw new Error('Para registrarse como demandante, se requiere: fechaNacimiento');
        }

        // Crear perfil de Demandante
        await prisma.demandante.create({
          data: {
            usuarioId: nuevoUsuario.id,
            fechaNacimiento: new Date(demandante.fechaNacimiento),
            experiencia: demandante.experiencia || '',
            formacion: demandante.formacion || '',
            nivelIngles: demandante.nivelIngles || '',
            otrosIdiomas: demandante.otrosIdiomas || '',
            disponibilidad: demandante.disponibilidad || '',
            puedeViajar: demandante.puedeViajar || false,
            curriculumUrl: demandante.curriculumUrl || '',
            fotoPerfilUrl: demandante.fotoPerfilUrl || ''
          }
        });
      }

      return nuevoUsuario;
    });

    // Devolver respuesta exitosa
    res.status(201).json({
      id: resultado.id,
      email: resultado.email,
      rol: resultado.rol,
      mensaje: `Usuario registrado exitosamente como ${rol}`
    });

  } catch (error) {
    console.error('Error en registro:', error);

    // Manejar errores específicos de validación
    if (error.message.includes('se requieren') || error.message.includes('se requiere')) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// LOGIN DE USUARIO
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    // Si no existe el usuario
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Comparar la contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    // Si la contraseña no coincide
    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // Devolver respuesta exitosa
    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login
};
