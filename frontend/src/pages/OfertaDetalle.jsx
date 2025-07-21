import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./OfertaDetalle.css";

const OfertaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [aplicando, setAplicando] = useState(false);
  const [yaAplicado, setYaAplicado] = useState(false);
  const [mensajeSolicitud, setMensajeSolicitud] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Obtener datos del usuario
    const userRole = localStorage.getItem("rol");
    const userId = localStorage.getItem("id");
    
    setUserData({
      role: userRole,
      id: userId
    });

    // Cargar oferta
    loadOferta();
  }, [id, navigate]);

  const loadOferta = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ofertas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOferta(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar oferta:", err);
      if (err.response?.status === 404) {
        setError("Oferta no encontrada");
      } else {
        setError("Error al cargar la oferta. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAplicar = async () => {
    if (!mensajeSolicitud.trim()) {
      alert("Por favor, escribe un mensaje de solicitud");
      return;
    }

    try {
      setAplicando(true);
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/solicitudes/ofertas/${id}/solicitar`, {
        mensajeSolicitud: mensajeSolicitud.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setYaAplicado(true);
      setMostrarFormulario(false);
      setMensajeSolicitud("");
      alert("¡Solicitud enviada con éxito!");
    } catch (err) {
      console.error("Error al aplicar:", err);
      if (err.response?.data?.error === "Ya has enviado una solicitud para esta oferta") {
        setYaAplicado(true);
        alert("Ya has aplicado a esta oferta anteriormente");
      } else {
        alert("Error al enviar la solicitud. Por favor, intenta de nuevo.");
      }
    } finally {
      setAplicando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="oferta-detalle">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando oferta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oferta-detalle">
        <Header />
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/panel")}
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="oferta-detalle">
        <Header />
        <div className="container">
          <div className="error-container">
            <h2>Oferta no encontrada</h2>
            <p>La oferta que buscas no existe o ha sido eliminada.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/panel")}
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="oferta-detalle">
      <Header />
      
      <div className="container">
        <div className="oferta-header">
          <button 
            className="btn btn-outline btn-volver"
            onClick={() => navigate("/panel")}
          >
            ← Volver al Panel
          </button>
        </div>

        <div className="oferta-content">
          {/* Encabezado de la oferta */}
          <div className="oferta-titulo-section">
            <h1 className="oferta-titulo">{oferta.titulo}</h1>
            {oferta.tipoDeporte && (
              <span className={`deporte-badge ${oferta.tipoDeporte.toLowerCase()}`}>
                {oferta.tipoDeporte}
              </span>
            )}
          </div>

          {/* Información del club */}
          <div className="club-info">
            <h3>Club que publica</h3>
            <div className="club-details">
              <p className="club-nombre">{oferta.club?.nombreClub}</p>
              {oferta.club?.ciudad && (
                <p className="club-ubicacion">
                  📍 {oferta.club.ciudad}{oferta.club.provincia && `, ${oferta.club.provincia}`}
                </p>
              )}
              {oferta.club?.telefonoContacto && (
                <p className="club-contacto">
                  📞 {oferta.club.telefonoContacto}
                </p>
              )}
              {oferta.club?.sitioWeb && (
                <p className="club-web">
                  🌐 <a href={oferta.club.sitioWeb} target="_blank" rel="noopener noreferrer">
                    {oferta.club.sitioWeb}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="oferta-section">
            <h3>Descripción</h3>
            <p className="oferta-descripcion">{oferta.descripcion}</p>
          </div>

          {/* Detalles de la oferta */}
          <div className="oferta-details">
            {/* Primera fila */}
            <div className="detail-item">
              <span className="detail-label">Ubicación:</span>
              <span className="detail-value">{oferta.ubicacion || 'No especificada'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Salario:</span>
              <span className="detail-value">{oferta.salario ? oferta.salario + '€' : 'No especificado'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tipo de contrato:</span>
              <span className="detail-value">{oferta.tipoContrato || 'No especificado'}</span>
            </div>

            {/* Segunda fila */}
            <div className="detail-item">
              <span className="detail-label">Jornada:</span>
              <span className="detail-value">{oferta.jornada || 'No especificada'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha de publicación:</span>
              <span className="detail-value">{formatearFecha(oferta.fechaPublicacion)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Fecha límite:</span>
              <span className="detail-value">{oferta.fechaLimite ? formatearFecha(oferta.fechaLimite) : 'No especificada'}</span>
            </div>
          </div>

          {/* Requisitos */}
          {(oferta.requisitosExperiencia || oferta.requisitosFormacion || oferta.requisitosIdiomas) && (
            <div className="requisitos-section">
              <h3>Requisitos</h3>
              <div className="requisitos-content">
                {oferta.requisitosExperiencia && (
                  <div className="requisito-item">
                    <h4>Experiencia</h4>
                    <p>{oferta.requisitosExperiencia}</p>
                  </div>
                )}
                
                {oferta.requisitosFormacion && (
                  <div className="requisito-item">
                    <h4>Formación</h4>
                    <p>{oferta.requisitosFormacion}</p>
                  </div>
                )}
                
                {oferta.requisitosIdiomas && (
                  <div className="requisito-item">
                    <h4>Idiomas</h4>
                    <p>{oferta.requisitosIdiomas}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones según el rol */}
          {userData?.role === "demandante" && (
            <div className="acciones-section">
              {!yaAplicado ? (
                <div className="aplicar-section">
                  {!mostrarFormulario ? (
                    <button 
                      className="btn btn-primary btn-aplicar"
                      onClick={() => setMostrarFormulario(true)}
                    >
                      Aplicar a esta oferta
                    </button>
                  ) : (
                    <div className="formulario-solicitud">
                      <h3>Envía tu solicitud</h3>
                      <textarea
                        className="mensaje-textarea"
                        placeholder="Escribe un mensaje explicando por qué te interesa esta oferta..."
                        value={mensajeSolicitud}
                        onChange={(e) => setMensajeSolicitud(e.target.value)}
                        rows="5"
                      />
                      <div className="formulario-acciones">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setMostrarFormulario(false);
                            setMensajeSolicitud("");
                          }}
                        >
                          Cancelar
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={handleAplicar}
                          disabled={aplicando || !mensajeSolicitud.trim()}
                        >
                          {aplicando ? "Enviando..." : "Enviar solicitud"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ya-aplicado">
                  <p className="mensaje-ya-aplicado">✅ Ya has aplicado a esta oferta</p>
                </div>
              )}
            </div>
          )}

          {userData?.role === "club" && oferta.clubId && (
            <div className="club-acciones">
              <p className="info-club">
                Como club, puedes gestionar las solicitudes desde tu panel de control.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfertaDetalle; 