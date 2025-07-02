import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, ConfigProvider, Button, Card, Typography, message } from "antd";
import axios from "axios";
import { LockFilled } from '@ant-design/icons';
import { customColors } from '../Front/Estilos/colores';
import "./perfil.css";
import PUERTO from "../config";

const { Title } = Typography;

const CambiarContrasenia: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null); // State to store the token
  const navigate = useNavigate();
  const location = useLocation();

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      (password.match(/[A-Z]/g) || []).length >= 2 &&
      (password.match(/[a-z]/g) || []).length >= 2 &&
      (password.match(/[0-9]/g) || []).length >= 2
    );
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // Optional: Redirect or show an error if no token is found in the URL
      message.error("No se encontró un token de restablecimiento de contraseña en la URL.");
      // You might want to navigate back to a "forgot password" page or home
      // navigate('/forgot-password');
    }
  }, [location.search, navigate]); 

  const handleSubmit = async () => {

    if (!token) {
      message.error("No se ha encontrado un token de restablecimiento válido.");
      return;
    }

    if (!validatePassword(password)) {
      return message.error("La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números.");
    }

    if (password !== confirmPassword) {
      return message.error("Las contraseñas no coinciden.");
    }

    try {
      const response = await axios.post(`${PUERTO}/password/password`, { token: token, newPassword: password }, {
        headers: { "Content-Type": "application/json" }
      });

      message.success("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/acceder?modo=login"), 2000);
    } catch (error) {
      console.error("❌ Error al actualizar contraseña:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Error al cambiar contraseña.";
        message.error(errorMsg);
      } else {
        message.error("Error inesperado al cambiar contraseña.");
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
            Cambiar contraseña
          </Title>

          <Title level={5} style={{ textAlign: "center", color: customColors.colorFuerteCalido, fontWeight: 'light' }}>
            Por favor, escriba su nueva contraseña.
          </Title>

          <Input.Password
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
          />

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            Confirmar Contraseña
          </Title>

          <Input.Password
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefix={<LockFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
          />

          <Button
            type="primary"
            block
            style={{
              borderRadius: "8px",
              backgroundColor: "#669144",
              borderColor: "#669144",
            }}
            onClick={handleSubmit}
          >
            Cambiar contraseña
          </Button>

        </Card>
      </div>
    </ConfigProvider>
  );
};

export default CambiarContrasenia;
