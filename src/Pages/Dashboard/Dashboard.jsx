import React from "react";
import CreateNews from "../../Components/CreateNews/CreateNews";
import NewsList from "../../Components/NewsList/NewsList";
import { useAuth } from "../../Context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { userData, logout } = useAuth();

  const renderContent = () => {
    if (userData?.role === "reportero") {
      return (
        <>
          <CreateNews />
          <NewsList />
        </>
      );
    } else if (userData?.role === "editor") {
      return (
        <div className="editor-section">
          <h2>Panel del Editor</h2>
          <p>
            Como <strong>Editor</strong>, puedes aprobar, publicar, desactivar o editar
            noticias.
          </p>
          <a className="btn-admin" href="/admin">
            Ir al Panel Administrativo
          </a>
        </div>
      );
    } else {
      return <p>No tienes un rol asignado.</p>;
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>
          Bienvenido, <span>{userData?.nombre || "Usuario"}</span>
        </h1>
        <p className="role-text">Rol: {userData?.role}</p>
        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <main className="dashboard-main">{renderContent()}</main>
    </div>
  );
}
