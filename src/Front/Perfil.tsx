import React, { useState, useEffect } from "react";
import { Input, ConfigProvider, message, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import "./perfil.css";
import NumericInput from "./Componentes/NumberInput";
import type { UploadProps } from 'antd';
import PUERTO from "../config";
import axios from "axios";
import btPerfil from "../Img/btPerfil.png"; // Imagen predeterminada

const UserProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    Nombre_Usuario: '',
    foto_perfil: '',
    Cohabitantes: '',
    Email: '',
    FileImagen: null as File | null, // Para almacenar la imagen seleccionada
  });

  const [loading, setLoading] = useState(true);

  // Configuración para la subida de imágenes
  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: (file: File) => {
      if (!file.type.startsWith("image/")) {
        message.error("Solo puedes subir archivos de imagen.");
        return false;
      }
      // Crear URL para previsualización
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, foto_perfil: objectUrl, FileImagen: file }));
      return false; // Evita la subida automática
    },
  };

  // Función para obtener los datos del perfil
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
        setFormData({
          Nombre_Usuario: userData.Nombre_Usuario || "No info",
          foto_perfil: userData.foto_perfil?.startsWith("http")
            ? userData.foto_perfil
            : `${PUERTO}/${userData.foto_perfil}`,
          Cohabitantes: userData.Cohabitantes || "No info",
          Email: userData.Email || "No info",
          FileImagen: null, // Resetea la imagen para evitar envíos innecesarios
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

  // Si la imagen falla al cargar, se asigna una imagen predeterminada
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = btPerfil;
  };

  // Función para guardar los cambios en el perfil
  const handleSaveChanges = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.error("No hay un usuario logueado.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("Nombre_Usuario", formData.Nombre_Usuario);
      formDataToSend.append("Cohabitantes", formData.Cohabitantes);
      formDataToSend.append("Email", formData.Email);

      if (formData.FileImagen) {
        formDataToSend.append("foto_perfil", formData.FileImagen);
      }

      // Opcional: Mostrar en consola los datos que se enviarán
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });

      const response = await axios.put(`${PUERTO}/usuarios/${currentUser}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        message.success("Perfil actualizado correctamente.");
        datosPerfil(); // Recargar los datos actualizados
      } else {
        message.error("No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      message.error("Hubo un error al guardar los cambios.");
    }
  };

  // Puedes agregar aquí el handler para cerrar sesión si lo requieres

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
        {/* Botones para guardar cambios y cerrar sesión */}
        <div className="logout-button-container">
          <button className="save-button" onClick={handleSaveChanges}>
            Guardar cambios
          </button>
          <button className="logout-button" onClick={() => {/* Implementa aquí el logout */}}>
            Cerrar sesión
          </button>
        </div>

        {/* Sección del avatar */}
        <div className="avatar-section">
          <div className="avatar">
            <img
              src={formData.foto_perfil || btPerfil}
              alt="Perfil"
              onError={handleImageError}
              style={{
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
            <Upload {...uploadProps}>
              <Button className="btUp" icon={<UploadOutlined />} />
            </Upload>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="info-section">
          <Input
            variant="borderless"
            value={formData.Nombre_Usuario}
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
                  value={formData.Cohabitantes}
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
