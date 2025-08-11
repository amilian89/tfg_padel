import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import "./PublicarOferta.css";

const PublicarOferta = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    titulo: "",
    tipoDeporte: "",
    descripcion: "",
    ubicacion: "",
    fechaLimite: "",
    salario: "",
    tipoContrato: "Indefinido",
    jornada: "Completa",
    requisitosExperiencia: "",
    requisitosFormacion: "",
    requisitosIdiomas: ""
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Verificar autenticación y rol
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("rol");
    const userId = localStorage.getItem("id");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "club") {
      navigate("/");
      return;
    }

    setUserData({
      role: userRole,
      id: userId
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.titulo || !formData.tipoDeporte || !formData.descripcion || !formData.salario) {
      showError("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const ofertaData = {
        ...formData,
        salario: parseFloat(formData.salario)
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/ofertas`, ofertaData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Mostrar toast de éxito y redirigir
      showSuccess("Oferta publicada correctamente");
      setTimeout(() => {
        navigate("/panel");
      }, 1500);

    } catch (err) {
      console.error("Error al crear oferta:", err);
      if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError("Error al crear la oferta. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="publicar-oferta">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publicar-oferta">
      <Header />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <div className="container">
        <div className="publicar-header">
          <button 
            className="btn btn-outline btn-volver"
            onClick={() => navigate("/panel")}
          >
            ← Volver al Panel
          </button>
          <h1 className="publicar-titulo">Publicar Nueva Oferta</h1>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="oferta-form">
            {/* Información básica */}
            <div className="form-section">
              <h3>Información Básica</h3>
              
              <div className="form-group">
                <label htmlFor="titulo">Título de la oferta *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Entrenador de pádel para club deportivo"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipoDeporte">Deporte *</label>
                <select
                  id="tipoDeporte"
                  name="tipoDeporte"
                  value={formData.tipoDeporte}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecciona un deporte</option>
                  <option value="Pádel">Pádel</option>
                  <option value="Tenis">Tenis</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe detalladamente la oferta de trabajo..."
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Detalles de la oferta */}
            <div className="form-section">
              <h3>Detalles de la Oferta</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ubicacion">Ubicación *</label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder="Ciudad, provincia"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fechaLimite">Fecha límite *</label>
                  <input
                    type="date"
                    id="fechaLimite"
                    name="fechaLimite"
                    value={formData.fechaLimite}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salario">Salario (€) *</label>
                  <input
                    type="number"
                    id="salario"
                    name="salario"
                    value={formData.salario}
                    onChange={handleInputChange}
                    placeholder="1500"
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipoContrato">Tipo de contrato</label>
                  <select
                    id="tipoContrato"
                    name="tipoContrato"
                    value={formData.tipoContrato}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Indefinido">Indefinido</option>
                    <option value="Temporal">Temporal</option>
                    <option value="Por horas">Por horas</option>
                    <option value="Autónomo">Autónomo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jornada">Jornada</label>
                <select
                  id="jornada"
                  name="jornada"
                  value={formData.jornada}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Completa">Completa</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Requisitos */}
            <div className="form-section">
              <h3>Requisitos (Opcionales)</h3>
              
              <div className="form-group">
                <label htmlFor="requisitosExperiencia">Experiencia requerida</label>
                <textarea
                  id="requisitosExperiencia"
                  name="requisitosExperiencia"
                  value={formData.requisitosExperiencia}
                  onChange={handleInputChange}
                  placeholder="Ej: Mínimo 2 años de experiencia como entrenador..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="requisitosFormacion">Formación requerida</label>
                <textarea
                  id="requisitosFormacion"
                  name="requisitosFormacion"
                  value={formData.requisitosFormacion}
                  onChange={handleInputChange}
                  placeholder="Ej: Título de entrenador de pádel, licenciatura en CAFD..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="requisitosIdiomas">Idiomas requeridos</label>
                <textarea
                  id="requisitosIdiomas"
                  name="requisitosIdiomas"
                  value={formData.requisitosIdiomas}
                  onChange={handleInputChange}
                  placeholder="Ej: Inglés nivel B2, español nativo..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/panel")}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creando oferta..." : "Publicar Oferta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicarOferta; 