import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  message,
  Avatar,
  Space,
  Spin
} from 'antd';
import { UserOutlined, UploadOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios'; // Para realizar la petición HTTP
import PUERTO from "../../../config"; // Asegúrate de que esta ruta sea correcta para tu configuración

const { Option } = Select;

interface UserData {
  Id_Usuario: number;
  Nombre_usuario: string; // Changed to match server response casing
  Contrasena: string;
  foto_perfil?: string;
  Cohabitantes: number;
  Email?: string;
  Id_Rol: number | string;
}

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Rol{
    Id_Rol: number;
    Rol: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [Rols, setRols] = useState<Rol[]>([]);

  const obtenerRoles = async () =>{
    try {
      const { data } = await axios.get(`${PUERTO}/rol`);
      setRols(data);
      console.log("DEBUG: Tipos de consumo cargados exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar tipos de consumo: ' + (error.message || 'Error desconocido'));
    }
  };

  useEffect(() => {
      form.resetFields();
      obtenerRoles();
      setPreviewImage(undefined);
      setFileImage(null);
  }, [visible, form]);

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Solo puedes subir archivos de imagen.");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("La imagen debe ser menor a 2MB.");
        return Upload.LIST_IGNORE;
      }
      setPreviewImage(URL.createObjectURL(file));
      setFileImage(file);
      return false;
    },
  };

  const handleFormSubmit = async () => {
    try {
    const currentUser = localStorage.getItem("currentUser");
          if (!currentUser) {
            message.warning("No hay un usuario logueado actualmente.");
            setModalLoading(false);
            onClose();
            return;
          }
          const adminId = parseInt(currentUser, 10);
          if (isNaN(adminId)) {
            message.error("ID de usuario administrador inválido.");
            setModalLoading(false);
            onClose();
            return;
          }
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append('Nombre_Usuario', values.Nombre_Usuario);
      formData.append('Cohabitantes', values.Cohabitantes.toString());
      formData.append('Email', values.Email);
      formData.append('Id_Rol', values.Id_Rol);

      if (values.Contrasena) {
        formData.append('Contrasena', values.Contrasena);
      }

      if (fileImage) {
        formData.append('foto_perfil', fileImage);
      } else if ( !previewImage) {
        formData.append('delete_foto_perfil', 'true');
      }
      
        await axios.post(`${PUERTO}/us_adm/${adminId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Usuario creado correctamente.');
      
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
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{ "Crear Usuario"}</span>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} style={{ fontSize: '16px' }}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleFormSubmit} style={{ fontSize: '16px' }}>
          Guardar Cambios
        </Button>,
      ]}
    >
      {modalLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Cargando datos del usuario..." />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="add_user_form"
        >
          {/* Campo de Foto de Perfil */}
          <Form.Item
            label={<span style={{ fontSize: '16px' }}>Foto de Perfil</span>}
          >
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar size={100} src={previewImage} icon={<UserOutlined />} />
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} style={{ fontSize: '16px' }}>Cambiar Foto</Button>
              </Upload>
              {previewImage && (
                <Button danger size="small" onClick={() => {
                  setPreviewImage(undefined);
                  setFileImage(null);
                  message.info('La foto de perfil se eliminará al guardar.');
                }} style={{ fontSize: '14px'}}>
                  Eliminar Foto Actual
                </Button>
              )}
            </Space>
          </Form.Item>

          {/* Campo de Nombre de Usuario */}
          <Form.Item
            // FIX: Use the exact casing from your server response
            name="Nombre_Usuario"
            label={<span style={{ fontSize: '16px' }}>Nombre de Usuario</span>}
            rules={[{ required: true, message: 'Por favor ingresa el nombre de usuario!' }]}
          >
            <Input placeholder="Ej. JuanPerez" style={{ fontSize: '16px' }} />
          </Form.Item>

          {/* Campo de Rol (Select) */}
          <Form.Item
            name="Id_Rol"
            label={<span style={{ fontSize: '16px' }}>Rol</span>}
            rules={[{ required: true, message: 'Por favor selecciona un rol!' }]}
          >
            <Select placeholder="Selecciona un rol" style={{ fontSize: '16px' }}>
                          {Rols.map((Rol) => (
                                  <Option key={Rol.Id_Rol} value={Rol.Id_Rol}>
                                    {Rol.Rol}
                                  </Option>
                                ))}
                        </Select>
          </Form.Item>

          {/* Campo de Contraseña (oculto) */}
          <Form.Item
            name="Contrasena"
            label={<span style={{ fontSize: '16px' }}>Contraseña</span>}
            rules={ [{ required: true, message: 'Por favor ingresa una contraseña!' }] }
          >
            <Input.Password
              placeholder={"Ingresa la contraseña"}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          {/* Campo de Cohabitantes */}
          <Form.Item
            name="Cohabitantes"
            label={<span style={{ fontSize: '16px' }}>Número de Cohabitantes</span>}
            rules={[{ required: true, message: 'Por favor ingresa el número de cohabitantes!' }]}
          >
            <InputNumber min={0} style={{ width: '100%', fontSize: '16px' }} />
          </Form.Item>

          {/* Campo de Email */}
          <Form.Item
            name="Email"
            label={<span style={{ fontSize: '16px' }}>Email</span>}
            rules={[{ required: true, type: 'email', message: 'El formato del email no es válido.' }]}
          >
            <Input placeholder="ejemplo@dominio.com" style={{ fontSize: '16px' }} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddUserModal;