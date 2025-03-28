import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, Select, ConfigProvider, message } from 'antd';
import axios from "axios";
import PUERTO from "../../config";

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  recetaId: number;
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

const IngModal: React.FC<FormModalProps> = ({ visible, onClose, recetaId, onSubmit }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnidades = async () => {
    try {
      const response = await axios.get(`${PUERTO}/unidad`);
      setUnidades(response.data);
    } catch (error) {
      message.error("Error al obtener las unidades.");
    }
  };

  const fetchAlimentos = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        setLoading(false);
        return;
      }
  
      const userId = parseInt(currentUser, 10); // Asegurarse de convertir a número
      if (isNaN(userId)) {
        message.error("ID de usuario inválido.");
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`${PUERTO}/alimento`);

      const alimentosData = response.data;
      setAlimentos(alimentosData.Perecedero.concat(alimentosData.NoPerecedero));
    } catch (error) {
      message.error("Error al obtener los alimentos.");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchUnidades();
      fetchAlimentos();
    }
  }, [visible]);

  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
  
    const payload = {
      nombre: values.name,
      cantidad: values.quantity,
      id_unidad: values.unit,
      Id_Usuario_Alta: Number(currentUser),
    };
  
    try {
      const response = await axios.post(`${PUERTO}/ingED/${recetaId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        message.success("Ingrediente agregado correctamente.");
        form.resetFields();
  
        // Obtener el nuevo ingrediente desde la respuesta de la API
        const nuevoIngrediente = {
          id: response.data.id, // Asegúrate de que la API devuelva el ID
          name: values.name,
          cantidad: values.quantity,
          unidad: unidades.find((u) => u.Id_Unidad_Medida === values.unit)?.Unidad_Medida || "Unidad",
          isChecked: false,
          Activo: 1,
        };
  
        onSubmit(nuevoIngrediente); // Pasar el nuevo ingrediente
        onClose();
      } else {
        message.error("Error al agregar el ingrediente.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud.");
    }
  };
  

  const filteredOptions = alimentos
    .filter((alimento) =>
      alimento.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((alimento) => ({
      value: alimento.Nombre,
      label: alimento.Nombre,
    }));

  if (
    searchTerm &&
    !filteredOptions.some((option) => option.value === searchTerm)
  ) {
    filteredOptions.unshift({ value: searchTerm, label: `"${searchTerm}"` });
  }

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
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor, introduce el nombre del ingrediente' }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir ingrediente"
              options={filteredOptions}
              value={searchTerm}
              onSearch={setSearchTerm}
              onChange={setSearchTerm}
              filterOption={false}
              notFoundContent="Escribe un ingrediente nuevo"
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Cantidad"
            rules={[
              { required: true, message: 'Por favor, introduce la cantidad' },
              { type: 'number', min: 0, max: 1000, message: 'Debe ser entre 0 y 1000' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Introduce la cantidad"
              min={0}
              max={1000}
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
              {unidades.map((unidad) => (
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

export default IngModal;
