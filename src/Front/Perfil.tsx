import React, { useState, useEffect } from "react";
import { Input, ConfigProvider, message, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import "./perfil.css";
import NumericInput from "./Componentes/NumberInput";
import type { UploadProps } from 'antd';
import PUERTO from "../config";
import axios from "axios";
import btPerfil from "../Img/btPerfil.png";

const UserProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    Nombre_Usuario: '',
    foto_perfil: btPerfil,
    Cohabitantes: '',
    Email: '',
    FileImagen: null as File | null,
  });

  const [loading, setLoading] = useState(true);

  const datosPerfil = async () => {
    setLoading(true);
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }
      
      const response = await axios.get(`${PUERTO}/usuarios`, {
        params: { id_us: currentUser },
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.length > 0) {
        const userData = response.data[0];
        setFormData((prev) => ({
          ...prev,
          Nombre_Usuario: userData.Nombre_Usuario || "No info",
          foto_perfil: userData.foto_perfil?.startsWith("http")
            ? userData.foto_perfil
            : `${PUERTO}/${userData.foto_perfil}`,
          Cohabitantes: userData.Cohabitantes || 0,
          Email: userData.Email || "No info",
        }));
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

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Solo puedes subir archivos de imagen.");
        return false;
      }
      setFormData((prev) => ({ ...prev, foto_perfil: URL.createObjectURL(file), FileImagen: file }));
      return false;
    },
  };

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
  

  const handleSaveChanges = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.error("No hay un usuario logueado.");
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("Nombre_Usuario", formData.Nombre_Usuario?.trim() || "");
      formDataToSend.append("Cohabitantes", String(formData.Cohabitantes || "0"));
      formDataToSend.append("Email", formData.Email?.trim() || "");
      
      if (formData.FileImagen) {
        formDataToSend.append("foto_perfil", formData.FileImagen);
      }
  
      console.log("📦 Enviando FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await axios.put(
        `${PUERTO}/usuarios/${currentUser}`,
        formDataToSend,
        { headers: { Accept: "application/json" } }
      );
  
      if (response.status === 200) {
        message.success("Perfil actualizado correctamente.");
        datosPerfil();
      } else {
        message.error("Error al actualizar el perfil.");
      }
    } catch (error) {
      console.error("🚨 Error:", error);
      message.error("No se pudieron guardar los cambios.");
    }
  };
  
  
  

  return (
    <ConfigProvider theme={{ token: { fontFamily: "Jomhuria, Serif", fontSize: 35, colorText: "#8BA577" } }}>
      <div className="profile-container">
        <div className="logout-button-container">
          <button className="save-button" onClick={handleSaveChanges}>Guardar cambios</button>
          <button className="logout-button" onClick={logout}>Cerrar sesión</button>
        </div>

        <div className="avatar-section">
          <div className="avatar">
            <img style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }} src={formData.foto_perfil || btPerfil} alt="Perfil" onError={(e) => e.currentTarget.src = btPerfil} className="profile-image" />
            <Upload {...uploadProps}>
              <Button className="btUp" icon={<UploadOutlined />} />
            </Upload>
          </div>
        </div>

        <div className="info-section">
          <Input variant="borderless" value={formData.Nombre_Usuario} onChange={(e) => setFormData({ ...formData, Nombre_Usuario: e.target.value })} className="user-title" />

          <div className="info-cards">
            <div className="info-card">
              <span>Tipos de alimentos que no puedo comer:</span>
              <button className="view-button">Ver</button>
            </div>
            <div className="info-card">
              <span>Cantidad de personas que viven conmigo:</span>
              <NumericInput
              style={{ width: 50, textAlign: "center" }}
              value={formData.Cohabitantes}
              onChange={(value) => setFormData({ ...formData, Cohabitantes: value })}
            />

            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserProfile;
