import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Select, message, ConfigProvider } from 'antd';
import axios from 'axios';
import PUERTO from '../../config';

interface Item {
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  isChecked: boolean;
  cantidad: string;
  unidad: string;
}
interface EditarIngredienteModalProps {
  visible: boolean;
  onClose: () => void;
  recetaId: number;
  ingrediente: Item | null;
  onSubmit: (ingredienteEditado: any) => void;
}

interface Unidad {
  Id_Unidad_Medida: number;
  Unidad_Medida: string;
}

const EditarIngredienteModal: React.FC<EditarIngredienteModalProps> = ({
  visible,
  onClose,
  recetaId,
  ingrediente,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [unidades, setUnidades] = useState<Unidad[]>([]);

    useEffect(() => {
    if (visible && ingrediente) {
        axios.get(`${PUERTO}/unidad`)
        .then((res) => setUnidades(res.data))
        .catch(() => message.error("Error al obtener unidades"));

        form.setFieldsValue({
        quantity: parseFloat(ingrediente.cantidad),
        unit: unidades.find((u) => u.Unidad_Medida === ingrediente.unidad)?.Id_Unidad_Medida,
        });
    }
    }, [visible, ingrediente]);


  const handleFinish = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
        const hoy = new Date();
        const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    if(ingrediente) {
        const payload = {
        cantidad: values.quantity,
        id_unidad: values.unit,
        Id_Usuario_Alta: Number(currentUser),
        Fecha_Alta: Fecha_Alta,
        };
        console.log(payload);
        try {
        await axios.put(`${PUERTO}/ingredientes/${ingrediente.id}`, payload);
        message.success("Ingrediente actualizado correctamente.");
        onSubmit({
            ...ingrediente,
            cantidad: values.quantity,
            unidad: unidades.find((u) => u.Id_Unidad_Medida === values.unit)?.Unidad_Medida || ingrediente.unidad,
        });
        form.resetFields();
        onClose();
        } catch (error) {
        console.error(error);
        message.error("Error al actualizar el ingrediente.");
        }
    } else {
        form.resetFields();
        onClose();
        message.error("Error al editar el ingrediente.");
    }
  };

  return (
    <ConfigProvider>
      <Modal
        title="Editar Ingrediente"
        open={visible}
        onCancel={() => {
          form.resetFields();
          onClose();
        }}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <p><strong>{ingrediente?.name}</strong></p>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="quantity"
            label="Cantidad"
            rules={[{ required: true, message: 'Introduce la cantidad' }]}
          >
            <InputNumber min={0} max={1000} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unidad"
            rules={[{ required: true, message: 'Selecciona una unidad' }]}
          >
            <Select placeholder="Unidad">
              {unidades.map((unidad) => (
                <Select.Option key={unidad.Id_Unidad_Medida} value={unidad.Id_Unidad_Medida}>
                  {unidad.Unidad_Medida}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default EditarIngredienteModal;
