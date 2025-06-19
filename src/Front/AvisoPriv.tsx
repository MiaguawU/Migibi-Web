import React from "react";
import { Layout, Typography } from "antd";
import imageplantapng from "../Img/imageplantapng.png";
import "antd/dist/reset.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const AvisoPriv: React.FC = () => {
  return (
    <section style={{ padding: "50px" }}>
      <Title
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#6B8762",
          textAlign: "center",
        }}
      >
        Aviso de Privacidad
      </Title>

      <Text strong style={{ fontSize: "16px", color: "#3E7E1E" }}>
        Fecha de última actualización: 21/11/2024
      </Text>

      <p style={{ fontSize: "18px", color: "#3E7E1E", marginTop: "20px" }}>
        En Cincode, respetamos la privacidad de nuestros usuarios y estamos
        comprometidos a proteger sus datos personales. Este Aviso de Privacidad
        explica cómo recopilamos, usamos y protegemos tu información.
      </p>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        1. Información Recopilada
      </Title>

      <Text strong style={{ fontSize: "16px", color: "#3E7E1E" }}>
        1.1 Datos Personales:
      </Text>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>Nombre y correo electrónico al registrarte.</li>
        <li>
          Información ingresada en la aplicación, como listas de alimentos,
          recetas y fechas de caducidad.
        </li>
      </ul>

      <Text strong style={{ fontSize: "16px", color: "#3E7E1E" }}>
        1.2 Datos Técnicos:
      </Text>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>
          Información del dispositivo, sistema operativo y datos de uso de la
          aplicación.
        </li>
      </ul>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        2. Uso de la Información
      </Title>
      <p style={{ color: "#3E7E1E", fontSize: "16px" }}>
        Utilizamos tus datos para:
      </p>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>Ofrecer y mejorar los servicios de la aplicación.</li>
        <li>Enviar notificaciones relacionadas con el uso de Migibi Eats.</li>
        <li>Personalizar la experiencia del usuario.</li>
      </ul>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        3. Protección de los Datos
      </Title>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>
          Implementamos medidas de seguridad avanzadas, incluyendo cifrado
          AES-256 y comunicaciones protegidas por TLS 1.2 o superior.
        </li>
        <li>Solo el personal autorizado tiene acceso a tus datos.</li>
      </ul>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        4. Compartir Información
      </Title>
      <p style={{ color: "#3E7E1E", fontSize: "16px" }}>
        Cincode no vende ni comparte tu información personal con terceros,
        excepto en los siguientes casos:
      </p>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>Cuando sea requerido por ley.</li>
        <li>
          Para integrar servicios externos como Google Calendar (solo con tu
          consentimiento).
        </li>
      </ul>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        5. Derechos del Usuario
      </Title>
      <ul style={{ color: "#3E7E1E", fontSize: "16px" }}>
        <li>
          5.1 Tienes derecho a acceder, modificar o eliminar tu información
          personal almacenada en la aplicación.
        </li>
        <li>
          5.2 Puedes retirar tu consentimiento para el uso de tus datos en
          cualquier momento, aunque esto podría limitar algunas funcionalidades
          de la aplicación.
        </li>
      </ul>

      <br />

      <Title level={2} style={{ color: "#6B8762" }}>
        6. Cambios al Aviso de Privacidad
      </Title>
      <p style={{ color: "#3E7E1E", fontSize: "16px" }}>
        Podemos actualizar este Aviso de Privacidad para reflejar cambios en
        nuestras prácticas o en la legislación aplicable. Se notificará a los
        usuarios sobre cualquier cambio relevante.
      </p>

      <br />

      <Text style={{ color: "#3E7E1E", fontSize: "16px" }}>
        Si tienes dudas o deseas ejercer tus derechos, puedes contactarnos
        en:<br />
        Correo electrónico: cincode.official@gmail.com<br />
        Teléfono: [Número de contacto]
        <br />
        Gracias por confiar en Migibi Eats y en nuestro compromiso con la
        sostenibilidad y eficiencia alimentaria.
      </Text>

      <br />
      <br />
    </section>
  );
};

export default AvisoPriv;
