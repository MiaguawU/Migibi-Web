import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  Space
} from 'antd';
import axios from 'axios';
import PUERTO from "../../../config";

const { Option } = Select;

interface FormValues {
  Tipo_Consumo: string;
}

interface ConsumoModalProps {
  visible: boolean;
  onClose: () => void;
  id_unidad: number | null; 
}

const ConsumoModal: React.FC<ConsumoModalProps> = ({ visible, onClose, id_unidad }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Para el botón de Guardar
  const [modalLoading, setModalLoading] = useState(false);

  const obtenerUnidad = async (alimentoId: number, adminId: number) => {
    setModalLoading(true);
    try {
      const response = await axios.get(`${PUERTO}/tipoC/${id_unidad}`);
      const unidadDataArray = response.data;

      console.log("Datos de unidad recibidos para edición:", unidadDataArray);

      // Rellenar el formulario con los datos del alimento
      if (Array.isArray(unidadDataArray) && unidadDataArray.length > 0) {
        const unidad = unidadDataArray[0]; // Get the first object from the array
        form.setFieldsValue({
          Tipo_Consumo: unidad.Tipo_Consumo,
        });
        message.success('Datos de la unidad cargados correctamente.');
      } else {
        message.warning('No se encontraron datos para la unidad solicitada.');
        onClose(); // Close the modal if no data is found
      }
      message.success('Datos del alimento cargados correctamente.');
    } catch (error: any) {
      console.error('Error al cargar datos del alimento:', error.response?.data || error.message);
      message.error(`Error al cargar los datos del alimento: ${error.response?.data?.error || error.message}`);
      onClose(); // Cerrar el modal si falla la carga
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      if (id_unidad !== null) {
        // Modo Edición: Cargar datos existentes
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
          message.warning("No hay un usuario logueado actualmente.");
          onClose();
          return;
        }
        const adminId = parseInt(currentUser, 10);
        if (isNaN(adminId)) {
          message.error("ID de usuario administrador inválido.");
          onClose();
          return;
        }
        obtenerUnidad(id_unidad, adminId);
      } else {
        form.resetFields();
        form.setFieldsValue({
         
        });
      }
    }
  }, [visible, id_unidad, form, onClose]); // Dependencias para re-ejecutar el efecto

  const handleFormSubmit = async () => {
    try {
      const values: FormValues = await form.validateFields();
      setLoading(true);

      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.error("No se pudo verificar el usuario administrador.");
        setLoading(false);
        return;
      }
      const adminId = parseInt(currentUser, 10); // Este es tu Id_Usuario_Alta / Id_Usuario_Modif
      if (isNaN(adminId)) {
        message.error("ID de usuario administrador inválido.");
        setLoading(false);
        return;
      }

      const payload = {
        nombre: values.Tipo_Consumo,
        id_usuario: adminId,
      };

      if (id_unidad !== null) {

        const Upayload = {
        nombre: values.Tipo_Consumo,
        id_usuario_modif: adminId,
      };
        
        await axios.put(`${PUERTO}/tipoC/${id_unidad}`, payload); // Send JSON directly
        message.success('Unidad actualizado correctamente.');
      } else {
        await axios.post(`${PUERTO}/tipoC`, payload); // Send JSON directly, adminId in URL
        message.success('Unidad creado correctamente.');
      }
      onClose();
    } catch (info: any) {
      console.log('Validación o error al enviar:', info);
      message.error(`Fallo al guardar: ${info.response?.data?.error || info.message || 'Por favor, completa los campos requeridos.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{id_unidad !== null ? "Editar tipo consumo" : "Agregar tipo consumo"}</span>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} style={{ fontSize: '16px' }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit} style={{ fontSize: '16px' }}>
          {id_unidad !== null ? "Guardar Cambios" : "Agregar Tipo consumo"}
        </Button>,
      ]}
    >
      {modalLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Cargando datos del alimento..." />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="alimento_form"
        >
          <Form.Item
            name="Tipo_Consumo"
            label={<span style={{ fontSize: '16px' }}>Nombre del tipo consumo</span>}
            rules={[{ required: true, message: 'Por favor ingresa el nombre del alimento!' }]}
          >
            <Input placeholder="Ej. cena" style={{ fontSize: '16px' }} />
          </Form.Item>

        </Form>
      )}
    </Modal>
  );
};

export default ConsumoModal;