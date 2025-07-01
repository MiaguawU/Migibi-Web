import React from 'react';
import { Modal, Form, Input, Button, ConfigProvider, message } from 'antd';
import { customColors } from '../Estilos/colores';
import axios from "axios";
import PUERTO from "../../config";

const { TextArea } = Input;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  index: number;
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
  wrapperCol: { xs: { span: 24 }, sm: { span: 24 } },
};

const InsModal: React.FC<FormModalProps> = ({ visible, onClose, index, recetaId, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { name: string }) => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    message.warning("No hay un usuario logueado actualmente.");
    return;
  }

    const data = {
      orden: 0, // Se actualizará después con la respuesta
      instruccion: values.name,
      Id_Usuario_Alta: Number(currentUser),
    };

    try {
      const response = await axios.post(`${PUERTO}/proED/${recetaId}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success("Instrucción agregada correctamente.");
        form.resetFields();

        const nuevaInstruccion: Item = {
          id: response.data.id,
          name: values.name,
          isChecked: false,
          Activo: 1,
          orden: response.data.orden || index,
        };

        onSubmit(nuevaInstruccion);
        onClose();
      } else {
        message.error("Error al agregar la instrucción.");
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
          colorBorder: customColors.colorFuerteCalido,
          colorBgContainer: customColors.colorClaroCalido,
        },
        components: {
          Form: {
            labelFontSize: 16,
            labelRequiredMarkColor: "white",
          },
        },
      }}
    >
      <Modal title="Agregar Instrucción" open={visible} onCancel={onClose} footer={null}>
        <Form {...formItemLayout} form={form} style={{ maxWidth: 600 }} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Instrucción"
            rules={[{ required: true, message: "Por favor, introduce la instrucción" }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 }, offset: 0 }}>
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