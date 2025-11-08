import React from 'react'
import ErrorImage from '../../Assets/Error_404.webp'
import './ErrorComponent.css'

const ErrorComponent = () => {
  return (
    <div className="error-container">
        <img src={ErrorImage} alt="Error 404" />
    </div>
  )
}

export default ErrorComponent
