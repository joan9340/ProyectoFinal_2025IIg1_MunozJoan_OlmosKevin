import React from 'react'
import ImageLogo from '../../assets/logo_pagina.webp'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import './HeaderPage.css'

const HeaderPage = () => {
    return (
        <div className="header-page">
            <Link to="/">
                <img src={ImageLogo} alt="Logo" className="header-logo" />
            </Link>
            <Button variant="outlined" color="primary">
                <Link to="/login">Iniciar Sesion</Link>
            </Button>
        </div>
    )
}

export default HeaderPage