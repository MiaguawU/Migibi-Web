import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select, ConfigProvider, message, List, Avatar } from 'antd';
import img from '../../Img/defRec.png';
import axios from "axios";
import PUERTO from "../../config";
import { any } from 'joi';
import { isNumberObject } from 'util/types';

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface Restriccion {
  Id_Usuario_Cat_Alimento: number,
  Id_Usuario: number,
  Id_Alimento: number,
  Puede_Comer: number,
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

const AlimentosNoComer: React.FC<FormModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Para la búsqueda
  const [selectedValue, setSelectedValue] = useState<number | null>(null); // Para el valor seleccionado
  const [restricciones, setRestricciones] = useState<Restriccion[]>([]);
  const [restriccionesFiltradas, setRestriccionesFiltradas] = useState<Restriccion[]>([]);

  const filteredOptions = alimentos
    .filter((alimento) => {
      const restriccion = restricciones.find(
        (restriccion) => restriccion.Id_Alimento === alimento.Id_Alimento && restriccion.Puede_Comer === 1
      );
      return restriccion && alimento.Alimento.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((alimento) => ({
      value: alimento.Id_Alimento,
      label: alimento.Alimento,
    }));

  const fetchAlimentos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/cat_ali/nombres`);
      const alimentosData = response.data;
      setAlimentos(alimentosData);
    } catch (error) {
      message.error("Error al obtener los alimentos.");
    }
  };

  const fetchRestricciones = async () => {
    const id = Number(localStorage.getItem("currentUser"));

    let response;
    try {
      response = await axios.get(`${PUERTO}/usuario_cat_alimento/usuario/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const respuesta =response.data
          .map((restriccion: Restriccion) => {
            return {
              Id_Usuario_Cat_Alimento: restriccion.Id_Usuario_Cat_Alimento,
              Id_Usuario: restriccion.Id_Usuario,
              Id_Alimento: restriccion.Id_Alimento,
              Puede_Comer: restriccion.Puede_Comer,
            };
          });
        setRestricciones(respuesta);
        setRestriccionesFiltradas(respuesta.filter((restriccion: Restriccion)=> restriccion.Puede_Comer === 0))
      } else {
        message.error("Error al editar la receta.");
      }
    } catch (error) {
      console.log(error);
      message.error("Error al solicitar las restricciones.");
    }
  }

  useEffect(() => {
    if (visible) {
      fetchAlimentos();
      fetchRestricciones();
    }
  }, [visible]);

  const handleAgregarAlimento = (values:any) => {
    EditarRestriccion(selectedValue)
    form.resetFields();
    fetchAlimentos();
    fetchRestricciones();
    setSearchTerm("");
  }

  const EditarRestriccion = async(Id_Alimento: number | null) => {
    const idUsuario = Number(localStorage.getItem("currentUser"));

    const payload = {
      Id_Alimento: Id_Alimento
    };
    let response;
  try {
    response = await axios.put(`${PUERTO}/usuario_cat_alimento/agregar/${idUsuario}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      message.success("Receta editada correctamente.");
      onSubmit();
    } else {
      message.error("Error al editar la receta.");
    }
  } catch (error) {
    console.error("Error el editar la relacion:", error);
    message.error("Error al editar la relacion.");
  }}
  
  const borrarAlimento = async(Id_Alimento: number | null) => {
    const idUsuario = Number(localStorage.getItem("currentUser"));

    const payload = {
      Id_Alimento: Id_Alimento
    };
    let response;
  try {
    response = await axios.put(`${PUERTO}/usuario_cat_alimento/borrar/${idUsuario}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      message.success("Receta editada correctamente.");
      onSubmit();
      fetchAlimentos();
      fetchRestricciones();
    } else {
      message.error("Error al editar la receta.");
    }
  } catch (error) {
    console.error("Error el editar la relacion:", error);
    message.error("Error al editar la relacion.");
  }}

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
        title="Editar alimentos que no puedo comer."
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={handleAgregarAlimento}
        >
          <Form.Item
            name="name"
            label="Alimento"
            rules={[{ required: true, message: 'Por favor, introduce el nombre del alimento.' }]}
          >
            <Select
              showSearch
              placeholder="Buscar o escribir alimento"
              options={filteredOptions}
              value={selectedValue}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(value) => {
                setSelectedValue(value); // Actualizar el valor seleccionado
                const alimentoSeleccionada = alimentos.find(
                  (alimento => alimento.Id_Alimento === value)
                );
                if (alimentoSeleccionada) {
                  setSearchTerm(alimentoSeleccionada.Alimento); // Actualizar el término de búsqueda para que refleje el nombre
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
            <Button type="primary"  htmlType="submit" block>
              Agregar
            </Button>
          </Form.Item>
        </Form>
        <List
          itemLayout="horizontal"
          dataSource={restriccionesFiltradas}
          renderItem={(restriccion: Restriccion, index) => (
            <List.Item key={index} actions={[<Button onClick={() => borrarAlimento(restriccion.Id_Alimento)}>Eliminar</Button>]}>
              <List.Item.Meta
                avatar={<Avatar src={img} />}
                title={alimentos.find((alimento) => alimento.Id_Alimento === restriccion.Id_Alimento)?.Alimento || "Alimento desconocido"}
              />
            </List.Item>
          )}
        />
      </Modal>
    </ConfigProvider>
  );
};

export default AlimentosNoComer;
