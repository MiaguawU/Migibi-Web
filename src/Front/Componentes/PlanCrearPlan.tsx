import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Button, Select, ConfigProvider, message, Flex, Card, Typography } from 'antd';
import { Modo, Plan } from '../Metodos/Enum';
import { StarOutlined } from '@ant-design/icons';
import { formatoFechaLegible } from '../Metodos/FormatoFecha';
import axios from "axios";
import PUERTO from "../../config";

const { Option } = Select;
const { Title, Text } = Typography;

{/** 
    PlanCrear sirve para crear un nuevo plan del sistema
    El algoritmo para conseguir ambos planes se conserva como procedure en la base de datos
      Se necesita del procedure PlanEstricto que se hace con cosas que ya se tiene en la casa
      Se necesita del procedure PlanRellenar que dura toda la semana y que 
  
En Hoy, hay un botón que te da las recetas que puedes hacer con los ingredientes en ese momento
    Hay un botón que te pregunta si quieres el PlanEstricto o PlanRellenar
  Te deja agregar esas recetas a Hoy como desayuno, comida o cena
    Usa el código de agregar receta para confirmar que puede agregarla
    Se muestra con HoyCrearPlan que es una sola lista en el panel
En plan:
    Hay un botón con el que usas PlanEstricto 
      Se abre PlanCrearPlan con las recetas de PlanEstricto y donde faltan hay un botón para agregar recetas.
      
    Hay un botón para PlanRellenar
      Se abre PlanCrearPlan con las recetas de PlanRellenar
    Al guardar los planes, confirma si todos los días y manda un Modal.confirm de que no están todas las recetas
*/}
 
{/**
Lo que hay en PlanCrearPlan
  interface de la recetaDia
  interface de la receta
  Está la estructura de la lista de RecetasDia
    Dia
      Desayuno - Receta || null
      Comida - Receta || null
      Cena - Receta || null

  Hay un Método que manda a llamar el plan que sea necesario
    /planes/GenerarPlan${Modo}${Plan}/:Id_Usuario_Alta
*/}

interface Dia {
  Dia: number;
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [idUsuario, setIdUSuario] = useState(0);
  const [tipoConsumo, setTipoConsumo] = useState<string>("");
  const [dias, setDias] = useState<Dia[]>([]);

  {/**
    
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 29, Comer: 'Ensalada de atún', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    { Id_Desayuno: 26, Desayuno: 'Cazuela de Huevo con Calabacitas y Frijoles', Id_Comer: 30, Comer: 'Espagueti con albóndigas', Id_Cena: 31, Cena: 'Lasaña' },
    */}

  
    const obtenerPlan = async () => {
      setLoading(true);
      let response;
      const idUsuario = Number(localStorage.getItem("currentUser"));
        
      console.log(ModoSelected);
      console.log(PlanSelected);
      try {
       response = await axios.get(`${PUERTO}/planes/GenerarPlan${ModoSelected}${PlanSelected}/${idUsuario}`, {
        headers: { "Content-Type": "application/json" },
      });
        if (response.data) {

          // Filtrar recetas activas y que coincidan con el usuario o sean predeterminadas
          const recData = response.data[0]
            .map((dia: any) => {
              return {
                Dia: dia.dia,
                Fecha: dia.Fecha,
                Id_Desayuno: dia.Id_Desayuno,
                Desayuno: dia.Desayuno,
                Id_Comer: dia.Id_Comer,
                Comer: dia.Comer,
                Id_Cena: dia.Id_Cena,
                Cena: dia.Cena
              };
            });
            
          // Actualizar el estado con las recetas filtradas
          setDias(recData);
          console.log("Dias exitosamente");
          console.log(recData);
        }
      } catch (error) {
        console.error("Error al obtener recetas", error);
        message.error("No se pudo conectar con el servidor o ID de usuario inválido.");
      } finally {
        setLoading(false); // Asegurar que el estado de carga se detenga
      }
    };
    
  useEffect(() => {
    obtenerPlan();
  }, []);

