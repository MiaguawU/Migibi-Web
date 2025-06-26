import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; // Necesario para detectar el hash
import "antd/dist/reset.css";
import { Layout, Row, Col, Card } from "antd";
import imagefru from "../Img/imagefru.png";
import imageman from "../Img/imageman.png";
import imageplantapng from "../Img/imageplantapng.png";

const { Content, Footer } = Layout;

const Inicio: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // Espera ligera para asegurar carga
      }
    }
  }, [location]);

  return (
    <section className="raleway-forzado" style={{ padding: "50px", backgroundColor: "#F9FFF0" }}>

      {/* ¿Quiénes somos? */}
      <h1 style={{ fontSize: "64px", fontWeight: "bold", color: "#6B8762" }}>
        ¿Quiénes somos?
      </h1>
      <Row gutter={[16, 16]} align="middle">
  <Col xs={24} md={12}>
    <div
      style={{
        backgroundColor: "#f0f7e4",
        padding: "40px",
        borderRadius: "8px",
        color: "#244C24",
        fontFamily: "'Raleway', sans-serif",
        fontSize: "18px",
        lineHeight: "1.8",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.03)", // opcional para resaltar un poco
      }}
    >
      Migibi es un proyecto innovador desarrollado por Cincode, diseñado
      para revolucionar la gestión de alimentos perecederos. Con nuestro
      enfoque en tecnología y sostenibilidad, buscamos reducir el
      desperdicio de comida, optimizar el inventario y brindar
      herramientas prácticas tanto a negocios como a personas en su día a
      día.
    </div>
  </Col>
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

      <br />
      <br />
      <br />


     


      {/* Propósito, Misión y Visión (formato igual a Políticas) */}
<Row gutter={[16, 16]} justify="center">
  <Col xs={24} md={8}>
    <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>


      <h2 id="proposito" style={{ color: "#6B8762" }}>Propósito</h2>
      <p style={{ color: "#6B8762", lineHeight: "1.8" }}>
        Impulsar el uso consciente y responsable de los alimentos mediante tecnología
        que permita reducir el desperdicio y facilitar su gestión tanto en hogares como
        en negocios.
      </p>
    </Card>
  </Col>

  <Col xs={24} md={8}>
    <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>

      <h2 id="mision" style={{ color: "#6B8762" }}>Misión</h2>
      <p style={{ color: "#3E7E1E", lineHeight: "1.8" }}>
        Desarrollar soluciones digitales innovadoras que optimicen la manera en que
        personas y empresas gestionan sus alimentos, contribuyendo a un entorno
        sustentable y eficiente.
      </p>
    </Card>
  </Col>

  <Col xs={24} md={8}>
    <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>

      <h2 id="vision" style={{ color: "#6B8762" }}>Visión</h2>
      <p style={{ color: "#3E7E1E", lineHeight: "1.8" }}>
        Ser una plataforma líder a nivel global en gestión inteligente de alimentos,
        promoviendo hábitos responsables y sostenibles en la cadena alimentaria.
      </p>
    </Card>
  </Col>
</Row>

<br />
<br />
<br />






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

      <Row gutter={40} style={{ width: "100%" }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>

            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#3E7E1E" }}>Generales</h2>
              <ul style={{ color: "#3E7E1E" }}>
                <li>
                  Facilitar la administración de productos perecederos y evitar
                  el desperdicio de alimentos.
                </li>
                <li>
                  Ayudar a restaurantes, negocios y personas a planificar
                  compras, conocer la vida útil de sus productos y prever
                  fechas de caducidad.
                </li>
                <li>
                  Proveer una herramienta intuitiva para calcular con precisión
                  la cantidad de alimentos necesarios para preparar cualquier
                  receta.
                </li>
                <li>
                  Desarrollar software accesible y fácil de usar para gestionar
                  inventarios.
                </li>
                
                
              </ul>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>

            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#3E7E1E" }}>Particulares</h2>
              <ul style={{ color: "#3E7E1E" }}>
                <li>
                  Expandir nuestra presencia global identificando mercados
                  emergentes en el sector alimentario.
                </li>
                <li>
                  Capacitar a los usuarios en el uso eficiente y consciente de
                  los alimentos.
                </li>
                <li>
                  Promover la importancia de una gestión eficaz del inventario
                  y la reducción del desperdicio.
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      <br />
      <br />
      <br />
      <br />

      {/* Valores */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
  }}
>

            <h1
              id="valoresss"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#6B8762",
                textAlign: "left",
              }}
            >
              Valores
            </h1>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <img
                  src={imageman}
                  alt="Descripción de la imagen"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <ul
                  style={{
                    margin: "0",
                    paddingLeft: "20px",
                    color: "#3E7E1E",
                    fontSize: "1.5rem",
                    lineHeight: "1.8",
                    textAlign: "left",
                  }}
                >
                  <li>
                    Innovación: Buscamos soluciones tecnológicas que marquen la
                    diferencia.
                  </li>
                  <li>
                    Calidad: Ofrecemos productos y servicios confiables y de
                    alto estándar.
                  </li>
                  <li>
                    Compromiso: Estamos dedicados a cumplir nuestras promesas y
                    objetivos.
                  </li>
                  <li>
                    Responsabilidad: Actuamos con ética y priorizamos el
                    impacto positivo.
                  </li>
                  <li>
                    Colaboración: Fomentamos el trabajo en equipo con clientes y
                    socios.
                  </li>
                  <li>
                    Sostenibilidad: Creemos en cuidar el planeta al mismo tiempo
                    que ayudamos a nuestros clientes.
                  </li>
                </ul>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <br />
      <br />
      <br />
      <br />

      {/* Filosofía y Políticas */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={12}>
         <Card
  style={{
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
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
    fontFamily: "'Raleway', sans-serif", // ¡Esto es clave!
    borderRadius: "8px",
    backgroundColor: "#B3D86E",
    padding: "20px",
    height: "100%",
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

      <br />
      <br />
      <br />
      <br />

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
      






    </section>
  );
};

export default Inicio;
