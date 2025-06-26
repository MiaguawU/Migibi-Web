import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const TerminosCondiciones: React.FC = () => {
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
      {/* Título principal */}
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
          Términos y Condiciones de Uso
        </Title>
      </header>

      {/* Contenido principal */}
      <main style={{ padding: "0 80px" }}>
        <Paragraph style={{ fontSize: "18px", lineHeight: "1.8" }}>
          <strong>Fecha de última actualización: 21/11/2024</strong>
          <br />
          Bienvenido a Migibi Eats, una aplicación móvil desarrollada por
          Cincode para facilitar la gestión de alimentos y recetas. Al acceder
          y usar nuestra aplicación, aceptas los siguientes términos y
          condiciones. Por favor, léelos detenidamente antes de utilizar
          nuestros servicios.
        </Paragraph>

        {/* Sección 1 */}
        <Title level={2} style={{ ...titleStyle }}>1. Uso de la página</Title>
        <Paragraph style={textStyle}>
          <strong>1.1 Propósito:</strong> Migibi Eats está diseñada para
          registrar alimentos, gestionar recetas, planificar menús semanales y
          generar listas de compras.
          <br />
          <strong>1.2 Requisitos:</strong> Para utilizar la aplicación, debes
          contar con un dispositivo que cumpla los requisitos mínimos
          especificados, una conexión a internet estable y, en caso de ser
          necesario, una cuenta activa de Google.
          <br />
          <strong>1.3 Acceso y Registro:</strong>
          <ul>
            <li>El acceso requiere una cuenta de usuario, creada mediante registro con nombre y contraseña o mediante inicio de sesión con Google.</li>
            <li>Es responsabilidad del usuario mantener la confidencialidad de su cuenta y contraseña.</li>
          </ul>
        </Paragraph>

        {/* Sección 2 */}
        <Title level={2} style={titleStyle}>2. Responsabilidades del Usuario</Title>
        <Paragraph style={textStyle}>
          <strong>2.1</strong> Garantizas que los datos ingresados en la aplicación son precisos y actualizados.
          <br />
          <strong>2.2</strong> El uso de Migibi Eats es únicamente para fines personales o empresariales relacionados con la gestión de alimentos.
          <br />
          <strong>2.3</strong> Estás de acuerdo en no usar la aplicación para fines ilícitos, engañosos o malintencionados.
        </Paragraph>

        {/* Sección 3 */}
        <Title level={2} style={titleStyle}>3. Limitaciones de Responsabilidad</Title>
        <Paragraph style={textStyle}>
          <strong>3.1</strong> Migibi Eats no garantiza la disponibilidad ininterrumpida de sus servicios y no será responsable por interrupciones causadas por mantenimiento, actualizaciones o fallas técnicas.
          <br />
          <strong>3.2</strong> La aplicación no es responsable de la calidad, seguridad o precisión de los datos ingresados por los usuarios, como las fechas de caducidad de alimentos.
        </Paragraph>

        {/* Sección 4 */}
        <Title level={2} style={titleStyle}>4. Propiedad Intelectual</Title>
        <Paragraph style={textStyle}>
          <strong>4.1</strong> Todos los derechos, incluyendo el diseño, código y contenido de Migibi Eats, son propiedad de Cincode y están protegidos por las leyes de propiedad intelectual.
          <br />
          <strong>4.2</strong> El usuario no puede reproducir, modificar, distribuir ni explotar la aplicación sin autorización previa.
        </Paragraph>

        {/* Sección 5 */}
        <Title level={2} style={titleStyle}>5. Modificaciones</Title>
        <Paragraph style={textStyle}>
          Cincode se reserva el derecho de modificar los términos y condiciones en cualquier momento. Las modificaciones se notificarán a través de la aplicación o del correo electrónico registrado.
        </Paragraph>

        {/* Sección 6 */}
        <Title level={2} style={titleStyle}>6. Ley Aplicable y Jurisdicción</Title>
        <Paragraph style={textStyle}>
          Este acuerdo se rige por las leyes de México. Cualquier disputa será resuelta en los tribunales de la CDMX.
        </Paragraph>

        {/* Contacto */}
        <Paragraph style={textStyle}>
          Si tienes dudas o deseas ejercer tus derechos, puedes contactarnos en:<br />
          Correo electrónico: [cincode.official@gmail.com] <br />
          Teléfono: [52 1 55 2268 9442] <br />
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

export default TerminosCondiciones;