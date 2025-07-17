import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Panel from "./pages/Panel";
import OfertaDetalle from "./pages/OfertaDetalle";
import PublicarOferta from "./pages/PublicarOferta";
import SolicitudesRecibidas from "./pages/SolicitudesRecibidas";
import MisSolicitudes from "./pages/MisSolicitudes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/oferta/:id" element={<OfertaDetalle />} />
        <Route path="/publicar" element={<PublicarOferta />} />
        <Route path="/solicitudes" element={<SolicitudesRecibidas />} />
        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
      </Routes>
    </Router>
  );
}

export default App;
