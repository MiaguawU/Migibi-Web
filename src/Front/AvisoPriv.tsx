import React from "react";
import { Layout, Typography } from "antd";
import "antd/dist/reset.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const AvisoPriv: React.FC = () => {
  return (
    <section
      style={{
        padding: "0",
        fontFamily: "'Raleway', sans-serif",
        backgroundColor: "#F9FFF0",
        color: "#244C24",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      {/* Título principal centrado */}
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "50px",
          paddingBottom: "30px",
        }}
      >
        <Title
          level={1}
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#6B8762",
            textAlign: "center",
            margin: 0,
          }}
        >
          Aviso de Privacidad
        </Title>
      </header>

      {/* Contenido expandido */}
      <main style={{ padding: "0 80px" }}>
        <Paragraph style={textStyle}>
          <strong>Fecha de última actualización: 21/11/2024</strong>
          <br />
          En Cincode, respetamos la privacidad de nuestros usuarios y estamos comprometidos a proteger sus datos personales. Este Aviso de Privacidad explica cómo recopilamos, usamos y protegemos tu información.
        </Paragraph>

        <Title level={2} style={titleStyle}>1. Información Recopilada</Title>

        <Paragraph style={textStyle}><strong>1.1 Datos Personales:</strong></Paragraph>
        <ul style={listStyle}>
          <li>Nombre y correo electrónico al registrarte.</li>
          <li>Información ingresada en la aplicación, como listas de alimentos, recetas y fechas de caducidad.</li>
        </ul>

        <Paragraph style={textStyle}><strong>1.2 Datos Técnicos:</strong></Paragraph>
        <ul style={listStyle}>
          <li>Información del dispositivo, sistema operativo y datos de uso de la aplicación.</li>
        </ul>

        <Title level={2} style={titleStyle}>2. Uso de la Información</Title>
        <Paragraph style={textStyle}>Utilizamos tus datos para:</Paragraph>
        <ul style={listStyle}>
          <li>Ofrecer y mejorar los servicios de la aplicación.</li>
          <li>Enviar notificaciones relacionadas con el uso de Migibi Eats.</li>
          <li>Personalizar la experiencia del usuario.</li>
        </ul>

        <Title level={2} style={titleStyle}>3. Protección de los Datos</Title>
        <ul style={listStyle}>
          <li>Implementamos medidas de seguridad avanzadas, incluyendo cifrado AES-256 y comunicaciones protegidas por TLS 1.2 o superior.</li>
          <li>Solo el personal autorizado tiene acceso a tus datos.</li>
        </ul>

        <Title level={2} style={titleStyle}>4. Compartir Información</Title>
        <Paragraph style={textStyle}>
          Cincode no vende ni comparte tu información personal con terceros, excepto en los siguientes casos:
        </Paragraph>
        <ul style={listStyle}>
          <li>Cuando sea requerido por ley.</li>
          <li>Para integrar servicios externos como Google Calendar (solo con tu consentimiento).</li>
        </ul>

        <Title level={2} style={titleStyle}>5. Derechos del Usuario</Title>
        <ul style={listStyle}>
          <li>5.1 Tienes derecho a acceder, modificar o eliminar tu información personal almacenada en la aplicación.</li>
          <li>5.2 Puedes retirar tu consentimiento para el uso de tus datos en cualquier momento, aunque esto podría limitar algunas funcionalidades de la aplicación.</li>
        </ul>

        <Title level={2} style={titleStyle}>6. Cambios al Aviso de Privacidad</Title>
        <Paragraph style={textStyle}>
          Podemos actualizar este Aviso de Privacidad para reflejar cambios en nuestras prácticas o en la legislación aplicable. Se notificará a los usuarios sobre cualquier cambio relevante.
        </Paragraph>

        <Paragraph style={textStyle}>
          Si tienes dudas o deseas ejercer tus derechos, puedes contactarnos en:
          <br />
          Correo electrónico: <strong>cincode.official@gmail.com</strong>
          <br />
          Teléfono: <strong>[52 1 55 2268 9442]</strong>
          <br />
          <br />
          Gracias por confiar en Migibi Eats y en nuestro compromiso con la sostenibilidad y eficiencia alimentaria.
        </Paragraph>
      </main>
    </section>
  );
};

// Estilos reutilizables
const titleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#6B8762",
  textAlign: "left" as const,
  margin: "40px 0 10px 0",
};

const textStyle = {
  fontSize: "18px",
  lineHeight: "1.8",
};

const listStyle = {
  color: "#3E7E1E",
  fontSize: "16px",
  paddingLeft: "20px",
};

export default AvisoPriv;
