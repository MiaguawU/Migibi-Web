import React, { useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, ConfigProvider, message } from 'antd';
import axios from "axios";
import PUERTO from "../../config";

const { TextArea } = Input;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  recetaId: number;
  onSubmit: (newInstruction: Item) => void;
}

interface Item {
  id: number;
  name: string;
  isChecked: boolean;
  Activo: number;
  orden: number;
}

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

const InsModal: React.FC<FormModalProps> = ({ visible, onClose, recetaId, onSubmit }) => {
  const [form] = Form.useForm();


  // Maneja el envío del formulario
  const handleSubmit = async (values: { instruccion: string }) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
  
    // Transformar datos para que coincidan con el esquema del backend
    const data = {
      orden: 0, // Se actualizará después con la respuesta
      instruccion: values.instruccion,
      Id_Usuario_Alta: Number(currentUser),
    };
  
    try {
      const response = await axios.post(`${PUERTO}/proED/${recetaId}`, data, {
        headers: { "Content-Type": "application/json" }, // Enviar JSON
      });
      
      if (response.status === 200) {
        message.success("Instrucción agregada correctamente.");
        form.resetFields();

        const nuevaInstruccion: Item = {
          id: response.data.id,
          name: values.instruccion,
          isChecked: false,
          Activo: 1,
          orden: response.data.orden || 1,
        };

        onSubmit(nuevaInstruccion);
        onClose();
      } else {
        message.error("Error al agregar el ingrediente.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud. Intenta de nuevo.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: "#3E7E1E",
          colorBgContainer: "#CAE2B5",
          colorText: "#3E7E1E",
          colorPrimary: "#3E7E1E",
        },
        components: {
          Form: {
            labelFontSize: 22,
            labelRequiredMarkColor: "white",
          },
        },
      }}
    >
          {/* Input de instrucción */}
      <Modal
        title="Agregar Instrucción"
        open={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form {...formItemLayout} form={form} style={{ maxWidth: 600 }} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Instrucción"
            rules={[{ required: true, message: "Por favor, introduce la instrucción" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          {/* Botón de enviar */}
          <Form.Item
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 24 },
              offset: 0,
            }}
          >
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default InsModal;