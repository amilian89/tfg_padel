import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./Panel.css";

const Panel = () => {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

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
    const userName = localStorage.getItem("nombre");
    
    setUserData({
      role: userRole,
      id: userId,
      name: userName
    });

    // Cargar ofertas
    loadOfertas();
  }, [navigate]);

  const loadOfertas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ofertas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOfertas(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar ofertas:", err);
      setError("Error al cargar las ofertas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerOferta = (ofertaId) => {
    navigate(`/oferta/${ofertaId}`);
  };

  const handlePublicarOferta = () => {
    navigate("/publicar");
  };

  if (loading) {
    return (
      <div className="panel">
        <Header />
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando ofertas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <Header />
      
      <div className="container">
        <div className="panel-header">
          <h1 className="panel-title">Ofertas disponibles</h1>
          {userData?.role === "club" && (
            <button 
              className="btn btn-primary btn-publicar"
              onClick={handlePublicarOferta}
            >
              Publicar nueva oferta
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="btn btn-secondary"
              onClick={loadOfertas}
            >
              Reintentar
            </button>
          </div>
        )}

        {!error && ofertas.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay ofertas disponibles</h3>
            <p>En este momento no hay ofertas publicadas. Vuelve más tarde.</p>
          </div>
        )}

        {!error && ofertas.length > 0 && (
          <div className="ofertas-grid">
            {ofertas.map((oferta) => (
              <div key={oferta.id} className="oferta-card">
                <div className="oferta-header">
                  <h3 className="oferta-titulo">{oferta.titulo || 'Sin título'}</h3>
                  {oferta.tipoDeporte && (
                    <span className={`deporte-badge ${oferta.tipoDeporte.toLowerCase()}`}>
                      {oferta.tipoDeporte}
                    </span>
                  )}
                </div>
                
                <div className="oferta-info">
                  <div className="info-item">
                    <span className="info-label">Club:</span>
                    <span className="info-value">{oferta.club?.nombreClub || 'No especificado'}</span>
                  </div>
                  {oferta.ubicacion && (
                    <div className="info-item">
                      <span className="info-label">Ubicación:</span>
                      <span className="info-value">{oferta.ubicacion}</span>
                    </div>
                  )}
                  {oferta.salario && (
                    <div className="info-item">
                      <span className="info-label">Salario:</span>
                      <span className="info-value">{oferta.salario}€</span>
                    </div>
                  )}
                </div>

                <div className="oferta-actions">
                  <button 
                    className="btn btn-primary btn-ver-mas"
                    onClick={() => handleVerOferta(oferta.id)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel; 