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
    <div style={{ minHeight: "100vh", backgroundColor: "#e0f5d9", paddingTop: "10px"}}>
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
              style={{ color: "#6B8762" }}
            >
              <Form.Item
                label="Nombre(s)"
                name="nombre"
                style={{ color: "#6B8762" }}
                rules={[
                  { required: true, message: "Por favor ingresa tu nombre" },
                  {
                    validator: (_, value) => {
                      const regexText = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
                      const regexXML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
        
                      if (!value) {
                        return Promise.reject("Este campo es obligatorio");
                      }
        
                      if (regexText.test(value) || regexXML.test(value)) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject(
                        "Solo se permiten letras y un máximo de 40 caracteres."
                      );
                    },
                  },
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
                  {
                    validator: (_, value) => {
                      const regexText = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
                      const regexXML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
        
                      if (!value) {
                        return Promise.reject("Este campo es obligatorio");
                      }
        
                      if (regexText.test(value) || regexXML.test(value)) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject(
                        "Solo se permiten letras y un máximo de 40 caracteres."
                      );
                    },
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
                  {
                    validator: (_, value) => {
                      const regexText = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
                      const regexXML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
        
                      if (!value) {
                        return Promise.reject("Este campo es obligatorio");
                      }
        
                      if (regexText.test(value) || regexXML.test(value)) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject(
                        "Solo se permiten letras y un máximo de 40 caracteres."
                      );
                    },
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
                  {
                    validator: (_, value) => {
                      const regexText = /^[A-Za-z\s.,;:!?¿"']{1,150}$/;
                      const regexXML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
        
                      if (!value) {
                        return Promise.reject("Este campo es obligatorio");
                      }
        
                      if (regexText.test(value) || regexXML.test(value)) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject(
                        `El texto debe tener entre 1 y 150 caracteres Símbolos permitidos: .,;:!?¿"`
                      );
                    },
                  },
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
                  {
                    validator: (_, value) => {
                      const regexText = /^[A-Za-z\s.,;:!?¿"']{1,500}$/;
                      const regexXML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/;
        
                      if (!value) {
                        return Promise.reject("Este campo es obligatorio");
                      }
        
                      if (regexText.test(value) || regexXML.test(value)) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject(
                        `El texto debe tener entre 1 y 500 caracteres Símbolos permitidos: .,;:!?¿"`
                      );
                    },
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
    </div>
  );
};

export default ContactPage;
