import React, { useState } from 'react';
import { Card, Input, Button, Radio, Typography, ConfigProvider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from 'axios';
import PUERTO from '../../config';

const { Title } = Typography;

const AuthForm: React.FC = () => {
  const [formMode, setFormMode] = useState<"register" | "login">("register");
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  
  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${PUERTO}/auth/google`;
  };

  const sesionNormal = async () => {
    try {
      const data = {
        username: email,
        password: password,
      };
      await axios.post('http://localhost:5000/usuarios', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      message.success('Bienvenid@');
    } catch (error) {
      message.error('Error al iniciar sesión');
    }
  };
  

  const registro = async () => {
    try {
      const formData = new FormData();
      formData.append("username", email); // Campo username
      formData.append("password", password); // Campo password
  
      await axios.post("http://localhost:5000/usuarios", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      message.success("Registro exitoso");
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al registrar");
    }
  };
  
  
  
  
  
  
  const registroGmail = async () => {
    try {
      const formData = new FormData();
      formData.append('username', email); // Usamos 'username' en lugar de 'email'
      formData.append('password', password); // Agregamos la contraseña
  
      await axios.post('http://localhost:5000/usuarioGmail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Asegúrate de que el tipo de contenido es multipart/form-data
        },
      });
  
      message.success('Registro exitoso');
    } catch (error) {
      console.error(error);
      message.error('Error al registrar email');
    }
  };

  const handleSubmit = () => {
    if (formMode === "register") {
      if (email.endsWith("@gmail.com")) {
        registroGmail(); // Llama a la función correcta para Gmail
      } else {
        registro();
      }
    } else {
      sesionNormal();
    }
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

          {formMode === "login" && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Button
                shape="circle"
                icon={<GoogleOutlined />}
                style={{ backgroundColor: "#E1EBCD", border: "1px solid #3E7E1E" }}
                onClick={handleGoogleLogin}
              />
            </div>
          )}

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
