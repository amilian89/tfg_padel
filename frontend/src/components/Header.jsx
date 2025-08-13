import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useNotificaciones } from "../hooks/useNotificaciones";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { applyTheme } = useTheme();
  const isLogged = Boolean(window.localStorage.getItem("token"));
  const userRole = window.localStorage.getItem("rol");
  const usuarioId = window.localStorage.getItem("id");
  
  // Hook de notificaciones
  const { contadorNoLeidas, isConnected } = useNotificaciones(usuarioId);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("rol");
    
    // Forzar la actualización del tema inmediatamente
    applyTheme();
    
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => navigate("/")} title="ProPista - Inicio">
            <img src="/logo.png" alt="ProPista Logo" className="logo-image" />
          </div>
          <nav className="nav">
            {!isLogged ? (
              <div className="nav-buttons">
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate("/register")}
                >
                  Registrarse
                </button>
              </div>
            ) : (
              <div className="nav-buttons">
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate("/panel")}
                >
                  Panel
                </button>
                {userRole === "club" && (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => navigate("/solicitudes")}
                  >
                    Solicitudes
                  </button>
                )}
                {userRole === "demandante" && (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => navigate("/mis-solicitudes")}
                  >
                    Mis Solicitudes
                  </button>
                )}
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate("/perfil")}
                >
                  Mi perfil
                </button>
                <button 
                  className="btn btn-outline notification-btn" 
                  onClick={() => navigate("/notificaciones")}
                  title="Notificaciones"
                >
                  🔔
                  {contadorNoLeidas > 0 && (
                    <span className="notification-badge">{contadorNoLeidas}</span>
                  )}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 