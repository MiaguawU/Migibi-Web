import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Input, ConfigProvider, Button, Card, Typography, message } from "antd";
import { MailFilled } from '@ant-design/icons';
import { customColors } from '../Front/Estilos/colores';
import "./perfil.css";
import PUERTO from "../config";
import axios from "axios";

const { Title } = Typography;

const VerificarCorreo: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

  const correctEmailFormat = (email: string): string => {
    // Elimina espacios en blanco, corrige errores menores como "@gmial.com" → "@gmail.com"
    return email
      .trim()
      .replace(/\s+/g, '') // Elimina espacios
      .replace(/@gmai\.com$/, '@gmail.com') // Corrige errores comunes
      .toLowerCase(); // Normaliza a minúsculas
  };

    const handleSubmit = () => {
        setEmail(correctEmailFormat(email));
        registro();
        /**Aquí debe ingresar */
    };

    const validateEmailFormat = (email: string): boolean => {
        // Expresión regular para validar correos de Gmail correctamente formateados
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    //aquí no tengo ni idea de qué hacer :D
  const registro = async () => {
    if (!validateEmailFormat(email)) return message.error("Ingrese un correo de Gmail válido.");
  
    const data = { email };
    console.log("📤 Enviando datos al servidor:", data);
  
    try {
      const response = await axios.post(`${PUERTO}/registro`, data, { headers: { "Content-Type": "application/json" } });
      console.log("✅ Respuesta del servidor:", response.data);
  
      localStorage.setItem("user", JSON.stringify(response.data));
      message.success("Correo de confirmacion enviado");
  
    } catch (error) {
      console.error("❌ Error en registro():", error);
  
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Error al registrar.";
        message.error(errorMsg);
      } else {
        message.error("Error inesperado al registrar.");
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 10,
          colorBgContainer: 'white',
          colorBorderSecondary: 'white',

        },
        components: {
          Input: {
            borderRadius: 15,
            controlHeight: 42,
            lineWidth: 2,
            activeBorderColor: '#6fb804',
            hoverBorderColor: '#84d706',
            activeShadow: '0 0 0 2px  rgba(150, 245, 12, 0.22)',
            colorBorder: '#b8f845',
            colorPrimaryActive: '#96f20a',
            colorPrimaryHover: '#96f20a',
          },
          Button: {
            borderRadius: 15,
            controlHeight: 42,
            lineWidth: 2,
            colorBorder: customColors.colorFrio3,
          }
        },

      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Card
          style={{
            width: '80vw',
            maxWidth: '500px',
            backgroundColor: "white",
            padding: "16px",
          }}
          bodyStyle={{ padding: "16px", display: 'flex', gap: '12px', flexDirection: 'column' }}
        >

          <Title level={3} style={{ textAlign: "center", color: customColors.colorFrio3 }}>
            Verificar Correo
          </Title>

          <Title level={5} style={{ textAlign: "center", color: customColors.colorFuerteCalido, fontWeight: 'light' }}>
            Le enviaremos un correo para verificar su identidad.
          </Title>

          <Input
            placeholder={"Correo Electrónico"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<MailFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
          />

          <Button
            type="primary" className='poppins-semibold'
            onClick={handleSubmit}
          >
            Enviar correo
          </Button>

        </Card>
      </div>
    </ConfigProvider>
  );
};

export default VerificarCorreo;