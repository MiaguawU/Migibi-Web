import React from "react";
import { Layout , Row, Col, Typography } from "antd";
import {
  MailOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const footerStyle = {
    container: {
      backgroundColor: "#6E9A65",
      padding: "40px 200px",
      "@media (max-width: 768px)": {
        padding: "20px 100px", // Cambia el color en pantallas pequeñas
      },
      "@media (max-width: 600px)": {
        padding: "20px 50px", // Cambia el color en pantallas pequeñas
      },
    } as React.CSSProperties, // Necesario para TypeScript
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Encabezado */}

      {/* Contenido */}
      <Content style={{ minHeight: '100vh', width: '100%'}}>
        {children}
      </Content>

      {/* Pie de página */}
      <Footer style={{ backgroundColor: "#6E9A65", padding: "40px 200px" }}>
        <Row justify="center" gutter={[32, 32]}>
          {/* Sección Inicio */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Inicio
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Bienvenida</li>
              <li>Propósito</li>
              <li>Objetivos</li>
              <li>Misión</li>
              <li>Visión</li>
            </ul>
          </Col>

          {/* Sección Nosotros */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Nosotros
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Equipo</li>
              <li>Organigrama</li>
              <li>Valores</li>
              <li>Filosofía</li>
              <li>Políticas</li>
            </ul>
          </Col>

          {/* Sección Migibi */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Migibi
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Plan</li>
              <li>Hoy</li>
            </ul>
          </Col>

          {/* Sección Contáctanos */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Contáctanos
            </Title>
            <Text style={{ color: "#fff" }}>correo.ejemplo@gmail.com</Text>
            <div style={{ marginTop: "10px", fontSize: "20px" }}>
              <MailOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <InstagramOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <WhatsAppOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <FacebookOutlined style={{ color: "#fff" }} />
            </div>
          </Col>
        </Row>

        {/* Sección de términos y condiciones */}
        <Row justify="center" style={{ marginTop: "30px" }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Términos y condiciones | Aviso de privacidad
          </Text>
        </Row>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
