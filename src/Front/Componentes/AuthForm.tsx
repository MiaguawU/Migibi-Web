import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Radio, Typography, ConfigProvider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from 'axios';
import PUERTO from '../../config';

const { Title } = Typography;

const AuthForm: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
  const [formMode, setFormMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mostrarNotificacionEmail, setMostrarNotificacionEmail] = useState(false);

  const handleAgregarEmail = () => {
    if (email.trim() === '') {
      alert('Por favor, ingresa un email.');
      return;
    }

    setMostrarNotificacionEmail(true);
    setTimeout(() => {
      setMostrarNotificacionEmail(false);
    }, 3000);

    setEmail('');
  };

  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
  };

  const handleGoogleLogin = async (): Promise<void> => {
    // Redirigir al flujo de Google OAuth
    window.location.href = `${PUERTO}/auth/google`;
  };

  const saveGoogleUserData = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const username = params.get("username");
    const email = params.get("email");
    const foto_perfil = params.get("foto_perfil");
    const cohabitantes = params.get("Cohabitantes");

    if (id && username && email) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
      usuarios[id] = { username, email, foto_perfil, cohabitantes };

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("currentUser", id);

      message.success(`Sesión iniciada como ${username}`);
      
      onLogin({ id, username, email, foto_perfil, cohabitantes });
    }
  };

  const sesionNormal = async () => {
    try {
      const data = { username: email, password };

      const response = await axios.post(`${PUERTO}/login`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { id, username, foto_perfil, Cohabitantes, Email, message: serverMessage } = response.data;

      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
      usuarios[id] = { username, foto_perfil, Cohabitantes, Email };

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("currentUser", id);

      message.success(`Bienvenido, ${username}. ${serverMessage}`);

      onLogin({ id, username, email: Email, foto_perfil, Cohabitantes });
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);

      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || 'Error al iniciar sesión. Por favor, intente nuevamente.');
      } else {
        message.error('Ocurrió un error inesperado.');
      }
    }
  };

  const registro = async () => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${PUERTO}/usuarios`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      message.success("Registro exitoso");
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al registrar");
    }
  };

  const registroGmail = async () => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post(`${PUERTO}/usuarioGmail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      message.success('Registro exitoso');
    } catch (error) {
      console.error(error);
      message.error('Error al registrar email');
    }
  };

  const handleSubmit = () => {
    if (formMode === "register") {
      if (email.endsWith("@gmail.com")) {
        registroGmail();
      } else {
        registro();
      }
    } else {
      sesionNormal();
    }
  };

  useEffect(() => {
    saveGoogleUserData();
  }, []);
  
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
          <Radio.Group
            onChange={handleModeChange}
            value={formMode}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <Radio.Button value="register" style={{ minWidth: "100px", maxWidth: "200px" }}>Registrarse</Radio.Button>
            <Radio.Button value="login" style={{ minWidth: "100px", maxWidth: "200px" }}>Iniciar Sesión</Radio.Button>
          </Radio.Group>

          <Title level={4} style={{ textAlign: "center", color: "#669144" }}>
            {formMode === "register" ? "Registrarse" : "Iniciar Sesión"}
          </Title>

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            {formMode === "register" ? "Nombre/Correo" : "Correo"}
          </Title>

          <Input
            placeholder={formMode === "register" ? "Nombre/Correo" : "Correo"}
            style={{
              marginBottom: "0px",
              borderRadius: "8px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            Contraseña
          </Title>

          <Input.Password
            placeholder="Contraseña"
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Button
                shape="circle"
                icon={<GoogleOutlined />}
                style={{ backgroundColor: "#E1EBCD", border: "1px solid #3E7E1E" }}
                onClick={handleGoogleLogin}
              />
            </div>
          

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
            {formMode === "register" ? "Registrarse" : "Iniciar Sesión"}
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default AuthForm;
