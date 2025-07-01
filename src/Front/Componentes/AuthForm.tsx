import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Input, Button, Typography, ConfigProvider, message, theme } from "antd";
import { GoogleOutlined, UserOutlined, MailFilled, LockFilled } from "@ant-design/icons";
import heart from '../../Img/CorazonPerfil.png';
import { customColors } from '../Estilos/colores';
import axios from 'axios';
import PUERTO from '../../config';

const { Title } = Typography;

const AuthForm: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
  const { token } = theme.useToken();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modo = queryParams.get('modo') as 'login' | 'register';
  const [formMode, setFormMode] = useState<"register" | "login">(modo || 'register');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
  };

  useEffect(() => {
    if (modo === 'login' || modo === 'register') {
      setFormMode(modo);
    }
  }, [modo]);

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

  const validateUsername = (username: string): boolean => {
    return username.length >= 4;
  };

  const sesionNormal = async () => {
    try {
      const data = { identifier: email, password };
      const response = await axios.post(`${PUERTO}/login`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      const { id, username, foto_perfil, Cohabitantes, Email, message: serverMessage } = response.data;
      localStorage.setItem("currentUser", id);
      message.success(`Bienvenido, ${username}. ${serverMessage}`);
      onLogin({ id, username, email: Email, foto_perfil, Cohabitantes });
      window.location.href = "/";
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Cuenta bloqueada temporalmente (15 min))";
        message.error(errorMsg);
      } else {
        message.error("Ocurrió un error inesperado.");
      }
    }
  };
  


  const registro = async () => {
    if (!validateUsername(username)) return message.error("El nombre de usuario debe tener al menos 4 caracteres.");
    if (!validateEmailFormat(email)) return message.error("Ingrese un correo de Gmail válido.");
    if (!validatePassword(password)) return message.error("La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números.");
    if (password !== confirmPassword) return message.error("Las contraseñas no coinciden.");
  
    const data = { username, email, password };
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
    <>
  <style>
    {`
      .form-container {
        flex-direction: column;
        display: flex;
        justify-content: space-around;
        margin: 50px;
        gap: 20px;
        align-items: center;
      }

      @media (min-width: 768px) {
        .form-container {
          flex-direction: row;
        }
      }
    `}
  </style>
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
      {formMode === 'login' && (
        <div className="profile-container">
          <div className="logout-button-container">
            <button className="logout-button" onClick={() => navigate('/verificarCorreo')}>Recuperar contraseña</button>
          </div>
        </div>
      )}
      
      <div className='form-container'>
        <div style={{display: 'flex'}}>
          <img src={heart} style={{width: '100%', height: 'auto', maxWidth: '100%', objectFit: 'contain'}}/>
        </div>
        <Card
          style={{
            width: '80vw',
            maxWidth: '500px',
            backgroundColor: "white",
            padding: "16px",
          }}
          bodyStyle={{ padding: "16px", display: 'flex', gap: '12px', flexDirection: 'column' }}
        >
          <Title level={3} style={{ textAlign: "center", color: customColors.colorFuerteFrio}} className='poppins-semibold'>
            {formMode === "register" ? "¡Regístrate!" : "Iniciar Sesión"}
          </Title>

          {formMode === "register" && (
            <>
              <Input
                placeholder="Nombre de Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                prefix={<UserOutlined style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
              />

            </>
          )}

          <Input
            placeholder={formMode === "register" ? "Correo Electrónico" : "Correo Electrónico"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<MailFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
          />

          <Input.Password
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
          />

          {formMode === "register" && (
            <>
            <Input.Password
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              prefix={<LockFilled style={{fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder'}}/>}
            />
            </>
          )}

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Button
              shape="circle"
              icon={<GoogleOutlined style={{color: customColors.colorFuerteFrio}}/>}
              style={{ backgroundColor: customColors.colorPrimarioClaro, border: `1px solid ${customColors.colorPrimarioClaro}` }}
              onClick={handleGoogleLogin}
            />
          </div>

          <Button
            type="primary" className='poppins-semibold'
            onClick={handleSubmit}
          >
            {formMode === "register" ? "Registrarse" : "Iniciar Sesión"}
          </Button>
        </Card>
      </div>
    </ConfigProvider>

    </>
  );
};

export default AuthForm;
