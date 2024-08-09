// src/components/WelcomeScreen.js
import React, { useState } from "react";
import logo from "../assets/logo.png"; // Ajusta la ruta según tu estructura
import "./WelcomeScreen.css"; // Importa el CSS actualizado
import { isMobile } from "react-device-detect";

const WelcomeScreen = ({ onContinue }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState(""); // Nuevo estado para la dirección
  const [notification, setNotification] = useState(""); // Estado para la notificación

  // Manejar el cambio en el campo del nombre y convertir a mayúsculas
  const handleNameChange = (event) => {
    setName(event.target.value.toUpperCase());
  };

  // Manejar el cambio en el campo de la dirección y convertir a mayúsculas
  const handleAddressChange = (event) => {
    setAddress(event.target.value.toUpperCase());
  };

  // Mostrar notificación
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000); // Ocultar notificación después de 3 segundos
  };

  // Validar que todos los campos estén llenos antes de continuar
  const handleContinue = () => {
    if (name.trim() === "" || address.trim() === "") {
      showNotification("Por favor, completa todos los campos.");
      return;
    }
    localStorage.setItem("nombre", name);
    localStorage.setItem("direccion", address); // Guardar la dirección en localStorage
    onContinue();
  };

  if (!isMobile) {
    return (
      <div>
        <p>Esta aplicación solo está disponible para dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div className="welcome-screen">
      <img src={logo} alt="Logo" className="logo" />
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
