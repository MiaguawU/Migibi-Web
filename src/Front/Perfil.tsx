import React , { useState }from "react";
import {Input, ConfigProvider} from "antd";
import "./perfil.css";
import NumericInput from "./Componentes/NumberInput";

const UserProfile: React.FC = () => {
  
  const [value, setValue] = useState('');

  // Imagenes del avatar y del botón editar
  const [avatarImage, setAvatarImage] = useState<string>(
    "../Img/btPerfil.png" // Imagen de ejemplo para el avatar
  );
  const [editIconImage, setEditIconImage] = useState<string>(
    "https://via.placeholder.com/50" // Imagen de ejemplo para el botón editar
  );

  return (
    <>
    
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Jomhuria, Serif",
          fontSize: 35,
          colorText: "#8BA577"
        },
      }}
    >
    <div className="profile-container">
      {/* Botón de Cerrar Sesión */}
      <div className="logout-button-container">
        <button className="logout-button">Cerrar sesión</button>
      </div>

      {/* Sección de Avatar */}
      <div className="avatar-section">
        <div className="avatar">
          <div 
          className="avatar-circle"
          style={{
            backgroundImage: `url(../Img/btPerfil.png)`, // Asignar la imagen al fondo
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%", // Hace que el div sea circular
            width: "100px", // Ajusta el tamaño según sea necesario
            height: "100px",
          }}></div>
          <button className="edit-button">✎</button>
        </div>
      </div>

      {/* Sección de Información del Usuario */}
      <div className="info-section">
        <Input variant="borderless" defaultValue = "Usuario" className="user-title"/>
        
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
                  colorPrimaryActive: "#3E7E1E"
                },
                components: {
                  Input: {
                    activeBorderColor: "#3E7E1E",
                    hoverBorderColor: "#52A528"
                  },
                },
              }}
            >
            <span>Cantidad de personas que viven conmigo:</span>
            <NumericInput style={{ width: 50 , textAlign: "center"}} value={value} onChange={setValue} />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
    
    </ConfigProvider>
    </>
  );
};

export default UserProfile;
