import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, Select, ConfigProvider, message } from 'antd';
import axios from "axios";
import PUERTO from "../../config";

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  planId: number;
  comida: string;
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

const PlanEditar: React.FC<FormModalProps> = ({ visible, onClose, planId, comida, onSubmit }) => {
  const [form] = Form.useForm();
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [recetas, setRecetas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Para la búsqueda
  const [selectedValue, setSelectedValue] = useState<number | null>(null); // Para el valor seleccionado


  const fetchRecetas = async () => {
    try {
      const response = await axios.get(`${PUERTO}/recetaGeneral/nombres`);
      const recetasData = response.data;
      setRecetas(recetasData);
    } catch (error) {
      message.error("Error al obtener las recetas.");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRecetas();
    }
  }, [visible]);

  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    const payload = {
        Id_Recetas_Dia: planId,
      id_receta: values.name,
      Id_Usuario_Alta: Number(currentUser)
    };

    try {
      const response = await axios.put(`${PUERTO}/editar${comida}/${planId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success("Receta editada correctamente.");
        form.resetFields();
        onSubmit();
        onClose();
      } else {
        message.error("Error al editar la receta.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud.");
    }
  };

  const filteredOptions = recetas
  .filter((receta) =>
    receta.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((receta) => ({
    value: receta.Id_Receta,
    label: receta.Nombre,
  }));

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
        title="Editar receta"
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
            rules={[{ required: true, message: 'Por favor, introduce el nombre de la receta' }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir receta"
              options={filteredOptions}
              value={selectedValue}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(value) => {
                setSelectedValue(value); // Actualizar el valor seleccionado
                const recetaSeleccionada = recetas.find(
                  (receta) => receta.Id_Receta === value
                );
                if (recetaSeleccionada) {
                  setSearchTerm(recetaSeleccionada.Nombre); // Actualizar el término de búsqueda para que refleje el nombre
                }
              }}
              filterOption={false}
            />
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

export default PlanEditar;
