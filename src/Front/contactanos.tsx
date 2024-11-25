import React from "react";
import { Layout, Form, Input, Button, Row, Col, Typography } from "antd";
import {
  MailOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Submitted values:", values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#e0f5d9" }}>
      {/* Contenido principal */}
      <Content style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <div
            style={{
              border: "2px solid #3E7E1E",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#D3E2B4",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#6E9A65" }}>
              Contáctanos
            </h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ color: "#000" }}
            >
              <Form.Item
                label="Nombre(s)"
                name="nombre"
                rules={[
                  { required: true, message: "Por favor ingresa tu nombre" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Apellido paterno"
                name="apellidoPaterno"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu apellido paterno",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Apellido materno"
                name="apellidoMaterno"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu apellido materno",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Correo"
                name="correo"
                rules={[
                  { required: true, message: "Por favor ingresa tu correo" },
                  { type: "email", message: "Por favor ingresa un correo válido" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Asunto"
                name="asunto"
                rules={[
                  { required: true, message: "Por favor ingresa el asunto" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Descripción"
                name="descripcion"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la descripción",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    onClick={onReset}
                    style={{ backgroundColor: "#6E9A65" }}
                  >
                    Restablecer
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#6E9A65",
                      borderColor: "#66cc99",
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>

      {/* Pie de página */}
      <Footer style={{ backgroundColor: "#6E9A65", padding: "40px 200px" }}>
        <Row justify="center" gutter={[32, 32]}>
          {/* Sección Inicio */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Inicio
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Bienvenida</li>
              <li>Propósito</li>
              <li>Objetivos</li>
              <li>Misión</li>
              <li>Visión</li>
            </ul>
          </Col>

          {/* Sección Nosotros */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Nosotros
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Equipo</li>
              <li>Organigrama</li>
              <li>Valores</li>
              <li>Filosofía</li>
              <li>Políticas</li>
            </ul>
          </Col>

          {/* Sección Migibi */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Migibi
            </Title>
            <ul style={{ listStyle: "none", padding: 0, color: "#fff" }}>
              <li>Plan</li>
              <li>HOY</li>
            </ul>
          </Col>

          {/* Sección Contáctanos */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: "#fff" }}>
              Contáctanos
            </Title>
            <Text style={{ color: "#fff" }}>correo.ejemplo@gmail.com</Text>
            <div style={{ marginTop: "10px", fontSize: "20px" }}>
              <MailOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <InstagramOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <WhatsAppOutlined style={{ color: "#fff", marginRight: "10px" }} />
              <FacebookOutlined style={{ color: "#fff" }} />
            </div>
          </Col>
        </Row>

        {/* Sección de términos y condiciones */}
        <Row justify="center" style={{ marginTop: "30px" }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Términos y condiciones | Aviso de privacidad
          </Text>
        </Row>
      </Footer>
    </Layout>
  );
};

export default ContactPage;
