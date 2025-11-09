import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import "./Header.css";
import Logo from "../../assets/logo_pagina.webp";

const Header = ({ userData }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const NavigationButtons = () => {
    if (userData?.role === "reportero") {
      return (
        <>
          <Button variant="text">
            <Link to="/dashboard/create">Crear Noticia</Link>
          </Button>
          <Button variant="text">
            <Link to="/dashboard/my-news">Mis Noticias</Link>
          </Button>
        </>
      );
    } else if (userData?.role === "editor") {
      return (
        <Button variant="text">
          <Link to="/dashboard/admin">Gestión de Noticias</Link>
        </Button>
      );
    } else {
      return <p>No tienes un rol asignado.</p>;
    }
  };

  return (
    <header className="dashboard-header">
      {/* --- Versión de escritorio --- */}
      <div className="dashboard-desktop desktop-only">
        <section className="welcome-section">
          <img src={Logo} alt="Logo de la página" className="logo-image" />
          <h1>
            Bienvenido <span>{userData?.nombre || "Usuario"}</span>
          </h1>
          <hr />
          <p className="role-text">Rol: {userData?.role}</p>
          <nav className="nav-buttons">
            <NavigationButtons />
          </nav>
        </section>
        <div className="logout-button">
          <Button variant="contained" color="error" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* --- Versión móvil --- */}
      <div className="mobile-header mobile-only">
        <div className="mobile-topbar">
          <img src={Logo} alt="Logo" className="logo-image-small" />
          <IconButton onClick={() => setMenuOpen(true)}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        </div>

        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          PaperProps={{
            sx: { backgroundColor: "#1b1f2b", color: "white", padding: 2 },
          }}
        >
          <h3>Bienvenido {userData?.nombre || "Usuario"}</h3>
          <p>Rol: {userData?.role}</p>
          <hr className="drawer-divider" />
          <div className="drawer-buttons">
            <NavigationButtons />
          </div>
          <div className="logout-mov-button">
            <Button className="logout-button-mobile"
              variant="contained"
              color="error"
              fullWidth
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </Drawer>
      </div>
    </header>
  );
};

export default Header;
