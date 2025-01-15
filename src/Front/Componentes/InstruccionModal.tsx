import React, { useState } from 'react';
import { Modal, Form, Input, Button, InputNumber, ConfigProvider, message } from 'antd';
import axios from "axios";
import PUERTO from "../../config";

const { TextArea } = Input;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  recetaId: number;
  onSubmit?: boolean;
}

interface Item {
  name: string;
  orden: number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const InsModal: React.FC<FormModalProps> = ({ visible, onClose, recetaId, onSubmit }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [tempAdded, setTempAdded] = useState<Item[]>([]);

  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
  
    // Transformar datos para que coincidan con el esquema del backend
    const data = {
      orden: values.order, // Cambiar clave a "orden"
      instruccion: values.name, // Cambiar clave a "instruccion"
      Id_Usuario_Alta: Number(currentUser), // Asegurar que sea un número
    };
  
    try {
      const response = await axios.post(`${PUERTO}/proED/${recetaId}`, data, {
        headers: { "Content-Type": "application/json" }, // Enviar JSON
      });
      if (response.status === 200) {
        message.success("Instrucción agregada correctamente.");
        form.resetFields();
        onClose();
      } else {
        message.error("Error al agregar la instrucción. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud. Intenta de nuevo.");
    }
  };

  const handleAddInstruction = (newInstruction: Item) => {
    setTempAdded((prev) => [...prev, newInstruction]);
    setItems((prev) => [...prev, newInstruction]);
  };
  

  const handleFinish = (values: any) => {
    handleSubmit(values);
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
      <Modal
        title="Agregar Instrucción"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={handleFinish}
        >
          {/* Input de cantidad */}
          <Form.Item
            name="order"
            label="Orden"
            rules={[
              { required: true, message: "Por favor, introduce la cantidad" },
              { type: "number", min: 1, max: 1000, message: "Debe ser entre 1 y 1000" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Introduce la cantidad"
              min={1}
              max={1000}
              step={1}
              precision={0}
            />
          </Form.Item>
          {/* Input de nombre */}
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