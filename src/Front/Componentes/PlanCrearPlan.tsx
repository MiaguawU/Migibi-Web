import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Button, Select, ConfigProvider, message, Flex, Card, Typography } from 'antd';
import { Modo, Plan } from '../Metodos/Enum';
import { StarOutlined } from '@ant-design/icons';
import axios from "axios";
import PUERTO from "../../config";

const { Option } = Select;
const { Title, Text } = Typography;

interface Dia {
  Id_Desayuno: number;
  Desayuno: string;
  Id_Comer: number;
  Comer: string;
  Id_Cena: number;
  Cena: string;
}

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
}

interface FormModalProps {
  visible: boolean;
  ModoSelected: Modo;
  PlanSelected: Plan;
  onClose: () => void;
  onSubmit: () => void;
}

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PlanCrearPlan: React.FC<FormModalProps> = ({ visible, ModoSelected, PlanSelected, onClose, onSubmit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [recetas, setRecetas] = useState<any[]>([]);
  const [Tipos, setTipos] = useState<Tipo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [idUsuario, setIdUSuario] = useState(0);
  const [tipoConsumo, setTipoConsumo] = useState<string>("");
  const [dias, setDias] = useState<Dia[]>([
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
  ]);

  const filteredOptions = recetas
    .filter((receta) => receta.Nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((receta) => ({
      value: receta.Id_Receta,
      label: receta.Nombre,
    }));

  const handleFinish = (values: any) => {
    handleSubmit(values);
    form.resetFields();
  };

  const handleEditFinish = (values: any) => {
    if (currentDayIndex !== null) {
      const updatedDias = [...dias];
      const selectedDesayuno = recetas.find(r => r.Id_Receta === values.desayuno);
      const selectedComida = recetas.find(r => r.Id_Receta === values.comida);
      const selectedCena = recetas.find(r => r.Id_Receta === values.cena);

      updatedDias[currentDayIndex] = {
        Id_Desayuno: values.desayuno || updatedDias[currentDayIndex].Id_Desayuno,
        Desayuno: selectedDesayuno?.Nombre || updatedDias[currentDayIndex].Desayuno,
        Id_Comer: values.comida || updatedDias[currentDayIndex].Id_Comer,
        Comer: selectedComida?.Nombre || updatedDias[currentDayIndex].Comer,
        Id_Cena: values.cena || updatedDias[currentDayIndex].Id_Cena,
        Cena: selectedCena?.Nombre || updatedDias[currentDayIndex].Cena,
      };

      setDias(updatedDias);
      message.success('Día actualizado localmente');
      setEditModalVisible(false);
      editForm.resetFields();
    }
  };

  const fetchRecetas = async () => {
    try {
      const response = await axios.get(`${PUERTO}/recetaGeneral/nombres`);
      setRecetas(response.data);
    } catch (error) {
      message.error("Error al obtener las recetas.");
    }
  };

  const obtenerTipos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/tipoC`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data) {
        setTipos(response.data);
      } else {
        message.error("No hay datos en los tipos");
      }
    } catch (error) {
      console.error("Error al cargar tipos:", error);
      message.error("No se pudo cargar los tipos.");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRecetas();
      obtenerTipos();
    }
  }, [visible]);

  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    setIdUSuario(Number(currentUser));
    validarPlan(values);
  };

  const handleFinalSave = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    setIdUSuario(Number(currentUser));

    try {
      // Create or validate plan
      const payload = {
        Id_Usuario_Alta: idUsuario,
        Fecha: new Date().toISOString().split('T')[0]
      };

      const planResponse = await axios.post(`${PUERTO}/planGeneral/agregarPlan/${idUsuario}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (planResponse.data && planResponse.data.length > 0) {
        // Update all modified meals
        for (let i = 0; i < dias.length; i++) {
          const dia = dias[i];
          const planId = planResponse.data[0][`Id_Recetas_Dia`];

          // Check and update each meal type
          if (dia.Id_Desayuno) {
            if (planResponse.data[0][`Id_Receta_Desayuno`] === null) {
              await EditarReceta('Desayuno', planId, dia.Id_Desayuno);
            } else {
              await confirmarAccion('Desayuno', planId, dia.Id_Desayuno);
            }
          }
          if (dia.Id_Comer) {
            if (planResponse.data[0][`Id_Receta_Comida`] === null) {
              await EditarReceta('Comida', planId, dia.Id_Comer);
            } else {
              await confirmarAccion('Comida', planId, dia.Id_Comer);
            }
          }
          if (dia.Id_Cena) {
            if (planResponse.data[0][`Id_Receta_Cena`] === null) {
              await EditarReceta('Cena', planId, dia.Id_Cena);
            } else {
              await confirmarAccion('Cena', planId, dia.Id_Cena);
            }
          }
        }

        message.success("Plan guardado correctamente.");
        onSubmit();
        onClose();
      } else {
        // Create new plan if it doesn't exist
        await CrearPlan(payload);
        // Retry saving
        await handleFinalSave();
      }
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      message.error("No se pudo guardar el plan.");
    }
  };

  const validarPlan = async (values: any) => {
    const payload = {
      Id_Usuario_Alta: idUsuario,
      Fecha: values.expirationDate
    };
    try {
      const response = await axios.post(`${PUERTO}/planGeneral/agregarPlan/${idUsuario}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data && response.data.length > 0) {
        if (response.data[0][`Id_Receta_${tipoConsumo}`] === null) {
          EditarReceta(tipoConsumo, response.data[0][`Id_Recetas_Dia`], selectedValue);
        } else {
          confirmarAccion(tipoConsumo, response.data[0][`Id_Recetas_Dia`], selectedValue);
        }
      } else {
        CrearPlan(values);
        validarPlan(values);
      }
    } catch (error) {
      console.error("Error en ValidarPlan:", error);
      message.error("No se pudo guardar el plan.");
    }
  };

  const CrearPlan = async (values: any) => {
    const payload = {
      Id_Usuario_Alta: idUsuario,
      Fecha: values.expirationDate || new Date().toISOString().split('T')[0]
    };
    try {
      const response = await axios.post(`${PUERTO}/planGeneral/${idUsuario}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        message.success("Plan creado correctamente.");
        form.resetFields();
      } else {
        message.error("Error al crear el plan.");
      }
    } catch (error) {
      console.error("Error al crear el plan:", error);
      message.error("Error al procesar la solicitud.");
    }
  };

  const EditarReceta = async (comida: string, planId: number, idReceta: number | null) => {
    const payload = {
      Id_Recetas_Dia: planId,
      id_receta: idReceta,
      Id_Usuario_Alta: idUsuario
    };
    try {
      const response = await axios.put(`${PUERTO}/editar${comida}/${planId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        message.success("Receta editada correctamente.");
      } else {
        message.error("Error al editar la receta.");
      }
    } catch (error) {
      console.error("Error el editar el plan:", error);
      message.error("Error al editar el plan.");
    }
  };

  const confirmarAccion = (comida: string, planId: number, idReceta: number | null) => {
    return new Promise<void>((resolve) => {
      Modal.confirm({
        title: '¿Estás seguro de programar esa comida?',
        content: 'Ya hay una comida programada para ese día.',
        okText: 'Sí',
        cancelText: 'No',
        onOk: async () => {
          await EditarReceta(comida, planId, idReceta);
          resolve();
        },
        onCancel: () => {
          resolve();
        },
      });
    });
  };

  const openEditModal = (index: number) => {
    setCurrentDayIndex(index);
    setEditModalVisible(true);
    editForm.setFieldsValue({
      desayuno: dias[index].Id_Desayuno,
      comida: dias[index].Id_Comer,
      cena: dias[index].Id_Cena,
    });
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
        title="Plan Semanal de Menús"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleFinalSave}>
            Guardar
          </Button>,
        ]}
        width={800}
      >
        <Flex wrap="wrap" gap="middle" justify="center">
          {dias.map((dia, index) => (
            <Card
              key={index}
              title={diasSemana[index]}
              style={{ width: 200, marginBottom: 16 }}
              actions={[<Text onClick={() => openEditModal(index)}>Edit</Text>]}
            >
              <Flex vertical gap="small">
                <Flex align="center" gap="small">
                  <StarOutlined />
                  <Text>{dia.Desayuno}</Text>
                </Flex>
                <Text type="secondary">Desayuno</Text>
                <Flex align="center" gap="small">
                  <StarOutlined />
                  <Text>{dia.Comer}</Text>
                </Flex>
                <Text type="secondary">Comida</Text>
                <Flex align="center" gap="small">
                  <StarOutlined />
                  <Text>{dia.Cena}</Text>
                </Flex>
                <Text type="secondary">Cena</Text>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Modal>

      <Modal
        title={`Editar ${currentDayIndex !== null ? diasSemana[currentDayIndex] : ''}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={editForm}
          style={{ maxWidth: 600 }}
          onFinish={handleEditFinish}
        >
          <Form.Item
            name="desayuno"
            label="Desayuno"
            rules={[{ required: false }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir receta"
              options={filteredOptions}
              onSearch={(value) => setSearchTerm(value)}
              filterOption={false}
            />
          </Form.Item>

          <Form.Item
            name="comida"
            label="Comida"
            rules={[{ required: false }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir receta"
              options={filteredOptions}
              onSearch={(value) => setSearchTerm(value)}
              filterOption={false}
            />
          </Form.Item>

          <Form.Item
            name="cena"
            label="Cena"
            rules={[{ required: false }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir receta"
              options={filteredOptions}
              onSearch={(value) => setSearchTerm(value)}
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

export default PlanCrearPlan;