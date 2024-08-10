// src/components/WelcomeScreen.js
import React, { useState } from "react";
import logo from "../assets/logo.png";
import "./WelcomeScreen.css";
import { isMobile } from "react-device-detect";

const WelcomeScreen = ({ onContinue }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notification, setNotification] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value.toUpperCase());
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value.toUpperCase());
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleContinue = () => {
    if (name.trim() === "" || address.trim() === "") {
      showNotification("Por favor, completa todos los campos.");
      return;
    }
    localStorage.setItem("nombre", name);
    localStorage.setItem("direccion", address);
    setIsAnimating(true);
    setTimeout(() => {
      onContinue();
    }, 500); // Tiempo de duración de la animación
  };

  if (!isMobile) {
    return (
      <div>
        <p>Esta aplicación solo está disponible para dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div className={`welcome-screen ${isAnimating ? "animate-logo" : ""}`}>
      <img
        src={logo}
        alt="Logo"
        className={`logo ${isAnimating ? "animate" : ""}`}
      />
      <h1 className="title">Bienvenido</h1>
      <p className="subtitle">¿Puedes darnos tu nombre y dirección?</p>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={handleNameChange}
        className="input"
      />
      <input
        type="text"
        placeholder="Tu dirección"
        value={address}
        onChange={handleAddressChange}
        className="input"
      />
      <button className="continue-button" onClick={handleContinue}>
        Continuar
      </button>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default WelcomeScreen;
