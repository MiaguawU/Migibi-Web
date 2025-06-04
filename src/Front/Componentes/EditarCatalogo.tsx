import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, Select, ConfigProvider, message, Typography } from 'antd';
import { Catalogo } from '../Metodos/Enum';
import axios from "axios";
import PUERTO from "../../config";

const { Title } = Typography;
const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  catId: number;
  catalogo: Catalogo;
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

const EditCatalogo: React.FC<FormModalProps> = ({ visible, onClose, onSubmit, catId, catalogo }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    const payload = {
      id: catId,
      nombre: values.name,
      activo: values.activo,
      Id_Usuario_Alta: Number(currentUser),
    };

    try {
      const response = await axios.post(`${PUERTO}/ingED/${catId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success("Ingrediente agregado correctamente.");
        form.resetFields();
        onClose();
      } else {
        message.error("Error al agregar el ingrediente.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud.");
    }
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: '#3E7E1E',
          colorBgContainer: '#CAE2B5',
          colorText: '#758B63',
          colorPrimary: '#3E7E1E',
        },
      }}
    >
      <Modal
        title="Agregar Ingrediente"
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
          <Form.Item
            name="id"
            label="ID"
          > 
          <Title>{catId}</Title>
          </Form.Item>

          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor, introduce el nombre del ingrediente' }]}
          > <Input /> 
          </Form.Item>

          <Form.Item
            name="activo"
            label="Activo"
            rules={[
              { required: true, message: 'Por favor, introduce el estado' },
              { type: 'number', min: 0, max: 1000, message: 'Debe ser entre 0 y 1000' },
            ]}
          >
            <Select placeholder="Selecciona el estado">
                <Option key={1} value={0}>
                  Inactivo
                </Option>
                <Option key={2} value={1}>
                  Activo
                </Option>
            </Select>
          </Form.Item>

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

export default EditCatalogo;
