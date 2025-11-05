// src/Pages/SelectRole.jsx
import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

export default function SelectRole() {
  const { user, userData, setRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    // si nadie autenticado, redirigir al login
    navigate("/login");
    return null;
  }

  // si ya tiene role, redirigir según role
  if (userData?.role) {
    if (userData.role === "editor") navigate("/admin");
    else navigate("/dashboard");
    return null;
  }

  const choose = async (role) => {
    setError("");
    setLoading(true);
    try {
      await setRole(user.uid, role);
      // redirigir según rol elegido
      if (role === "editor") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError("No se pudo guardar el rol, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="select-role-page">
      <div className="select-role-card">
        <h2>Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ""}</h2>
        <p className="muted">Selecciona tu rol para continuar</p>

        <div className="roles-grid">
          <button
            className="role-btn role-reportero"
            onClick={() => choose("reportero")}
            disabled={loading}
          >
            📝 Reportero
            <span className="role-desc">Crear y editar noticias (no publicar)</span>
          </button>

          <button
            className="role-btn role-editor"
            onClick={() => choose("editor")}
            disabled={loading}
          >
            📰 Editor
            <span className="role-desc">Aprobar, publicar y gestionar todas las noticias</span>
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        <p className="small">Puedes cambiar tu rol más tarde (si tu app lo permite).</p>
      </div>
    </div>
  );
}
