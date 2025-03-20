import React, { useState } from 'react';
import { Card, Input, Button, Radio, Typography, ConfigProvider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from 'axios';
import PUERTO from '../../config';

const { Title } = Typography;

const AuthForm: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
  const [formMode, setFormMode] = useState<"register" | "login">("register");
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
  };

  const handleGoogleLogin = async (): Promise<void> => {
    window.location.href = `${PUERTO}/auth/google`;
  };

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      (password.match(/[A-Z]/g) || []).length >= 2 &&
      (password.match(/[a-z]/g) || []).length >= 2 &&
      (password.match(/[0-9]/g) || []).length >= 2
    );
  };

  const validateEmailFormat = (email: string): boolean => {
    // Expresión regular para validar correos de Gmail correctamente formateados
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };
  
  const correctEmailFormat = (email: string): string => {
    // Elimina espacios en blanco, corrige errores menores como "@gmial.com" → "@gmail.com"
    return email
      .trim()
      .replace(/\s+/g, '') // Elimina espacios
      .replace(/@gmai\.com$/, '@gmail.com') // Corrige errores comunes
      .toLowerCase(); // Normaliza a minúsculas
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const correctedEmail = correctEmailFormat(e.target.value);
    setEmail(correctedEmail);
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 4;
  };

  const sesionNormal = async () => {
    try {
      const data = { identifier: email, password }; // Se usa "identifier" para permitir usuario o correo

      const response = await axios.post(`${PUERTO}/login`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { id, username, foto_perfil, Cohabitantes, Email, message: serverMessage } = response.data;

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
    if (!validateUsername(username)) {
      message.error("El nombre de usuario debe tener al menos 4 caracteres.");
      return;
    }

    if (!email.includes("@")) {
      message.error("Ingrese un correo electrónico válido.");
      return;
    }

    if (!validatePassword(password)) {
      message.error("La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const data = { username, email, password };

      const response = await axios.post(`${PUERTO}/usuarios`, data, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      message.success("Registro exitoso");
    } catch (error) {
      console.error("❌ Error en registro():", error);
      message.error("Error al registrar");
    }
  };

  const handleSubmit = () => {
    if (formMode === "register") {
      if (!validateEmailFormat(email)) {
        message.error("El correo debe ser un Gmail válido (ejemplo@gmail.com).");
        return;
      }
      registro();
    } else {
      if (!email.includes("@")) {
        // Si el usuario ingresa solo un nombre, asumimos que es un nombre de usuario
        sesionNormal();
      } else {
        setEmail(correctEmailFormat(email)); // Corrige posibles errores en el email
        sesionNormal();
      }
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
            style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}
          >
            <Radio.Button value="register" style={{ minWidth: "100px", maxWidth: "200px" }}>Registrarse</Radio.Button>
            <Radio.Button value="login" style={{ minWidth: "100px", maxWidth: "200px" }}>Iniciar Sesión</Radio.Button>
          </Radio.Group>

          <Title level={4} style={{ textAlign: "center", color: "#669144" }}>
            {formMode === "register" ? "Registrarse" : "Iniciar Sesión"}
          </Title>

          {formMode === "register" && (
            <>
              <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
                Nombre de Usuario
              </Title>
              <Input
                placeholder="Nombre de Usuario"
                style={{ marginBottom: "8px", borderRadius: "8px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </>
          )}

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            {formMode === "register" ? "Correo Electrónico" : "Nombre de Usuario o Correo"}
          </Title>

          <Input
            placeholder={formMode === "register" ? "Correo Electrónico" : "Nombre de Usuario o Correo"}
            style={{ marginBottom: "8px", borderRadius: "8px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
            Contraseña
          </Title>

          <Input.Password
            placeholder="Contraseña"
            style={{ marginBottom: "16px", borderRadius: "8px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {formMode === "register" && (
            <>
              <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
                Confirmar Contraseña
              </Title>

              <Input.Password
                placeholder="Confirmar Contraseña"
                style={{ marginBottom: "16px", borderRadius: "8px" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

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
