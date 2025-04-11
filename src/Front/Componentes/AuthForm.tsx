import React, { useState } from 'react';
import { Card, Input, Button, Radio, Typography, ConfigProvider, message } from "antd";
import React, { useState } from 'react';
import { Card, Input, Button, Radio, Typography, ConfigProvider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from 'axios';
import PUERTO from '../../config';

const { Title } = Typography;

const AuthForm: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
const AuthForm: React.FC<{ onLogin: (userData: any) => void }> = ({ onLogin }) => {
  const [formMode, setFormMode] = useState<"register" | "login">("register");
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
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
            {formMode === "register" ? "Correo Electrónico" : "Correo Electrónico"}
          </Title>

          <Input
            placeholder={formMode === "register" ? "Correo Electrónico" : "Correo Electrónico"}
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
