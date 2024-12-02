import React, { useState, useEffect } from "react";
import { Input, ConfigProvider, message } from "antd";
import "./perfil.css";
import NumericInput from "./Componentes/NumberInput";
import PUERTO from "../config";
import axios from "axios";
import btPerfil from '../Img/btPerfil.png'; // Imagen predeterminada si no hay una foto

const UserProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    Nombre_Usuario: '',
    foto_perfil: '', // Se espera que esto sea la URL de la foto
    Cohabitantes: '',
    Email: '',
  });

  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${PUERTO}/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      message.success("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      message.error("No se pudo cerrar la sesión.");
    }
  };

  const datosPerfil = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
      const user = usuarios[currentUser];

      if (!user) {
        message.warning("Usuario no encontrado en los datos locales.");
        return;
      }

      const response = await axios.get(`${PUERTO}/usuarios`, {
        params: { id_us: currentUser },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.length > 0) {
        const userData = response.data[0];
        setFormData({
          Nombre_Usuario: userData.Nombre_Usuario || 'No info',
          foto_perfil: userData.foto_perfil || '', // Si no hay foto, lo dejamos vacío
          Cohabitantes: userData.Cohabitantes || 'No info',
          Email: userData.Email || 'No info',
        });
        message.success("Usuario conectado correctamente.");
      } else {
        message.warning("No se encontró información del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      message.error("No se pudo conectar con el servidor.");
    }
  };

  useEffect(() => {
    datosPerfil();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generar la URL completa de la foto de perfil si existe, o dejarla vacía
  const fotoPerfilUrl = formData.foto_perfil ? `${PUERTO}/${formData.foto_perfil}` : '';

  const img = [
    {
      title: 'Imagen',
      dataIndex: 'foto_perfil',
      key: 'foto_perfil',
      render: (text: string) =>
        text ? (
          <div>
            <img
              src={`http://localhost:5000${formData.foto_perfil}`}
              alt="Perfil"
              style={{ width: 50, height: 50 }}
            />
          </div>
        ) : (
          'N/A'
        ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Jomhuria, Serif",
          fontSize: 35,
          colorText: "#8BA577",
        },
      }}
    >
    <div className="profile-container">
      {/* Botón de Cerrar Sesión */}
      <div className="logout-button-container">
        <button className="save-button">Guardar cambios</button>
        <button className="logout-button" onClick={logout}>Cerrar sesión</button>
      </div>

      <div className="avatar-section">
        <div className="avatar">
          <div
            className="avatar-circle"
            style={{
              backgroundImage: `url(${formData?.foto_perfil || btPerfil})`, // Usar la imagen del servidor o la predeterminada
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          ></div>
          <br />
          <br />
          <button className="edit-button">✎</button>
        </div>
      </div>

      <div className="info-section">
        <Input
          variant="borderless"
          value={formData.Nombre_Usuario || ''}
          onChange={(e) => setFormData({ ...formData, Nombre_Usuario: e.target.value })}
          className="user-title"
        />

        <div className="info-cards">
          <div className="info-card">
            <span>Tipos de alimentos que no puedo comer:</span>
            <button className="view-button">Ver</button>
          </div>
          <div className="info-card">
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Jomhuria, Serif",
                  fontSize: 25,
                  colorText: "#8BA577",
                  colorPrimaryActive: "#3E7E1E",
                },
                components: {
                  Input: {
                    activeBorderColor: "#3E7E1E",
                    hoverBorderColor: "#52A528",
                  },
                },
              }}
            >
              <span>Cantidad de personas que viven conmigo:</span>
              <NumericInput
                style={{ width: 50, textAlign: "center" }}
                value={formData.Cohabitantes || ''}
                onChange={(value) => setFormData({ ...formData, Cohabitantes: value })}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
      
    </ConfigProvider>
  );
};

export default UserProfile;
