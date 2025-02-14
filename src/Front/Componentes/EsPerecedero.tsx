import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, InputNumber, Select, ConfigProvider, Upload, message, UploadProps } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import PUERTO from "../../config";

const { Option } = Select;

interface FormModalProps {
    visible: boolean;
    onClose: () => void;
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

const handlePerecedero = (values: any) => {
  console.log("El producto es perecedero", values);
  // Código adicional para perecederos
};

const handleNoPerecedero = (values: any) => {
  console.log("El producto no es perecedero", values);
  // Código adicional para no perecederos
};

const ProductModal: React.FC<FormModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFinish = (values: any) => {
    setIsModalVisible(true);
  };

  const handleConfirm = async (isPerecedero: boolean) => {
    setIsModalVisible(false);
    const values = form.getFieldsValue();
    values.expirationDate = isPerecedero ? values.expirationDate : null;
    
    if (isPerecedero) {
      handlePerecedero(values);
    } else {
      handleNoPerecedero(values);
    }

    onClose();
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
          }}>
      
      <Modal title="¿Es perecedero?"
        visible={visible}
        onCancel={onClose}
        footer={null} >
        <p>Confirma si el producto es perecedero.</p>
        <Button type="primary" onClick={() => handleConfirm(true)}>Sí</Button>
        <Button onClick={() => handleConfirm(false)}>No</Button>
      </Modal>
    </ConfigProvider>
  );
};

export default ProductModal;
