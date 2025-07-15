import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (!email || !password) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    try {
      const res = await login({ email, password });
      const { token, usuario } = res.data;
      localStorage.setItem("token", token);
      if (usuario) {
        localStorage.setItem("id", usuario.id);
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("rol", usuario.rol);
      }
      setMensaje("Inicio de sesión exitoso.");
      // Redirigir a la página principal
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login; 