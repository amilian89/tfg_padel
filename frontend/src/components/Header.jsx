import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLogged = Boolean(window.localStorage.getItem("token"));

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <header style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ cursor: "pointer", fontWeight: "bold", fontSize: "20px" }} onClick={() => navigate("/")}>TFG Pádel</div>
      <nav>
        {!isLogged ? (
          <>
            <button onClick={() => navigate("/login")}>Iniciar sesión</button>
            <button onClick={() => navigate("/register")}>Registrarse</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/perfil")}>Mi perfil</button>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 