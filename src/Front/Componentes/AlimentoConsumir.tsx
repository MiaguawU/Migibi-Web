import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, Select, ConfigProvider, message, Typography } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import PUERTO from "../../config";
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  alimentoId: number | null;
}

interface Unidad {
  Id_Unidad_Medida: number;
  Unidad_Medida: string;
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

const AlimentoConsumir: React.FC<FormModalProps> = ({ visible, onClose, alimentoId }) => {
  const [form] = Form.useForm();
  const [Unidades, setUnidad] = useState<Unidad[]>([]); 
  const [cantidad, setCantidad] = useState(0);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (visible) {
      obtenerUnidad();
      if (alimentoId) {
        obtenerAlimento();
      } else {
        form.resetFields(); // Limpia el formulario si no hay alimentoId
      }
    }
  }, [visible, alimentoId]);

  const obtenerAlimento = async () => {
    if (!alimentoId) return;
    try {
      const response = await axios.get(`${PUERTO}/alUn/${alimentoId}`);
      const alimento = response.data;
  
      // Configurar valores del formulario
      form.setFieldsValue({
        quantity: alimento.Cantidad,
        unit: alimento.id_unidad,
      });
      setNombre(alimento.Nombre);
      setCantidad(alimento.Cantidad);
    } catch (error) {
      message.error("No se pudo cargar el alimento.");
    }
  };
  
  const obtenerUnidad = async () => {
    try {
      const response = await axios.get(`${PUERTO}/unidad`);
      setUnidad(response.data);
    } catch {
      message.error("No se pudieron cargar las unidades.");
    }
  };

  const handleSubmit = async (values: any) => {

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
  
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
    const user = usuarios[currentUser];
  
    if (!user) {
      message.warning("Usuario no encontrado en los datos locales.");
      return;
    }
    const payload = {
      id_stock: alimentoId? alimentoId : 0,
      id_unidad: values.unit,
      cantidad: values.quantity,
      Id_Usuario_Alta: currentUser
    };
    try {
      const response = await axios.put(`${PUERTO}/alimento/${alimentoId}`, payload, {
        headers: { 'Content-Type': "application/json" },
      });
      message.success('Producto actualizado');
    } catch (error: any)  {
          console.error("Error en la solicitud:", error);
    
        if (error.response) {
              if (error.response.data && error.response.data.error) {
                message.error(error.response.data.error); // Muestra el mensaje de error del backend
              } else {
                message.error(`Error: ${error.response.status} - ${error.response.statusText}`);
              }
            } else {
              message.error('Error de conexión con el servidor.');
            }
        }
  };
  

  const handleFinish = (values: any) => {
    handleSubmit(values);
    form.resetFields();
    onClose();

  };

  return (
    <ConfigProvider
      theme={{
        token: {
        colorBorder: '#3E7E1E',
        },
        components: {
          Form: {
            labelRequiredMarkColor: 'white',
          },
        },
      }}
    >
      <Modal
        title={"Consumir Producto"}
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
            name="name"
            label="Nombre"
          >
            <Title level={5}>{nombre}</Title>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Cantidad"
            rules={[
              { required: true, message: 'Por favor, introduce la cantidad' },
              { type: 'number', min: 0, max: 1000, message: `Debe ser entre 0 y ${cantidad}` },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Introduce la cantidad consumida."
              min={0}
              max={cantidad}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unidad"
            rules={[{ required: true, message: 'Por favor, selecciona una unidad' }]}
          >
            <Select placeholder="Selecciona una unidad">
              {Unidades.map((unidad) => (
                <Option key={unidad.Id_Unidad_Medida} value={unidad.Id_Unidad_Medida}>
                  {unidad.Unidad_Medida}
                </Option>
              ))}
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

export default AlimentoConsumir;
