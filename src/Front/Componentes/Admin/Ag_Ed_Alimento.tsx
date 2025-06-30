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

interface AlimentoFormValues {
  Alimento: string;
  Id_Tipo_Alimento: number; // Suponemos que los IDs de tipo son números
  Es_Perecedero: number; // 1 para Sí, 0 para No
}

interface AlimentoData {
  Id_Alimento: number;
  Id_Tipo_Alimento: number;
  Alimento: string;
  Activo: boolean;
  Id_Usuario_Alta: number;
  Fecha_Alta: string;
  Id_Usuario_Modif?: number | null;
  Fecha_Modif?: string | null;
  Id_Usuario_Baja?: number | null;
  Fecha_Baja?: string | null;
  Es_Perecedero: boolean;
}

interface cat_tipo_al {
  Id_Tipo_Alimento: number;
  Tipo_Alimento: string;
}

interface AlimentoModalProps {
  visible: boolean;
  onClose: () => void;
  id_alimento: number | null; // El ID del alimento a editar. Si es null, es un nuevo alimento.
}

const AlimentoModal: React.FC<AlimentoModalProps> = ({ visible, onClose, id_alimento }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Para el botón de Guardar
  const [modalLoading, setModalLoading] = useState(false);
  const [tipo, setTipo] = useState<cat_tipo_al[]>([]);

  const obtenerTipo = async () => {
    try {
      const { data } = await axios.get(`${PUERTO}/tipoA`);
      setTipo(data);
      console.log("DEBUG: Tipos de consumo cargados exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar tipos de consumo: ' + (error.message || 'Error desconocido'));
    }
  }

  const obtenerAlimento = async (alimentoId: number, adminId: number) => {
    setModalLoading(true);
    try {
      // Corrected GET request to match backend, sending adminId as query param
      const response = await axios.get<AlimentoData>(`${PUERTO}/cat_ali/unic/${alimentoId}?id_usuario_admin=${adminId}`);
      const alimentoData = response.data;

      console.log("Datos de alimento recibidos para edición:", alimentoData);

      // Rellenar el formulario con los datos del alimento
      form.setFieldsValue({
        Alimento: alimentoData.Alimento,
        Id_Tipo_Alimento: alimentoData.Id_Tipo_Alimento,
        Es_Perecedero: alimentoData.Es_Perecedero ? 1 : 0, // Convertir boolean a 1/0
      });
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
      obtenerTipo();
      if (id_alimento !== null) {
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
        obtenerAlimento(id_alimento, adminId);
      } else {
        // Modo Creación: Resetear el formulario a valores por defecto
        form.resetFields();
        form.setFieldsValue({
          // Puedes establecer valores por defecto si lo deseas
          // Id_Tipo_Alimento: alguna_id_default,
          // Es_Perecedero: 1 // O 0, según tu preferencia
        });
      }
    }
  }, [visible, id_alimento, form, onClose]); // Dependencias para re-ejecutar el efecto

  // --- Manejador al enviar el formulario (agregar o editar) ---
  const handleFormSubmit = async () => {
    try {
      const values: AlimentoFormValues = await form.validateFields();
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

      // --- Construct JSON payload instead of FormData ---
      const payload = {
        Alimento: values.Alimento,
        Id_Tipo_Alimento: values.Id_Tipo_Alimento,
        Es_Perecedero: values.Es_Perecedero === 1 ? true : false, // Convert 1/0 to boolean for backend
        id_usuario_accion: adminId, // Send adminId in body for verification on backend
      };

      if (id_alimento !== null) {
        // Modo Edición: Se envía Id_Usuario_Modif en el cuerpo
        // The backend expects 'nombre', 'Id_Tipo_Alimento', 'Es_Perecedero', 'id_usuario_accion' for PUT
        const putPayload = {
          nombre: values.Alimento, // Backend expects 'nombre' for PUT
          Id_Tipo_Alimento: values.Id_Tipo_Alimento,
          Es_Perecedero: values.Es_Perecedero === 1 ? true : false,
          id_usuario_accion: adminId, // This is your Id_Usuario_Modif
        };
        console.log("Payload enviado (PUT):", putPayload);
        await axios.put(`${PUERTO}/cat_ali/${id_alimento}`, putPayload); // Send JSON directly
        message.success('Alimento actualizado correctamente.');
      } else {
        // Modo Creación:
        console.log("Payload enviado (POST):", payload);
        await axios.post(`${PUERTO}/cat_ali/${adminId}`, payload); // Send JSON directly, adminId in URL
        message.success('Alimento creado correctamente.');
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
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{id_alimento !== null ? "Editar Alimento" : "Agregar Alimento"}</span>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} style={{ fontSize: '16px' }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit} style={{ fontSize: '16px' }}>
          {id_alimento !== null ? "Guardar Cambios" : "Agregar Alimento"}
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
            name="Alimento"
            label={<span style={{ fontSize: '16px' }}>Nombre del Alimento</span>}
            rules={[{ required: true, message: 'Por favor ingresa el nombre del alimento!' }]}
          >
            <Input placeholder="Ej. Manzana" style={{ fontSize: '16px' }} />
          </Form.Item>

          <Form.Item
            name="Id_Tipo_Alimento"
            label={<span style={{ fontSize: '16px' }}>Tipo de Alimento</span>}
            rules={[{ required: true, message: 'Por favor selecciona el tipo de alimento!' }]}
          >
            <Select placeholder="Selecciona un tipo" style={{ fontSize: '16px' }}>
              {tipo.map((cat_tipo_al) => (
                <Option key={cat_tipo_al.Id_Tipo_Alimento} value={cat_tipo_al.Id_Tipo_Alimento}>
                  {cat_tipo_al.Tipo_Alimento}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="Es_Perecedero"
            label={<span style={{ fontSize: '16px' }}>¿Es Perecedero?</span>}
            rules={[{ required: true, message: 'Por favor selecciona si es perecedero!' }]}
          >
            <Select placeholder="Selecciona una opción" style={{ fontSize: '16px' }}>
              <Option value={1} style={{ fontSize: '16px' }}>Sí</Option>
              <Option value={0} style={{ fontSize: '16px' }}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AlimentoModal;