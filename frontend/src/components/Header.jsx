import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { applyTheme } = useTheme();
  const isLogged = Boolean(window.localStorage.getItem("token"));
  const userRole = window.localStorage.getItem("rol");

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
          <div className="logo" onClick={() => navigate("/")}>
            <span className="logo-text">ProPista</span>
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