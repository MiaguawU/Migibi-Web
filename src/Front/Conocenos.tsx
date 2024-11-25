import React from "react";
import { Layout, Row, Col, Card, Typography } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ObjectivesPage: React.FC = () => {
  return (
    <Layout style={{ backgroundColor: "#e0f5d9", minHeight: "100vh" }}>
      <Content style={{ padding: "20px" }}>
        <Title level={2} style={{ textAlign: "center", color: "#66cc99" }}>
          Nuestros objetivos
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {/* Primera fila: 2 columnas */}
          <Col xs={24} sm={24} md={12}>
            <Card
              style={{ backgroundColor: "#d9f5cc" }}
              bordered={false}
              bodyStyle={{ padding: "20px" }}
            >
              <Title level={4} style={{ color: "#66cc99" }}>
                Generales
              </Title>
              <Paragraph>
                - Facilitar la distribución de productos alimentarios y reducir el desperdicio
                de alimentos.
              </Paragraph>
              <Paragraph>
                - Apoyar a consumidores, negocios y personas en la gestión de sus recursos
                alimenticios de manera responsable y sostenible.
              </Paragraph>
              <Paragraph>
                - Incrementar la transparencia en los procesos de distribución alimentaria.
              </Paragraph>
              <Paragraph>
                - Promover una alimentación accesible y más equitativa para todos.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card
              style={{ backgroundColor: "#d9f5cc" }}
              bordered={false}
              bodyStyle={{ padding: "20px" }}
            >
              <Title level={4} style={{ color: "#66cc99" }}>
                Particularidades
              </Title>
              <Paragraph>
                - Expandir nuestro proceso global de distribución.
              </Paragraph>
              <Paragraph>
                - Reducir los costos económicos para el usuario.
              </Paragraph>
              <Paragraph>
                - Fomentar una mayor inclusión en el acceso a alimentos básicos.
              </Paragraph>
              <Paragraph>
                - Facilitar la adopción de prácticas sostenibles.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Segunda fila: Contenedor central */}
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "16px" }}>
          <Col xs={24} sm={24} md={16}>
            <Card
              style={{ backgroundColor: "#d9f5cc", textAlign: "center" }}
              bordered={false}
              bodyStyle={{ padding: "20px" }}
            >
              <Title level={4} style={{ color: "#66cc99" }}>
                Valores
              </Title>
              <img
                src="https://via.placeholder.com/400x200" // Reemplaza esta URL con tu imagen
                alt="Valores"
                style={{ maxWidth: "100%", margin: "16px 0", borderRadius: "8px" }}
              />
              <Paragraph>
                Innovación: Buscamos soluciones tecnológicas que permitan eficientar procesos.
              </Paragraph>
              <Paragraph>
                Confianza: Ofrecemos alimentos con la calidad que mereces.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Tercera fila: 2 columnas */}
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: "16px" }}>
          <Col xs={24} sm={24} md={12}>
            <Card
              style={{ backgroundColor: "#d9f5cc" }}
              bordered={false}
              bodyStyle={{ padding: "20px" }}
            >
              <Title level={4} style={{ color: "#66cc99" }}>
                Filosofía
              </Title>
              <Paragraph>
                Apostamos por el cuidado del medio ambiente, promoviendo el uso
                responsable de los recursos disponibles.
              </Paragraph>
              <Paragraph>
                Fomentamos la transparencia en cada paso del proceso.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card
              style={{ backgroundColor: "#d9f5cc" }}
              bordered={false}
              bodyStyle={{ padding: "20px" }}
            >
              <Title level={4} style={{ color: "#66cc99" }}>
                Políticas
              </Title>
              <Paragraph>
                Nuestro sistema garantiza alimentos de calidad mediante estrictas normas
                de seguridad.
              </Paragraph>
              <Paragraph>
                Apoyamos la sustentabilidad a través del uso eficiente de recursos.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ObjectivesPage;

  

