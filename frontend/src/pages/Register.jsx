import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const camposComunes = {
  nombre: "",
  apellidos: "",
  telefono: "",
  email: "",
  password: "",
  rol: "",
};

const camposClub = {
  nombreClub: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  provincia: "",
  pais: "",
  descripcion: "",
  sitioWeb: "",
  telefonoContacto: "",
};

const camposDemandante = {
  fechaNacimiento: "",
  experiencia: "",
  formacion: "",
  nivelIngles: "",
  otrosIdiomas: "",
  disponibilidad: "",
  puedeViajar: false,
  curriculumUrl: "",
  fotoPerfilUrl: "",
};

const Register = () => {
  const [comunes, setComunes] = useState(camposComunes);
  const [club, setClub] = useState(camposClub);
  const [demandante, setDemandante] = useState(camposDemandante);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleComunes = (e) => {
    const { name, value } = e.target;
    setComunes({ ...comunes, [name]: value });
  };

  const handleClub = (e) => {
    const { name, value } = e.target;
    setClub({ ...club, [name]: value });
  };

  const handleDemandante = (e) => {
    const { name, value, type, checked } = e.target;
    setDemandante({ ...demandante, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    // Validar campos comunes
    for (const key in comunes) {
      if (!comunes[key]) return false;
    }
    // Validar campos según rol
    if (comunes.rol === "club") {
      for (const key in camposClub) {
        if (!club[key]) return false;
      }
    } else if (comunes.rol === "demandante") {
      for (const key in camposDemandante) {
        if (key === "puedeViajar") continue; // puede ser false
        if (!demandante[key]) return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (!validar()) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    // Estructurar payload
    const payload = {
      usuario: {
        nombre: comunes.nombre,
        apellidos: comunes.apellidos,
        telefono: comunes.telefono,
        email: comunes.email,
        password: comunes.password,
        rol: comunes.rol,
      },
    };
    if (comunes.rol === "club") {
      payload.club = { ...club };
    } else if (comunes.rol === "demandante") {
      payload.demandante = {
        ...demandante,
        fechaNacimiento: demandante.fechaNacimiento,
      };
    }
    try {
      await axios.post(`${API_URL}/auth/register`, payload);
      setMensaje("Registro exitoso. ¡Ya puedes iniciar sesión!");
      setComunes(camposComunes);
      setClub(camposClub);
      setDemandante(camposDemandante);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al registrar. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos comunes */}
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={comunes.nombre} onChange={handleComunes} />
        </div>
        <div>
          <label>Apellidos:</label>
          <input type="text" name="apellidos" value={comunes.apellidos} onChange={handleComunes} />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="tel" name="telefono" value={comunes.telefono} onChange={handleComunes} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={comunes.email} onChange={handleComunes} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={comunes.password} onChange={handleComunes} />
        </div>
        <div>
          <label>Rol:</label>
          <select name="rol" value={comunes.rol} onChange={handleComunes}>
            <option value="">Selecciona un rol</option>
            <option value="club">Club</option>
            <option value="demandante">Demandante</option>
          </select>
        </div>

        {/* Campos específicos para club */}
        {comunes.rol === "club" && (
          <>
            <div>
              <label>Nombre del club:</label>
              <input type="text" name="nombreClub" value={club.nombreClub} onChange={handleClub} />
            </div>
            <div>
              <label>Dirección:</label>
              <input type="text" name="direccion" value={club.direccion} onChange={handleClub} />
            </div>
            <div>
              <label>Ciudad:</label>
              <input type="text" name="ciudad" value={club.ciudad} onChange={handleClub} />
            </div>
            <div>
              <label>Código Postal:</label>
              <input type="text" name="codigoPostal" value={club.codigoPostal} onChange={handleClub} />
            </div>
            <div>
              <label>Provincia:</label>
              <input type="text" name="provincia" value={club.provincia} onChange={handleClub} />
            </div>
            <div>
              <label>País:</label>
              <input type="text" name="pais" value={club.pais} onChange={handleClub} />
            </div>
            <div>
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={club.descripcion} onChange={handleClub} />
            </div>
            <div>
              <label>Sitio Web:</label>
              <input type="text" name="sitioWeb" value={club.sitioWeb} onChange={handleClub} />
            </div>
            <div>
              <label>Teléfono de contacto:</label>
              <input type="text" name="telefonoContacto" value={club.telefonoContacto} onChange={handleClub} />
            </div>
          </>
        )}

        {/* Campos específicos para demandante */}
        {comunes.rol === "demandante" && (
          <>
            <div>
              <label>Fecha de nacimiento:</label>
              <input type="date" name="fechaNacimiento" value={demandante.fechaNacimiento} onChange={handleDemandante} />
            </div>
            <div>
              <label>Experiencia:</label>
              <input type="text" name="experiencia" value={demandante.experiencia} onChange={handleDemandante} />
            </div>
            <div>
              <label>Formación:</label>
              <input type="text" name="formacion" value={demandante.formacion} onChange={handleDemandante} />
            </div>
            <div>
              <label>Nivel de inglés:</label>
              <input type="text" name="nivelIngles" value={demandante.nivelIngles} onChange={handleDemandante} />
            </div>
            <div>
              <label>Otros idiomas:</label>
              <input type="text" name="otrosIdiomas" value={demandante.otrosIdiomas} onChange={handleDemandante} />
            </div>
            <div>
              <label>Disponibilidad:</label>
              <input type="text" name="disponibilidad" value={demandante.disponibilidad} onChange={handleDemandante} />
            </div>
            <div>
              <label>¿Puede viajar?</label>
              <input type="checkbox" name="puedeViajar" checked={demandante.puedeViajar} onChange={handleDemandante} />
            </div>
            <div>
              <label>Currículum (URL):</label>
              <input type="text" name="curriculumUrl" value={demandante.curriculumUrl} onChange={handleDemandante} />
            </div>
            <div>
              <label>Foto de perfil (URL):</label>
              <input type="text" name="fotoPerfilUrl" value={demandante.fotoPerfilUrl} onChange={handleDemandante} />
            </div>
          </>
        )}

        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register; 