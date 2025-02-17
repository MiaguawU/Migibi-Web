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
        console.log("Token en localStorage:", token);

        if (!token) {
            message.warning("No hay sesión activa.");
            return;
        }

        // Solicitud de cierre de sesión al backend
        await axios.post(`${PUERTO}/logout/`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // 🗑️ Eliminar datos de sesión en localStorage y sessionStorage
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        localStorage.clear();

        // ✅ Notificar al usuario
        message.success("Sesión cerrada correctamente.");

        // 🔄 Redirigir al usuario a la página de inicio o login
        window.location.href = "/acceder";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        message.error("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
};

  

const datosPerfil = async () => {
  setLoading(true);
  try {
    // ✅ Obtener el usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    // ✅ Convertir el usuario a un objeto
    const user = JSON.parse(storedUser);

    // ✅ Obtener el token de autenticación
    const token = localStorage.getItem("authToken");
    if (!token) {
      message.warning("Sesión expirada. Inicia sesión nuevamente.");
      return;
    }

    // ✅ Hacer la solicitud con el token en los headers
    const response = await axios.get(`${PUERTO}/usuarios/`, {
      params: { id_us: user.id }, // ✅ Enviar ID correcto
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ Enviar token en la petición
      }
    });

    // ✅ Verificar si la respuesta contiene datos
    if (!response.data) {
      message.warning("No se encontró información del usuario.");
      return;
    }

    // ✅ Extraer datos de la respuesta
    const userData = response.data;
    
    setFormData({
      Nombre_Usuario: userData.Nombre_Usuario || "No info",
      foto_perfil: userData.foto_perfil && userData.foto_perfil.startsWith("http")
        ? userData.foto_perfil
        : userData.foto_perfil 
          ? `${PUERTO}/${userData.foto_perfil}`
          : "/default-profile.png",  // ✅ Imagen por defecto si no hay foto
      Cohabitantes: userData.Cohabitantes || "No info",
      Email: userData.Email || "No info",
    });

  } catch (error: any) {
    console.error("Error al obtener usuario:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        message.warning("Usuario no encontrado.");
      } else {
        message.error("No se pudo conectar con el servidor.");
      }
    } else {
      message.error("Error inesperado.");
    }
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
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        message.error("No hay un usuario logueado.");
        return;
      }
  
      const user = JSON.parse(storedUser);
      const userId = user.id;
      if (!userId) {
        message.error("No se pudo obtener el ID del usuario.");
        return;
      }
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
  
      // Crear FormData
      const formDataToSend = new FormData();
  
      // Si el nombre de usuario está definido, lo agregamos
      if (formData.Nombre_Usuario) {
        formDataToSend.append("Nombre_Usuario", formData.Nombre_Usuario);
      }
  
      // Si hay cohabitantes, lo agregamos
      if (formData.Cohabitantes) {
        formDataToSend.append("Cohabitantes", formData.Cohabitantes);
      }
  
      // Si hay email, lo agregamos
      if (formData.Email) {
        formDataToSend.append("Email", formData.Email);
      }
  
      // Verificar si la imagen es un archivo antes de agregarla
      if (formData.foto_perfil && typeof formData.foto_perfil !== "string") {
        formDataToSend.append("foto_perfil", formData.foto_perfil);
      }
  
      // ✅ Usar `Array.from` para iterar sobre `FormData`
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });
  
      // Enviar la solicitud con los datos
      const response = await axios.put(`${PUERTO}/usuarios/${userId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        message.success("Cambios guardados correctamente.");
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