  const filteredOptions = recetas
    .filter((receta) => receta.Nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((receta) => ({
      value: receta.Id_Receta,
      label: receta.Nombre,
    }));

  const handleEditFinish = (values: any) => {
    if (currentDayIndex !== null) {
      const updatedDias = [...dias];
      const selectedDesayuno = recetas.find(r => r.Id_Receta === values.desayuno);
      const selectedComida = recetas.find(r => r.Id_Receta === values.comida);
      const selectedCena = recetas.find(r => r.Id_Receta === values.cena);

      updatedDias[currentDayIndex] = {
        Dia: currentDayIndex +1 ,
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

  
  const handleFinalSave = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
    const idUsuario = Number(currentUser);

    try {
      // Create or validate plan
      await CrearPlan();
      const planResponse = await axios.get(`${PUERTO}/planGeneral/recetas${PlanSelected}/${idUsuario}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(`Este es el planResponse en PlanCrearPlan \n${planResponse}`);
      
      if (planResponse.data && planResponse.data.length > 0) {
        console.log(planResponse);
        // Update all modified meals
        let bandera: boolean;
        bandera = false;
        for (let i = 0; i < dias.length; i++) {
          const dia = dias[i];
          const planId = planResponse.data[i][`Id_Recetas_Dia`];

          // Check and update each meal type
          if (dia.Id_Desayuno) {
            if (planResponse.data[i][`Id_Receta_Desayuno`] === null) {
              await EditarReceta('Desayuno', planId, dia.Id_Desayuno);
            } else {
              if (planResponse.data[i][`Id_Receta_Desayuno`] != dia.Id_Desayuno) {
                await confirmarAccion('Desayuno', planId, dia.Id_Desayuno, planResponse.data[0][`Fecha`], dia.Desayuno);
              }
            }
          }
          if (dia.Id_Comer) {
            if (planResponse.data[i][`Id_Receta_Comida`] === null) {
              await EditarReceta('Comida', planId, dia.Id_Comer);
            } else {
              if (planResponse.data[i][`Id_Receta_Comida`] != dia.Id_Comer) {
                await confirmarAccion('Comida', planId, dia.Id_Comer,  planResponse.data[0][`Fecha`], dia.Comer);
              }
            }
          }
          if (dia.Id_Cena) {
            if (planResponse.data[i][`Id_Receta_Cena`] === null) {
              await EditarReceta('Cena', planId, dia.Id_Cena);
            } else {
              if (planResponse.data[i][`Id_Receta_Cena`] != dia.Id_Cena) {
                await confirmarAccion('Cena', planId, dia.Id_Cena,  planResponse.data[0][`Fecha`], dia.Cena);
              }
            }
          }
        }
        message.success("Plan guardado correctamente.");
        onSubmit();
        onClose();
      } else {
        message.error("No se pudo guardar el plan.");
      }
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      message.error("No se pudo guardar el plan.");
    }
  };

  const CrearPlan = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }
      const idUsuario = Number(currentUser);

      const response = await axios.post(`${PUERTO}/planGeneral/agregarPlanes/${idUsuario}`, {
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
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
    const idUsuario = Number(currentUser);

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

  const confirmarAccion = (comida: string, planId: number, idReceta: number | null, fecha: string, receta: string) => {

    return new Promise<void>((resolve) => {
      Modal.confirm({
        title: '¿Estás seguro de programar esa comida?',
        content: `Ya hay un(a) ${comida} programado(a) para el ${fecha} ${formatoFechaLegible(fecha)}: ${receta}.${planId}`,
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
      {/**
       * en save poner handleFinish
       */}
      <Modal
        title={`Plan ${ModoSelected} de ${PlanSelected}`}
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
        <Flex wrap gap="middle" justify="center" style={{flexDirection: 'row'}}>
          {dias.map((dia, index) => (
            <Card
              key={index}
              title={diasSemana[index]}
              style={{ width: 200, marginBottom: 16 }}
              actions={[<Text onClick={() => openEditModal(index)}>Edit</Text>]}
            >
              <Flex vertical gap="small">
                <Flex gap='5'  vertical>
                  <Title level={5} style={{ margin: 0 }}>Desayuno</Title>
                  <Text>{dia.Desayuno || "Seleccione una receta"}</Text>
                </Flex>
                <Flex gap='5'  vertical>
                  <Title level={5} style={{ margin: 0 }}>Comida</Title>
                  <Text>{dia.Comer || "Seleccione una receta"}</Text>
                </Flex>
                <Flex gap='5'  vertical>
                  <Title level={5} style={{ margin: 0 }}>Cena</Title>
                  <Text>{dia.Cena || "Seleccione una receta"}</Text>
                </Flex>
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