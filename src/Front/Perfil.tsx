import React, { useState, useEffect } from "react";
import { Input, ConfigProvider, message } from "antd";
import "./perfil.css";
import NumericInput from "./Componentes/NumberInput";
import PUERTO from "../config";
import axios from "axios";
import btPerfil from "../Img/btPerfil.png"; // Imagen predeterminada si no hay una foto

const UserProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    Nombre_Usuario: '',
    foto_perfil: '',
    Cohabitantes: '',
    Email: '',
  });

  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem("authToken");
      
      // Realizar la solicitud de cierre de sesión al backend
      await axios.post(`${PUERTO}/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Eliminar datos relacionados con la sesión en localStorage y sessionStorage
      sessionStorage.removeItem("usuarios");
      sessionStorage.removeItem("currentUser");
      localStorage.removeItem("usuarios");
      localStorage.removeItem("currentUser");
      // Notificar al usuario del éxito
      message.success("Sesión cerrada correctamente.");
      
      // Opcional: Redirigir al usuario a la página de inicio o login
      window.location.href = "/acceder";
    } catch (error) {
      // Manejo de errores
      console.error("Error al cerrar sesión:", error);
      message.error("No se pudo cerrar la sesión. Inténtalo de nuevo más tarde.");
    }
  };
  

  const datosPerfil = async () => {
    setLoading(true);
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
          Nombre_Usuario: userData.Nombre_Usuario || "No info",
          foto_perfil: userData.foto_perfil?.startsWith("http")
            ? userData.foto_perfil 
            : `${PUERTO}/${userData.foto_perfil}`, 
          Cohabitantes: userData.Cohabitantes || "No info",
          Email: userData.Email || "No info",
        });
      } else {
        message.warning("No se encontró información del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    datosPerfil();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = btPerfil; // Usar imagen predeterminada si falla la carga
  };

  const handleSaveChanges = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser"); // Obtener el ID desde localStorage
      if (!currentUser) {
        message.error("No hay un usuario logueado.");
        return;
      }
  
      // El id debe ser el ID del usuario que está logueado (tomado de localStorage)
      const userId = currentUser; // Asegúrate que esto es el id del usuario
  
      // Aquí se manda el id junto con los datos del formulario
      const response = await axios.put(`${PUERTO}/usuarios/${userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        message.success("Cambios guardados correctamente.");
        // Actualizar el estado local o hacer cualquier acción adicional si es necesario
      } else {
        message.error("No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      message.error("Hubo un error al guardar los cambios.");
    }
  };
  

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
          <button className="save-button" onClick={handleSaveChanges}>
            Guardar cambios
          </button>
          <button className="logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="avatar-section">
          <div className="avatar">
            <img
              src={formData.foto_perfil || btPerfil}
              alt="Perfil"
              onError={handleImageError} // Manejar errores de carga de la imagen
              style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
            <button className="edit-button">✎</button>
          </div>
        </div>

        <div className="info-section">
          <Input
            variant="borderless"
            value={formData.Nombre_Usuario || ""}
            onChange={(e) =>
              setFormData({ ...formData, Nombre_Usuario: e.target.value })
            }
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
                  value={formData.Cohabitantes || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, Cohabitantes: value })
                  }
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
