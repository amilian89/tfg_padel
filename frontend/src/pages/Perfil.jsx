import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getProfile, updateProfile } from "../services/auth";
import "./Perfil.css";

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
    rol: "",
  });

  // Datos específicos según rol
  const [club, setClub] = useState({
    nombreClub: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    provincia: "",
    pais: "",
    descripcion: "",
    sitioWeb: "",
    telefonoContacto: "",
  });

  const [demandante, setDemandante] = useState({
    fechaNacimiento: "",
    experiencia: "",
    formacion: "",
    nivelIngles: "",
    otrosIdiomas: "",
    disponibilidad: "",
    puedeViajar: false,
    curriculumUrl: "",
    fotoPerfilUrl: "",
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    cargarPerfil();
  }, [navigate]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      const { usuario: userData, club: clubData, demandante: demandanteData } = response.data;
      
      setUsuario(userData);
      if (clubData) setClub(clubData);
      if (demandanteData) setDemandante(demandanteData);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError("Error al cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClub({ ...club, [name]: value });
  };

  const handleDemandanteChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDemandante({ 
      ...demandante, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensaje("");
    setError("");

    try {
      const payload = {
        usuario: { ...usuario },
      };

      if (usuario.rol === "club") {
        payload.club = { ...club };
      } else if (usuario.rol === "demandante") {
        payload.demandante = { ...demandante };
      }

      await updateProfile(payload);
      setMensaje("Perfil actualizado correctamente");
      
      // Actualizar localStorage con los nuevos datos
      if (usuario.email) {
        localStorage.setItem("email", usuario.email);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al actualizar el perfil. Inténtalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("rol");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Header />
      <div className="perfil-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Mi Perfil</h1>
            <p className="form-subtitle">
              Gestiona tu información personal y profesional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="perfil-form">
            {/* Datos personales */}
            <div className="form-section">
              <h3 className="section-title">Información personal</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleUsuarioChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={usuario.apellidos}
                    onChange={handleUsuarioChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={usuario.telefono}
                    onChange={handleUsuarioChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleUsuarioChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rol</label>
                  <input
                    type="text"
                    value={usuario.rol === "club" ? "Club deportivo" : "Entrenador"}
                    className="form-input"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Datos específicos para club */}
            {usuario.rol === "club" && (
              <div className="form-section">
                <h3 className="section-title">Información del club</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombre del club *</label>
                    <input
                      type="text"
                      name="nombreClub"
                      value={club.nombreClub}
                      onChange={handleClubChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dirección *</label>
                    <input
                      type="text"
                      name="direccion"
                      value={club.direccion}
                      onChange={handleClubChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={club.ciudad}
                      onChange={handleClubChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={club.codigoPostal}
                      onChange={handleClubChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Provincia</label>
                    <input
                      type="text"
                      name="provincia"
                      value={club.provincia}
                      onChange={handleClubChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">País</label>
                    <input
                      type="text"
                      name="pais"
                      value={club.pais}
                      onChange={handleClubChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={club.descripcion}
                      onChange={handleClubChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="Breve descripción del club"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sitio Web</label>
                    <input
                      type="text"
                      name="sitioWeb"
                      value={club.sitioWeb}
                      onChange={handleClubChange}
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
                      onChange={handleClubChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Datos específicos para demandante */}
            {usuario.rol === "demandante" && (
              <div className="form-section">
                <h3 className="section-title">Información profesional</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento *</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={demandante.fechaNacimiento}
                      onChange={handleDemandanteChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experiencia</label>
                    <input
                      type="text"
                      name="experiencia"
                      value={demandante.experiencia}
                      onChange={handleDemandanteChange}
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
                      onChange={handleDemandanteChange}
                      className="form-input"
                      placeholder="Títulos y certificaciones"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nivel de inglés</label>
                    <select
                      name="nivelIngles"
                      value={demandante.nivelIngles}
                      onChange={handleDemandanteChange}
                      className="form-select"
                    >
                      <option value="">Selecciona nivel</option>
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Nativo">Nativo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Otros idiomas</label>
                    <input
                      type="text"
                      name="otrosIdiomas"
                      value={demandante.otrosIdiomas}
                      onChange={handleDemandanteChange}
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
                      onChange={handleDemandanteChange}
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
                        onChange={handleDemandanteChange}
                        className="form-checkbox"
                      />
                      <span className="checkbox-label">
                        Sí, estoy dispuesto a viajar por trabajo
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currículum (URL)</label>
                    <input
                      type="text"
                      name="curriculumUrl"
                      value={demandante.curriculumUrl}
                      onChange={handleDemandanteChange}
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
                      onChange={handleDemandanteChange}
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

            {/* Botones de acción */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary logout-btn"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil; 