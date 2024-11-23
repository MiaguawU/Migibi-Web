import React, { useState } from "react";
import { Card, Input, Button, Radio, Typography, ConfigProvider } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AuthForm: React.FC = () => {
  const [formMode, setFormMode] = useState<"register" | "login">("register");

  // Cambiar entre "Registrarse" e "Iniciar sesión"
  const handleModeChange = (e: any) => {
    setFormMode(e.target.value);
  };

  return (
    <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#00b96b',
                    borderRadius: 10,
                    colorBorder: "#3E7E1E",

                    // Alias Token
                    colorBgContainer: '#E1EBCD',
                },
                components: {
                }
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
        
        {/* Controles de modo */}
        <Radio.Group
          onChange={handleModeChange}
          value={formMode}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <Radio.Button value="register" style={{
            minWidth: "100px", // Ancho mínimo
            maxWidth: "200px", // Ancho máximo
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",}}>Registrarse</Radio.Button>
          <Radio.Button value="login" style={{
            minWidth: "100px", // Ancho mínimo
            maxWidth: "200px", // Ancho máximo
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",}}>Iniciar Sesión</Radio.Button>
        </Radio.Group>

        {/* Título dinámico */}
        <Title level={4} style={{ textAlign: "center", color: "#669144" }}>
          {formMode === "register" ? "Registrarse" : "Iniciar Sesión"}
        </Title>


        {/* Formulario */}
        
        <Title level={3} style={{ textAlign: "center", color: "#6B8762", fontFamily: 'Jomhuria, sans-serif', fontWeight: 'lighter' }}>
          Nombre/Correo
        </Title>

        <Input
          placeholder={formMode === "register" ? "Nombre/Correo" : "Correo"}
          style={{
            marginBottom: "0px",
            borderRadius: "8px",
          }}
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
        />

        {/* Botón de Google (opcional) */}
        {formMode === "login" && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Button
              shape="circle"
              icon={<GoogleOutlined />}
              style={{ backgroundColor: "#E1EBCD", border: "1px solid #3E7E1E" }}
            />
            <div style={{ marginTop: "8px" }}>Iniciar sesión con Google</div>
          </div>
        )}

        {/* Botón principal */}
        <Button
          type="primary"
          block
          style={{
            borderRadius: "8px",
            backgroundColor: "#669144",
            borderColor: "#669144",
          }}
        >
          {formMode === "register" ? "Continuar" : "Iniciar Sesión"}
        </Button>
      </Card>
    </div>
    </ConfigProvider>
  );
};

export default AuthForm;
