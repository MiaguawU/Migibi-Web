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

const { Content, Footer } = Layout;

const { Title, Text } = Typography;

const Inicio: React.FC = () => {
  return (
        <section style={{ padding: "50px" }}>
          {/* ¿Quiénes somos? */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#6B8762",
            }}
          >
            ¿Quiénes somos?
          </h1>
          <Row gutter={[16, 16]} align="middle">
            {/* Columna para el texto */}
            <Col xs={24} md={12}>
              <p
                style={{
                  marginTop: "4px",
                  fontSize: "36px",
                  lineHeight: "1.5",
                  maxWidth: "570px",
                  textAlign: "left",
                }}
              >
                Migibi es un proyecto innovador desarrollado por Cincode,
                diseñado para revolucionar la gestión de alimentos
                perecederos. Con nuestro enfoque en tecnología y
                sostenibilidad, buscamos reducir el desperdicio de comida,
                optimizar el inventario y brindar herramientas prácticas tanto
                a negocios como a personas en su día a día.
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
                  borderRadius: "8px"
                }}
              />
            </Col>
          </Row>

          <br></br>
          <br></br>
          <br></br>

          {/* Nuestros Objetivos */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              margin: "20px 0",
              color: "#6B8762",
            }}
          >
            Nuestros Objetivos
          </h1>

          <div style={{ height: 'auto', display: 'flex', justifyContent: 'center', padding: '0', margin:'0'}}>
            <Row gutter= {40} style={{ width: '100%' }}>
            <Col xs={24} sm={24} md={12} lg={12} style={{ padding: '8px' }}>
            <Card style={{ backgroundColor: "#D3E2B4", display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, padding: '0' }}>
          <h2 style={{ color: "#3E7E1E" }}>Generales</h2>
          <ul style={{ color: "#3E7E1E" }}>
            <li>Facilitar la administración de productos perecederos
                y evitar el desperdicio de alimentos.</li>
            <li>Ayudar a restaurantes, negocios y personas a planificar
                compras, conocer la vida útil de sus productos y prever fechas de caducidad.</li>
            <li>Proveer una herramienta intuitiva para
                calcular con precisión la cantidad de alimentos necesarios para preparar cualquier receta.</li>
            <li>Desarrollar software accesible y fácil de usar para gestionar inventarios.</li>
            <li>Incorporar análisis de datos para optimizar la logística de distribución alimentaria.</li>
            <li>Llevar a Migibi al mercado internacional en un plazo de tres años.</li>
          </ul>
        </div>
      </Card>
    </Col>
    <Col xs={24} sm={24} md={12} lg={12} style={{ padding: '8px' }}>
      <Card style={{ backgroundColor: "#D3E2B4", display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, padding:'0'}}>
          <h2 style={{ color: "#3E7E1E" }}>Particulares</h2>
          <ul style={{ color: "#3E7E1E" }}>
            <li>Expandir nuestra presencia global identificando mercados emergentes en el sector alimentario.</li>
            <li>Capacitar a los usuarios en el uso eficiente y consciente de los alimentos.</li>
            <li>Promover la importancia de una gestión eficaz del inventario y la reducción del desperdicio.</li>
          </ul>
        </div>
      </Card>
    </Col>
  </Row>
</div>
<br></br>
<br></br>
<br></br>
<br></br>




          <Row gutter={[16, 16]}>
            <Col span={24}>
            <Card style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#D3E2B4", // Fondo claro
            padding: "20px", /*Espaciado interno*/}}
   >
     <h1
       style={{
         fontSize: "2rem",
         fontWeight: "bold",
         marginBottom: "16px", // Espaciado inferior
         color: "#6B8762", // Color del título
         textAlign: "left", // Alineado a la izquierda
       }}
     >
       Valores
     </h1>
     <Row gutter={[16, 16]}>
       {/* Columna para la imagen (izquierda) */}
       <Col xs={24} md={12}>
         <img
           src={imageman}  // Cambia esta URL por la imagen que desees
           alt="Descripción de la imagen"
           style={{
             width: "100%", // Ajusta el tamaño de la imagen
             borderRadius: "8px", // Bordes redondeados
             objectFit: "cover", // Para que la imagen se ajuste bien al espacio
           }}
         />
       </Col>


       {/* Columna para la lista (derecha) */}
       <Col xs={24} md={12}>
         <ul
           style={{
             margin: "0", // Quitar márgenes adicionales
             paddingLeft: "20px", // Ajustar sangría para las viñetas
             color: "#3E7E1E", // Color del texto
             fontSize: "1.5rem", // Tamaño de fuente
             lineHeight: "1.8", // Mejor legibilidad del texto
             textAlign: "left", // Alineación del texto
           }}
         >
           <li>Innovación: Buscamos soluciones tecnológicas que marquen la diferencia.</li>
           <li>Calidad: Ofrecemos productos y servicios confiables y de alto estándar.</li>
           <li>Compromiso: Estamos dedicados a cumplir nuestras promesas y objetivos.</li>
           <li>Responsabilidad: Actuamos con ética y priorizamos el impacto positivo.</li>
           <li>Colaboración: Fomentamos el trabajo en equipo con clientes y socios.</li>
           <li>Sostenibilidad: Creemos en cuidar el planeta al mismo tiempo
             que ayudamos a nuestros clientes.</li>
         </ul>
       </Col>
     </Row>
   </Card>
 </Col>
</Row>

<br></br>
<br></br>
<br></br>
<br></br>


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
                <h2 style={{ color: "#6B8762" }}>Filosofía</h2>
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
                <h2 style={{ color: "#6B8762" }}>Políticas</h2>
                <ul style={{ color: "#3E7E1E", lineHeight: "1.8" }}>
                  <li>Seguridad alimentaria.</li>
                  <li>Transparencia e integridad.</li>
                  <li>Cumplimiento normativo.</li>
                </ul>
              </Card>
            </Col>
          </Row>

<br></br>
<br></br>
<br></br>
<br></br>

          {/* Imagen final */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <img
                src={imageplantapng}
                alt="Planta"
                style={{
                  width: "317",
                  height: "317",
                  borderRadius: "8px",
                  objectFit: "cover",
                  textAlign: "left"
                }}
              />
            </Col>
          </Row>
        </section>
  );
};

export default Inicio;




  
