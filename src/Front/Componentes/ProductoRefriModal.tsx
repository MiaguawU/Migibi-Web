import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, Select, ConfigProvider, Upload, message, UploadProps } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
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

const ProductModal: React.FC<FormModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [searchTerm, setSearchTerm] = useState('');
  const [alimentosPerecederos, setAlimentosPerecederos] = useState<string[]>([]);
  const [alimentosNoPerecederos, setAlimentosNoPerecederos] = useState<string[]>([]);
  
  const filteredAlimentos = [...alimentosPerecederos, ...alimentosNoPerecederos].filter((alimento) => {
    const nombre = alimento;
    return (
      nombre.includes(searchTerm) 
    );
  });
  
  const handleFinish = (values: any) => {
    onSubmit(values); // Llama a la función que maneja los datos
    form.resetFields(); // Resetea el formulario después de enviar
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
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
        title="Agregar Producto"
        visible={visible}
        onCancel={onClose}
        footer={null} // Elimina los botones predeterminados del modal
        
      >
        
        <Form
          {...formItemLayout}
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={handleFinish} // Se conecta al envío
        >
          {/* Input de nombre con botón */}
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor, introduce el nombre' }]}
          >
            <Input.Search
              placeholder="Buscar ingrediente"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Item>

          {/* Selector de Fecha */}
          <Form.Item
            name="expirationDate"
            label="Fecha de caducidad"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Selecciona una fecha"
            />
          </Form.Item>

          {/* Input de cantidad */}
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
              precision={2} // Dos decimales
            />
          </Form.Item>

          {/* Select de unidades */}
          <Form.Item
            name="unit"
            label="Unidad"
            rules={[{ required: true, message: 'Por favor, selecciona una unidad' }]}
          >
            <Select placeholder="Selecciona una unidad">
              <Option value="kg">kg</Option>
              <Option value="g">g</Option>
              <Option value="l">l</Option>
              <Option value="pz">pz</Option>
            </Select>
          </Form.Item>

          {/* Select de tipo */}
          <Form.Item
            name="type"
            label="Tipo"
            rules={[{ required: true, message: 'Por favor, selecciona el tipo de alimento' }]}
          >
            <Select placeholder="Selecciona el tipo de alimento">
              <Option value="kg">Vegetal</Option>
              <Option value="g">Fruta</Option>
              <Option value="l">Camaron</Option>
              <Option value="pz">Pepe</Option>
            </Select>
          </Form.Item>


          <Form.Item name="imgsrc" label="Imagen">
            <Upload accept=".jpg,.png" listType="picture" maxCount={1} {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* Botón de enviar */}
          <Form.Item
            wrapperCol={{
                xs: { span: 24 },
                sm: { span: 24 }, // Ocupa todo el espacio
                offset: 0, // Sin desplazamiento
            }}>
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
