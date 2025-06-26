import React from "react";
import { Link } from "react-router-dom";
import Mail from "./Mail";
import WhatsAppIcon from "./WhatsAppIcon";
import { Layout, Row, Col, Typography } from "antd";
import {
  MailOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const footerStyle = {
    container: {
      backgroundColor: "#6E9A65",
      padding: "40px 200px",
    } as React.CSSProperties,
  };

  const linkStyle: React.CSSProperties = {
    color: "black",
    textDecoration: "none",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Contenido principal */}
      <Content style={{ minHeight: "100vh", width: "100%" }}>{children}</Content>

      {/* Pie de página */}
      <Footer style={{ backgroundColor: "#9ED340", padding: "40px 200px" }}>
        <Row justify="center" gutter={[32, 32]}>
          {/* Inicio */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>Inicio</Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link to="/" style={linkStyle}>Bienvenida</Link></li>
              <li><Link to="/conocenos#proposito" style={linkStyle}>Propósito</Link></li>
              <li><Link to="/conocenos#mision" style={linkStyle}>Misión</Link></li>
              <li><Link to="/conocenos#vision" style={linkStyle}>Visión</Link></li>
            </ul>
          </Col>

          {/* Nosotros */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>Nosotros</Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link to="/conocenos#valoresss" style={linkStyle}>Valores</Link></li>
              <li><Link to="/conocenos#filosofiaaa" style={linkStyle}>Filosofía</Link></li>
              <li><Link to="/conocenos#politicasss" style={linkStyle}>Políticas</Link></li>
            </ul>
          </Col>

          {/* Migibi */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>Migibi</Title>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link to="/hoy" style={linkStyle}>Plan de hoy</Link></li>
              <li><Link to="/plan" style={linkStyle}>Plan semanal</Link></li>
              <li><Link to="/recetas" style={linkStyle}>Recetas</Link></li>
              <li><Link to="/refri" style={linkStyle}>Refri</Link></li>
              <li><Link to="/perfil" style={linkStyle}>Perfil</Link></li>
            </ul>
          </Col>

          {/* Contáctanos */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>Contáctanos</Title>
            <Text style={{ color: "black" }}>cincode.official@gmail.com</Text>
            <div style={{ marginTop: "10px", fontSize: "20px" }}>
              <Mail />
              <a
                href="https://www.instagram.com/cincode_official/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, marginRight: "10px" }}
              >
                <InstagramOutlined />
              </a>
              <WhatsAppIcon />
              <a
                href="https://www.facebook.com/profile.php?id=61560896874235"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                <FacebookOutlined />
              </a>
            </div>
          </Col>
        </Row>

        {/* Términos */}
        <Row justify="center" style={{ marginTop: "30px" }}>
          <Text style={{ color: "black", textAlign: "center" }}>
            <Link to="/terminos" style={linkStyle}>Términos y condiciones</Link> |{" "}
            <Link to="/aviso" style={linkStyle}>Aviso de privacidad</Link>
          </Text>
        </Row>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
