import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./Register.css";

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
    <div className="register-page">
      <Header />
      <div className="register-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Crear cuenta en ProPista</h1>
            <p className="form-subtitle">
              Únete a la plataforma líder para conectar clubes y entrenadores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Campos comunes */}
            <div className="form-section">
              <h3 className="section-title">Información personal</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={comunes.nombre} 
                    onChange={handleComunes}
                    className="form-input"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input 
                    type="text" 
                    name="apellidos" 
                    value={comunes.apellidos} 
                    onChange={handleComunes}
                    className="form-input"
                    placeholder="Tus apellidos"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input 
                    type="tel" 
                    name="telefono" 
                    value={comunes.telefono} 
                    onChange={handleComunes}
                    className="form-input"
                    placeholder="Tu número de teléfono"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={comunes.email} 
                    onChange={handleComunes}
                    className="form-input"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contraseña *</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={comunes.password} 
                    onChange={handleComunes}
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de cuenta *</label>
                  <select 
                    name="rol" 
                    value={comunes.rol} 
                    onChange={handleComunes}
                    className="form-select"
                  >
                    <option value="">Selecciona tu rol</option>
                    <option value="club">Club deportivo</option>
                    <option value="demandante">Entrenador</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campos específicos para club */}
            {comunes.rol === "club" && (
              <div className="form-section">
                <h3 className="section-title">Información del club</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombre del club *</label>
                    <input 
                      type="text" 
                      name="nombreClub" 
                      value={club.nombreClub} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Nombre de tu club"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dirección *</label>
                    <input 
                      type="text" 
                      name="direccion" 
                      value={club.direccion} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ciudad *</label>
                    <input 
                      type="text" 
                      name="ciudad" 
                      value={club.ciudad} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Código Postal</label>
                    <input 
                      type="text" 
                      name="codigoPostal" 
                      value={club.codigoPostal} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Código postal"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Provincia</label>
                    <input 
                      type="text" 
                      name="provincia" 
                      value={club.provincia} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Provincia"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">País</label>
                    <input 
                      type="text" 
                      name="pais" 
                      value={club.pais} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="País"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Descripción</label>
                    <input 
                      type="text" 
                      name="descripcion" 
                      value={club.descripcion} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Breve descripción del club"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sitio Web</label>
                    <input 
                      type="text" 
                      name="sitioWeb" 
                      value={club.sitioWeb} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="www.tuclub.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono de contacto</label>
                    <input 
                      type="text" 
                      name="telefonoContacto" 
                      value={club.telefonoContacto} 
                      onChange={handleClub}
                      className="form-input"
                      placeholder="Teléfono de contacto"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campos específicos para demandante */}
            {comunes.rol === "demandante" && (
              <div className="form-section">
                <h3 className="section-title">Información profesional</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento *</label>
                    <input 
                      type="date" 
                      name="fechaNacimiento" 
                      value={demandante.fechaNacimiento} 
                      onChange={handleDemandante}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experiencia</label>
                    <input 
                      type="text" 
                      name="experiencia" 
                      value={demandante.experiencia} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Años de experiencia"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Formación</label>
                    <input 
                      type="text" 
                      name="formacion" 
                      value={demandante.formacion} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Títulos y certificaciones"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nivel de inglés</label>
                    <input 
                      type="text" 
                      name="nivelIngles" 
                      value={demandante.nivelIngles} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Básico, Intermedio, Avanzado"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Otros idiomas</label>
                    <input 
                      type="text" 
                      name="otrosIdiomas" 
                      value={demandante.otrosIdiomas} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Francés, Alemán, etc."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disponibilidad</label>
                    <input 
                      type="text" 
                      name="disponibilidad" 
                      value={demandante.disponibilidad} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Tiempo completo, parcial, etc."
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">¿Puede viajar?</label>
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        name="puedeViajar" 
                        checked={demandante.puedeViajar} 
                        onChange={handleDemandante}
                        className="form-checkbox"
                      />
                      <span className="checkbox-label">Sí, estoy dispuesto a viajar por trabajo</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currículum (URL)</label>
                    <input 
                      type="text" 
                      name="curriculumUrl" 
                      value={demandante.curriculumUrl} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Enlace a tu CV"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Foto de perfil (URL)</label>
                    <input 
                      type="text" 
                      name="fotoPerfilUrl" 
                      value={demandante.fotoPerfilUrl} 
                      onChange={handleDemandante}
                      className="form-input"
                      placeholder="Enlace a tu foto"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mensajes de estado */}
            {mensaje && <div className="success-message">{mensaje}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Botón de envío */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary submit-btn">
                Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 