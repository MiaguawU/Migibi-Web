import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, Select, ConfigProvider, Upload, message, UploadProps } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import PUERTO from "../../config";
import moment from 'moment';

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  alimentoId: number | null;
}

interface Tipo {
  Id_Tipo_Alimento: number;
  Tipo_Alimento: string;
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

const props: UploadProps = {
  beforeUpload: (file) => {
    const isIMG = file.type === 'image/png';
    if (!isIMG) {
      message.error(`${file.name} no es un archivo de imagen`);
    }
    return isIMG || Upload.LIST_IGNORE;
  },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

const ProductModal: React.FC<FormModalProps> = ({ visible, onClose, alimentoId }) => {
  const [form] = Form.useForm();
  const [Tipos, setTipos] = useState<Tipo[]>([]);  
  const [Unidades, setUnidad] = useState<Unidad[]>([]); 

  const props: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/'); // Verifica que sea cualquier tipo de imagen
      if (!isImage) {
        message.error(`${file.name} no es un archivo de imagen válido`);
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };
  

  useEffect(() => {
    if (visible) {
      obtenerTipos();
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
        name: alimento.Nombre,
        expirationDate: alimento.Fecha ? moment(alimento.Fecha, "YYYY-MM-DD") : null,
        quantity: alimento.Cantidad,
        unit: alimento.id_unidad,
        type: alimento.id_tipo,
      });
    } catch (error) {
      message.error("No se pudo cargar el alimento.");
    }
  };
  

  const obtenerTipos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/tipoA`);
      setTipos(response.data);
    } catch {
      message.error("No se pudieron cargar los tipos.");
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
  
    const formData = new FormData();
        formData.append('nombre', values.name);
        formData.append('tipo', values.type);
        formData.append('id_unidad', values.unit);
        formData.append('cantidad', values.quantity);
        formData.append('fecha_caducidad', values.expirationDate ? values.expirationDate.format("YYYY-MM-DD") : ''); // Formatear la fecha
        formData.append('Id_Usuario_Alta', currentUser);

  
    if (values.imgsrc && values.imgsrc.file) {
      formData.append('image', values.imgsrc.file.originFileObj);
    } else { 
      
    }
    
    try {
      const response = await axios.put(`${PUERTO}/alimento/${alimentoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Producto actualizado');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Error al actualizar');
    }
  };
  

  const handleFinish = (values: any) => {
    handleSubmit(values);
    obtenerAlimento();
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
        components: {
          Form: {
            labelFontSize: 22,
            labelRequiredMarkColor: 'white',
          },
        },
      }}
    >
      <Modal
        title={alimentoId ? "Editar Producto" : "Agregar Producto"}
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
            rules={[{ required: true, message: 'Por favor, introduce el nombre' }]}
          >
            <Input placeholder="Nombre alimento" />
          </Form.Item>

          <Form.Item name="expirationDate" label="Fecha de caducidad">
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Selecciona una fecha"
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
              {Unidades.map((unidad) => (
                <Option key={unidad.Id_Unidad_Medida} value={unidad.Id_Unidad_Medida}>
                  {unidad.Unidad_Medida}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Por favor, selecciona el tipo de alimento' }]}
          >
            <Select placeholder="Selecciona el tipo de alimento">
              {Tipos.map((tipo) => (
                <Option key={tipo.Id_Tipo_Alimento} value={tipo.Id_Tipo_Alimento}>
                  {tipo.Tipo_Alimento}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="imgsrc" label="Imagen">
            <Upload listType="picture" maxCount={1} {...props}>
              <Button icon={<UploadOutlined />}>Subir Imagen</Button>
            </Upload>
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

export default ProductModal;
