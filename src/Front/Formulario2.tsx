import React from "react";
import "./stylesCO.css"; // Asegúrate de que el archivo CSS esté en la misma carpeta

export default function Formulario2() {
  return (
    <div className="container">
      {/* Título */}
      <div className="section-title">
        <h1>Términos y Condiciones de Uso</h1>
      </div>

      {/* Fecha de última actualización */}
      <div className="section-date">
        <p>Fecha de última actualización: 21/11/2024</p>
      </div>

      {/* Introducción */}
      <div className="section-intro">
        <p>
          Bienvenido a Migibi Eats, una aplicación móvil desarrollada por Cincode para facilitar la gestión de alimentos y recetas.
          Al acceder y usar nuestra aplicación, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de utilizar nuestros servicios.
        </p>
      </div>

      {/* Sección 1 - Uso de la página */}
      <div className="section">
        <h2>1. Uso de la página</h2>
        <div className="subsection">
          <h3>1.1 Propósito:</h3>
          <p>
            Migibi Eats está diseñada para registrar alimentos, gestionar recetas, planificar menús semanales y generar listas de compras.
          </p>
        </div>
        <div className="subsection">
          <h3>1.2 Requisitos:</h3>
          <p>
            Para utilizar la aplicación, debes contar con un dispositivo que cumpla los requisitos mínimos especificados,
            una conexión a internet estable y, en caso de ser necesario, una cuenta activa de Google.
          </p>
        </div>
        <div className="subsection">
          <h3>1.3 Acceso y Registro:</h3>
          <ul>
            <li>
              El acceso requiere una cuenta de usuario, creada mediante registro con nombre y contraseña o mediante inicio de sesión con Google.
            </li>
            <li>
              Es responsabilidad del usuario mantener la confidencialidad de su cuenta y contraseña.
            </li>
          </ul>
        </div>
      </div>

      {/* Sección 2 - Responsabilidades del Usuario */}
      <div className="section">
        <h2>2. Responsabilidades del Usuario</h2>
        <p>2.1 Garantizas que los datos ingresados en la aplicación son precisos y actualizados.</p>
        <p>2.2 El uso de Migibi Eats es únicamente para fines personales o empresariales relacionados con la gestión de alimentos.</p>
        <p>2.3 Estás de acuerdo en no usar la aplicación para fines ilícitos, engañosos o malintencionados.</p>
      </div>

      {/* Sección 3 - Limitaciones de Responsabilidad */}
      <div className="section">
        <h2>3. Limitaciones de Responsabilidad</h2>
        <p>3.1 Migibi Eats no garantiza la disponibilidad ininterrumpida de sus servicios y no será responsable por interrupciones causadas por mantenimiento, actualizaciones o fallas técnicas.</p>
        <p>3.2 La aplicación no es responsable de la calidad, seguridad o precisión de los datos ingresados por los usuarios, como las fechas de caducidad de alimentos.</p>
      </div>

      {/* Sección 4 - Propiedad Intelectual */}
      <div className="section">
        <h2>4. Propiedad Intelectual</h2>
        <p>4.1 Todos los derechos, incluyendo el diseño, código y contenido de Migibi Eats, son propiedad de Cincode y están protegidos por las leyes de propiedad intelectual.</p>
        <p>4.2 El usuario no puede reproducir, modificar, distribuir ni explotar la aplicación sin autorización previa.</p>
      </div>

      {/* Sección 5 - Modificaciones */}
      <div className="section">
        <h2>5. Modificaciones</h2>
        <p>
          Cincode se reserva el derecho de modificar los términos y condiciones en cualquier momento. Las modificaciones se notificarán a través de la aplicación o del correo electrónico registrado.
        </p>
      </div>

      {/* Sección 6 - Ley Aplicable y Jurisdicción */}
      <div className="section">
        <h2>6. Ley Aplicable y Jurisdicción</h2>
        <p>
          Este acuerdo se rige por las leyes de México. Cualquier disputa será resuelta en los tribunales de la CDMX.
        </p>
      </div>

      {/* Contacto y agradecimientos */}
      <div className="section">
        <p>
          Si tienes dudas o deseas ejercer tus derechos, puedes contactarnos en:
          Correo electrónico: [Correo electrónico] Teléfono: [Número de contacto]
        </p>
        <p>
          Gracias por confiar en Migibi Eats y en nuestro compromiso con la sostenibilidad y eficiencia alimentaria.
        </p>
      </div>
    </div>
  );
}
