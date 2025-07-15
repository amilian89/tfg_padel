import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await axios.get(`${API_URL}/ofertas`);
        setOfertas(res.data);
      } catch (err) {
        setError("No se pudieron cargar las ofertas.");
      }
    };
    fetchOfertas();
  }, []);

  return (
    <div>
      <h1>Bienvenido a TFG Pádel</h1>
      <h2>Ofertas públicas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {ofertas.length === 0 && !error && <p>No hay ofertas disponibles.</p>}
        {ofertas.map((oferta) => (
          <div key={oferta.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
            <h3>{oferta.titulo}</h3>
            <p><strong>Deporte:</strong> {oferta.tipoDeporte}</p>
            <p><strong>Ubicación:</strong> {oferta.ubicacion}</p>
            <p><strong>Club:</strong> {oferta.club?.nombreClub || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 