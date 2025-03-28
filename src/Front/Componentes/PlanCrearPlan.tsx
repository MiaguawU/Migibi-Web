import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Button, Select, ConfigProvider, message } from 'antd';
import axios from "axios";
import PUERTO from "../../config";
import { any } from 'joi';
import { isNumberObject } from 'util/types';

const { Option } = Select;

{/** 
PlanCrear sirve para crear un nuevo plan del sistema
Primero debe preguntarle al usuario si quiere que el plan se haga solo con cosas que tenga en su casa o si quiere que dure toda la semana
El algoritmo para conseguir ambos planes se conserva como procedure en la base de datos
  Se necesita del procedure PlanEstricto que se hace con cosas que ya se tiene en la casa
  Se necesita del procedure PlanRellenar que dura toda la semana y que 
  
  En Hoy, hay un botón que te da las recetas que puedes hacer con los ingredientes en ese momento
    Utiliza el procedure PlanEstricto
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

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
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
const ValidarComidaNull = (data: any, recipeType: string): boolean => {
  if (!data || data.length === 0) {
    console.error("El arreglo de datos está vacío o no es válido.");
    return false;
  }

  // Verifica si el campo especificado es null
  return data[0][recipeType] === null;
};

const PlanCrear: React.FC<FormModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [recetas, setRecetas] = useState<any[]>([]);
  const [Tipos, setTipos] = useState<Tipo[]>([]);  
  const [searchTerm, setSearchTerm] = useState<string>(""); // Para la búsqueda
  const [selectedValue, setSelectedValue] = useState<number | null>(null); // Para el valor seleccionado
  const [idUsuario, setIdUSuario] = useState(0);
  const [tipoConsumo, setTipoConsumo] = useState<string>("");

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
    form.resetFields(); // Resetea el formulario después de enviar
  };

  const fetchRecetas = async () => {
    try {
      const response = await axios.get(`${PUERTO}/recetaGeneral/nombres`);
      const recetasData = response.data;
      setRecetas(recetasData);
    } catch (error) {
      message.error("Error al obtener las recetas.");
    }
  };

  // Obtener tipos de consumo
  const obtenerTipos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/tipoC`, {
        headers: { "Content-Type": "application/json" },
      });
      if(response){
        setTipos(response.data );
      }
      else{
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

  const validarPlan = async(values: any) => {
    let response;
      
    const payload = {
      Id_Usuario_Alta: idUsuario,
      Fecha: values.expirationDate
    };
    try {
     response = await axios.post(`${PUERTO}/planGeneral/agregarPlan/${idUsuario}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.data && response.data.length > 0) {
      console.log(response.data);
    {/** 
    Nuevo_Plan sirve para agregar una nueva receta en el plan
    Tiene que validar si el plan ya existe
        Si ya existe el plan, evalúa si la comida que eligió el usuario es nula o no
            si es nula, le va a agregar la nueva receta a la comida que sea
                EditarReceta()
            si no es nula, le va a mandar un dialog que le dice que se va a editar la comida de ese plan
                modalSeguro de que quiere editar la comida
                EditarReceta()
        Si no existe el plan, va a crear el plan y le va a agregar la nueva receta
                Crear plan()
                EditarReceta(),
    */}
      if (response.data[0][`Id_Receta_${tipoConsumo}`] === null) {
        EditarReceta(tipoConsumo, response.data[0][`Id_Recetas_Dia`], selectedValue);
      } else {
        confirmarAccion(tipoConsumo, response.data[0][`Id_Recetas_Dia`], selectedValue);
      }
      
    } else {
      console.log("No hay plan");
      CrearPlan(values);
      validarPlan(values);
    }
  } catch (error) {
    console.log(`error al hacer el post de ${PUERTO}/planGeneral/agregarPlan/${idUsuario}`);
    console.error("Error en ValidarPlan:", error);
    message.error("No se pudo guardar el plan.");
  } 
  }

  const CrearPlan = async(values: any) => {
    
    const payload = {
      Id_Usuario_Alta: idUsuario,
      Fecha: values.expirationDate
    };
    let response;
  try {
    response = await axios.post(`${PUERTO}/planGeneral/${idUsuario}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      message.success("Plan creado correctamente.");
      form.resetFields();
      onSubmit();
      onClose();
    } else {
      message.error("Error al crear el plan.");
    }
  } catch (error) {
    console.log(`Error al ejecutar post ${PUERTO}/planGeneral/${idUsuario}`);
    console.error("Error al crear el plan:", error);
    message.error("Error al procesar la solicitud.");
  }}

  const EditarReceta = async(comida: string, planId: number, idReceta: number | null) => {

    const payload = {
      Id_Recetas_Dia: planId,
      id_receta: idReceta,
      Id_Usuario_Alta: idUsuario
    };
    let response;
  try {
    response = await axios.put(`${PUERTO}/editar${comida}/${planId}`, payload, {
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
    console.log(`Error al ejecutar PUT ${PUERTO}/editar${comida}/${planId}`);
    console.error("Error el editar el plan:", error);
    message.error("Error al editar el plan.");
  }}
  
  const confirmarAccion = (comida: string, planId: number, idReceta: number | null) => {
    Modal.confirm({
      title: '¿Estás seguro de programar esa comida?',
      content: 'Ya hay una comida programada para ese día.',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        EditarReceta(comida, planId, idReceta);
      },
      onCancel: () => {
      },
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
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Por favor, selecciona el tipo de alimento' }]}
          >
            <Select
              placeholder="Seleccione un tipo"
              value={tipoConsumo}
              onChange={setTipoConsumo}
              style={{ width: 200 }}
            >
              <Option key={0} value={"Desayuno"}>
                {"Desayuno"}
              </Option>
              <Option key={1} value={"Comida"}>
                {"Comida"}
              </Option>
              <Option key={2} value={"Cena"}>
                {"Cena"}
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="expirationDate" label="Fecha de caducidad">
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Selecciona una fecha"
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

export default PlanCrear;
