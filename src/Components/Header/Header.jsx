import React from 'react'
import './Header.css'
import { useAuth } from '../../Context/AuthContext'
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';

import Logo from '../../Assets/logo_pagina.webp'

const Header = ({ userData }) => {
  const { logout } = useAuth();
  const NavigationButtons = () => {
    if (userData?.role === "reportero") {
      return (
        <>
          <nav className="nav-buttons">
            <Button variant="text">
              <Link to="/dashboard/create">Crear Noticia</Link>
            </Button>
            <Button variant="text">
              <Link to="/dashboard/my-news">Mis Noticias</Link>
            </Button>
          </nav>
        </>
      );
    } else if (userData?.role === "editor") {
      return (
        <nav className="nav-buttons">
          <Button variant="text">
            <Link to="/dashboard/admin">Gestion de Noticias</Link>
          </Button>
        </nav>
      );
    } else {
      return <p>No tienes un rol asignado.</p>;
    }
  };

  return (
    <header className="dashboard-header">
      <div className="welcome-section">
        <img src={Logo} alt="Logo de la página" className="logo-image" />
        <h1>
          Bienvenido <span>{userData?.nombre || "Usuario"}</span>
        </h1>
        <p className="role-text">Rol: {userData?.role}</p>
        <NavigationButtons />
      </div>
      <div className="logout-button">
        <Button className="logout-button" variant="contained" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}

export default Header
