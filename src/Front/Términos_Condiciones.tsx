import React from "react";
import "antd/dist/reset.css"; // Importa los estilos de Ant Design
import { Layout, Row, Col, Card, Typography } from "antd";
import {
  MailOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import imagefru from "../Img/imagefru.png";
import imageman from "../Img/imageman.png";
import imageplantapng from "../Img/imageplantapng.png";
import imgorganigrama from "../Img/imgorganigrama.png";




const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Inicio: React.FC = () => {
  return (
    <section style={{ padding: "50px" }}>
      {/* Términos y Condiciones de Uso */}
      <h1
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#6B8762",
        }}
      >
        Términos y Condiciones de Uso
      </h1>
      <Row gutter={[16, 16]} align="middle">
        {/* Columna para el texto */}
        <Col xs={24} md={12}>
          <p
            style={{
              marginTop: "4px",
              fontSize: "24px",
              lineHeight: "1.5",
              maxWidth: "570px",
              textAlign: "left",
            }}
          >
            <strong>Fecha de última actualización: 21/11/2024</strong>
            <br />
            Bienvenido a Migibi Eats, una aplicación móvil desarrollada por
            Cincode para facilitar la gestión de alimentos y recetas. Al acceder
            y usar nuestra aplicación, aceptas los siguientes términos y
            condiciones. Por favor, léelos detenidamente antes de utilizar
            nuestros servicios.
          </p>
        </Col>
        {/* Columna para la imagen */}
        <Col xs={24} md={12}>
          <img
            src={imagefru}
            alt="Frutas"
            style={{
              width: "550px",
              height: "364px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Col>
      </Row>

      <br /><br /><br />

      {/* Uso de la página */}
      <h1
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          margin: "20px 0",
          color: "#6B8762",
        }}
      >
        1. Uso de la página
      </h1>

      <div
        style={{
          height: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "0",
          margin: "0",
        }}
      >
        <Row gutter={40} style={{ width: "100%" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ padding: "8px" }}
          >
            <Card
              style={{
                backgroundColor: "#D3E2B4",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flex: 1, padding: "0" }}>
                <h2 style={{ color: "#3E7E1E" }}>1.1 Propósito:</h2>
                <p style={{ color: "#3E7E1E" }}>
                  Migibi Eats está diseñada para registrar alimentos, gestionar
                  recetas, planificar menús semanales y generar listas de
                  compras.
                </p>

                <h2 style={{ color: "#3E7E1E" }}>1.2 Requisitos:</h2>
                <p style={{ color: "#3E7E1E" }}>
                  Para utilizar la aplicación, debes contar con un dispositivo
                  que cumpla los requisitos mínimos especificados, una conexión
                  a internet estable y, en caso de ser necesario, una cuenta
                  activa de Google.
                </p>

                <h2 style={{ color: "#3E7E1E" }}>1.3 Acceso y Registro:</h2>
                <p style={{ color: "#3E7E1E" }}>
                  • El acceso requiere una cuenta de usuario, creada mediante
                  registro con nombre y contraseña o mediante el inicio de
                  sesión con Google.
                  <br />• Es responsabilidad del usuario mantener la
                  confidencialidad de su cuenta y contraseña.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <br /><br /><br /><br />

      {/* Filosofía y Políticas */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: "8px",
              backgroundColor: "#D3E2B4",
              padding: "20px",
            }}
          >
            <h2 id="filosofiaaa" style={{ color: "#6B8762" }}>
              Filosofía
            </h2>
            <p style={{ color: "#3E7E1E", lineHeight: "1.8" }}>
              En Migibi, creemos en el poder transformador de la tecnología.
              Nuestra misión es mejorar la gestión de recursos alimentarios,
              promoviendo la eficiencia y un futuro más sostenible.
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: "8px",
              backgroundColor: "#D3E2B4",
              padding: "20px",
            }}
          >
            <h2 id="politicasss" style={{ color: "#6B8762" }}>
              Políticas
            </h2>
            <ul style={{ color: "#3E7E1E", lineHeight: "1.8" }}>
              <li>Seguridad alimentaria.</li>
              <li>Transparencia e integridad.</li>
              <li>Cumplimiento normativo.</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <br /><br /><br /><br />

      {/* Imagen final */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <img
            src={imageplantapng}
            alt="Planta"
            style={{
              width: "317px",
              height: "317px",
              borderRadius: "8px",
              objectFit: "cover",
              textAlign: "left",
            }}
          />
        </Col>
      </Row>

{/* Imagen de Organigrama */}
<Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
  <Col xs={24}>
    <h2 style={{ color: "#6B8762" }}>Organigrama</h2>
    <img
      src="/organigrama2025.png"
      alt="Organigrama"
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "auto",
        borderRadius: "8px",
        display: "block",
        margin: "0 auto",
      }}
    />
  </Col>
</Row>

    </section>
  );
};

export default Inicio;
