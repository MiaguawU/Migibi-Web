import React, { useState, useEffect } from 'react';
import { Modal, Form, Space, Button, DatePicker, InputNumber, Select, ConfigProvider, Upload, message, UploadProps, notification } from 'antd';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import PUERTO from "../../config";
import moment from 'moment';

const { Option } = Select;

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  stockId: number | null;
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



const ProductModal: React.FC<FormModalProps> = ({ visible, onClose, stockId }) => {
  const [form] = Form.useForm();
  const [Tipos, setTipos] = useState<Tipo[]>([]);  
  const [Unidades, setUnidad] = useState<Unidad[]>([]); 
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Para la búsqueda
  const [esNuevo, setEsNuevo] = useState(false);
  const [esPerecedero, setEsPerecedero] = useState<boolean | undefined>(undefined);
  const [imagen, setImagen] = useState<File | null>(null);
  const [alimento, setAlimento] = useState<any | null>(null);
  const [isPerecederoModalOpen, setIsPerecederoModalOpen] = useState(false);

  const props: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(`${file.name} no es un archivo de imagen válido.`);
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === "done" || info.file.status === "uploading") {
        setImagen(info.file.originFileObj || null);
      }
    },
  };
  
  const filteredOptions = alimentos
    .filter((alimento) => 
      typeof searchTerm === "string" ? 
       alimento.Alimento.toLowerCase().includes(searchTerm.toLowerCase()) : () => {}
    )
    .map((alimento) => ({
      value: alimento.Alimento,
      label: alimento.Alimento,
    }));

  const obtenerTipos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/tipoA`);
      setTipos(response.data);
    } catch {
      message.error("No se pudieron cargar los tipos.");
    }
  }

  const obtenerUnidad = async () => {
    try {
      const response = await axios.get(`${PUERTO}/unidad`);
      setUnidad(response.data);
    } catch {
      message.error("No se pudieron cargar las unidades.");
    }
  };

  const fetchAlimentos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/cat_ali/nombres`);
      const alimentosData = response.data;
      setAlimentos(alimentosData);
    } catch (error) {
      message.error("Error al obtener los alimentos.");
    }
  };

  useEffect(() => {
    if (visible) {
      obtenerTipos();
      obtenerUnidad();
      fetchAlimentos();
      obtenerAlimento();
    }
  }, [visible, stockId]);

  const obtenerAlimento = async () => {
    if (!stockId) return;
    try {
      const response = await axios.get(`${PUERTO}/alUn/${stockId}`);
      const alimento = response.data;
      setEsPerecedero(alimento.EsPerecedero === 1);
      console.log(esPerecedero);
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
  
  const pregunta = (isPerecedero: boolean) => {
    setIsPerecederoModalOpen(false);
    setEsPerecedero(true);
  };

  const preguntaNO = (isPerecedero: boolean) => {
    setIsPerecederoModalOpen(false);
    setEsPerecedero(false);
    form.setFieldsValue({ expirationDate: null });  // Asegura que la fecha esté vacía
    //form.submit();
  };
  
  const handleSubmitOriginal = async (values: any) => {

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
    formData.append('fecha_caducidad', values.expirationDate ? values.expirationDate.format("YYYY-MM-DD") : '');
    formData.append('Id_Usuario_Alta', currentUser);

    if (values.imgsrc && values.imgsrc.file) {
      formData.append('image', values.imgsrc.file.originFileObj);
    }

    try {
      const response = await axios.put(`${PUERTO}/alimento/${stockId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      notification.success({
        message: 'Guardado correctamente',
        description: 'El producto ha sido actualizado con éxito.',
        placement: 'topRight',
        duration: 3,
      });
      form.resetFields();
    } catch (error: any) {
      console.error("Error en la solicitud:", error);
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          message.error(error.response.data.error);
        } else {
          message.error(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else {
        message.error('Error de conexión con el servidor.');
      }
    }
  };
  
  const handleSubmit = async (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }
    const idUsuario = Number(currentUser);

    const formData = new FormData();
    formData.append('id_stock', stockId? String(stockId) : '0');
    if (esNuevo) { formData.append('nombre', values.name); } else { formData.append('id_alimento', alimento? String(alimento.Id_Alimento) : '0'); }
    if (esNuevo) { formData.append('tipo', String(values.type)); }
    formData.append('id_unidad', String(values.unit)); // AntD Select retorna string, pero multer lo maneja como string
    formData.append('cantidad', String(values.quantity));
    if (esPerecedero) { formData.append('fecha_caducidad', values.expirationDate); }
    formData.append('Id_Usuario_Alta', idUsuario.toString()); // Siempre enviar como string en formData
    if (imagen) { formData.append('image', imagen); }

    let query = "";
    esNuevo ? query+= "nuevoAlimento" : query+= "alimento";
    esPerecedero ? query+= "EsPerecedero" : query+= "NoPerecedero";
    console.log(formData);
    let response;
    try {
      response = await axios.put(`${PUERTO}/alUn/${query}/${stockId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Producto editado');
  
      form.resetFields();
    } catch (error: any)  {
      console.error("Error en la solicitud:", error);

      // Verificar si el backend envió un mensaje de error
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          message.error(error.response.data.error); // Muestra el mensaje de error del backend
        } else {
          message.error(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else {
        message.error('Error de conexión con el servidor.');
      }}
  };

  const handleFinish = (values: any) => {
    handleSubmit(values);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setEsNuevo(false);
    setEsPerecedero(undefined);
    form.resetFields();
  };

  return (
      <ConfigProvider
        theme={{
          token: {
          colorBorder: '#3E7E1E',
          },
          components: {
            Form: {
              labelRequiredMarkColor: 'white',
            },
          },
        }}
      >
      <Modal
        title={"Editar Producto"}
        visible={visible}
        onCancel={handleClose}
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
            label="Alimento"
            rules={[{ required: true, message: 'Por favor, introduce el nombre del alimento.' }]}
          >
            <Select
              mode="tags"
              maxCount={1}
              showSearch
              style={{borderColor: "white"}}
              placeholder="Buscar o escribir alimento"
              options={filteredOptions}
              value={searchTerm ? [searchTerm] : []}
              onSearch={(value) => setSearchTerm(value)}
              onChange={(value) => {
                const newValue = Array.isArray(value) ? value[0] : value;

                setSearchTerm(newValue);
                form.setFieldsValue({ name: newValue });

                if (typeof newValue !== "string") return;

                const alimentoSeleccionado = alimentos.find(
                  (al) =>
                    al.Alimento.toLowerCase().trim() === newValue.toLowerCase().trim()
                );

                if (alimentoSeleccionado) {
                  console.log("Alimento existente:", alimentoSeleccionado);
                  setAlimento(alimentoSeleccionado)
                  setEsNuevo(false);
                  setEsPerecedero(alimentoSeleccionado.Es_Perecedero === 1);
                } else {
                  setEsNuevo(true);
                  setIsPerecederoModalOpen(true);
                }
              }}
              filterOption={false}
            />
          </Form.Item>
          
        {esPerecedero && (
          <Form.Item name="expirationDate" label="Caducidad" 
          rules={[
            {required: esPerecedero, message: 'Introduce la fecha de caducidad',},
            ]}>
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Selecciona una fecha"
            />
          </Form.Item>
          )}


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

          {esNuevo && (
            <Form.Item
              name="type"
              label="Tipo"
              rules={[{ required: esNuevo, message: 'Por favor, selecciona el tipo de alimento' }]}
            >
              <Select placeholder="Selecciona el tipo de alimento">
                {Tipos.map((tipo) => (
                  <Option key={tipo.Id_Tipo_Alimento} value={tipo.Id_Tipo_Alimento}>
                    {tipo.Tipo_Alimento}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

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
      <Modal
          title="¿Es perecedero?"
          visible={isPerecederoModalOpen}
          onCancel={() => setIsPerecederoModalOpen(false)}
          footer={null}
        >
          <p>Confirma si el producto es perecedero.</p>
          <Space size="small">
            <Button type="primary" onClick={() => pregunta(true)}>
              Sí
            </Button>
            <Button onClick={() => preguntaNO(false)}>No</Button>
          </Space>
        </Modal>
    </ConfigProvider>
  );
};

export default ProductModal;
