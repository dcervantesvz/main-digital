// src/components/ProfileModal.js
import React, { useState } from "react";
import "./ProfileModal.css";

const ProfileModal = ({ onClose }) => {
  const [name, setName] = useState(localStorage.getItem("nombre") || "");
  const [address, setAddress] = useState(
    localStorage.getItem("direccion") || ""
  );

  const handleSave = () => {
    localStorage.setItem("nombre", name);
    localStorage.setItem("direccion", address);
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Actualizar Perfil</h2>
        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <button className="save-button" onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
