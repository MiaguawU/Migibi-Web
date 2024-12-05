import React, { useState} from 'react';
import { Modal, Form, Input, Button, InputNumber, Select, ConfigProvider} from 'antd';


const { TextArea } = Input;
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

const InsModal: React.FC<FormModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  
  const handleFinish = (values: any) => {
    onSubmit(values); // Llama a la función que maneja los datos
    form.resetFields(); // Resetea el formulario después de enviar
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: '#3E7E1E',
          colorBgContainer: '#CAE2B5',
          colorText: '#3E7E1E',
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
        title="Agregar Instrucción"
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
        {/* Input de cantidad */}
        <Form.Item
          name="order"
          label="Orden"
          rules={[
            { required: true, message: 'Por favor, introduce la cantidad' },
            { type: 'number', min: 1, max: 1000, message: 'Debe ser entre 1 y 1000' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Introduce la cantidad"
            min={1}
            max={1000}
            step={1}
            precision={0} // Dos decimales
          />
        </Form.Item>
          {/* Input de nombre con botón */}
          <Form.Item
            name="name"
            label="Instrucción"
            rules={[{ required: true, message: 'Por favor, introduce la instrucción' }]}
          >
            <TextArea rows={4} />
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

export default InsModal;
