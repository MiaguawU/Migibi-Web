import React from "react";
import { Link } from "react-router-dom";
import Mail from "./Mail"; 
import WhatsAppIcon from "./WhatsAppIcon";



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
      <Footer style={{ backgroundColor: "#9ED340", padding: "40px 200px" }}>
        <Row justify="center" gutter={[32, 32]}>
          {/* Sección Inicio */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#black" }}>
              Inicio
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "black" }}>
  <li><a href="/" style={{ color: "black" }}>Bienvenida</a></li>
  <li><a href="/conocenos#proposito" style={{ color: "black" }}>Propósito</a></li>
  <li><a href="/conocenos#mision" style={{ color: "black" }}>Misión</a></li>
  <li><a href="/conocenos#vision" style={{ color: "black" }}>Visión</a></li>
  

  
            </ul>
          </Col>

          {/* Sección Nosotros */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>
              Nosotros
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "black" }}>
  <li><a href="/conocenos#valoresss" style={{ color: "black" }}>Valores</a></li>
  <li><a href="/conocenos#filosofiaaa" style={{ color: "black" }}>Filosofía</a></li>
  <li><a href="/conocenos#politicasss" style={{ color: "black" }}>Políticas</a></li>

</ul>


          </Col>

          {/* Sección Migibi */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>
              Migibi
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "black" }}>
            <li><Link to="/hoy" style={{ color: "black" }}>Plan de hoy</Link></li>
<li><Link to="/plan" style={{ color: "black" }}>Plan semanal</Link></li>
            </ul>
          </Col>

          {/* Sección Contáctanos */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "black" }}>
              Contáctanos
            </Title>
            <Text style={{ color: "black" }}>cincode.official@gmail.com</Text>
            <div style={{ marginTop: "10px", fontSize: "20px" }}>
              <Mail />

              <a
    href="https://www.instagram.com/cincode_official/?utm_source=ig_web_button_share_sheet"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "black", marginRight: "10px" }}
  >
    <InstagramOutlined />
  </a>
              <WhatsAppIcon />
              <a
    href="https://www.facebook.com/profile.php?id=61560896874235&locale=es_LA"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "black" }}
  >
    <FacebookOutlined />
  </a>
            </div>
          </Col>
        </Row>

        {/* Sección de términos y condiciones */}
        <Row justify="center" style={{ marginTop: "30px" }}>
          <Text style={{ color: "black", textAlign: "center" }}>
  <Link to="/terminos" style={{ color: "black" }}>Términos y condiciones</Link> |{" "}
  <Link to="/aviso" style={{ color: "black" }}>Aviso de privacidad</Link>

</Text>


        </Row>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
