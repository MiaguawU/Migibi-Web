import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Input, ConfigProvider, Button, Card, Typography, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import "./perfil.css";
import PUERTO from "../config";
import axios from "axios";

const { Title } = Typography;

const CambiarContrasenia: React.FC = () => {

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      (password.match(/[A-Z]/g) || []).length >= 2 &&
      (password.match(/[a-z]/g) || []).length >= 2 &&
      (password.match(/[0-9]/g) || []).length >= 2
    );
  };

  const registro = async () => {
    if (!validatePassword(password)) return message.error("La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números.");
    if (password !== confirmPassword) return message.error("Las contraseñas no coinciden.");
  
    const data = { password };
    console.log("📤 Enviando datos al servidor:", data);
  /**Aquí se necesita el token */
    try {
      const response = await axios.post(`${PUERTO}/password`, data, { headers: { "Content-Type": "application/json" } });
      console.log("✅ Respuesta del servidor:", response.data);
      message.success("Contraseña correctamente enviada");
  
    } catch (error) {
      console.error("❌ Error en registro():", error);
  
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Error al cambiar contraseña.";
        message.error(errorMsg);
      } else {
        message.error("Error inesperado al cambiar contraseña.");
      }
    }
  };

  const handleSubmit = () => {
    registro();
    /**Aquí debe ingresar */
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 10,
          colorBorder: "#3E7E1E",
          colorBgContainer: '#E1EBCD',
        },
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Card
          style={{
            width: '80vw',
            maxWidth: '500px',
            backgroundColor: "#CEDFAC",
            borderRadius: 10,
            padding: "16px",
          }}
          bodyStyle={{ padding: "16px" }}
        >

          <Title level={4} style={{ textAlign: "center", color: "#669144" }}>
            Cambiar contraseña
          </Title>

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            Contraseña
          </Title>

          <Input.Password
            placeholder="Contraseña"
            style={{ marginBottom: "16px", borderRadius: "8px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            Confirmar Contraseña
            </Title>

          <Input.Password
            placeholder="Confirmar Contraseña"
            style={{ marginBottom: "16px", borderRadius: "8px" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />

          <Button
            type="primary"
            block
            style={{
              borderRadius: "8px",
              backgroundColor: "#669144",
              borderColor: "#669144",
            }}
            onClick={() => navigate('/cambiarContrasenia')}
          >
            Cambiar contraseña
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default CambiarContrasenia;