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

// Ensure this interface correctly reflects the structure you receive from the backend
interface alimentos {
  Id_Alimento: number;
  Alimento: string;
  Activo: number;
  Es_Perecedero: number;
  // Add any other properties your backend sends for a single alimento fetch (alUn)
  Fecha?: string; // Optional, as it might not be present if not perecedero or if null
  Nombre: string; // The backend seems to return 'Nombre' for the specific item
  Cantidad: number;
  id_unidad: number;
  id_tipo: number;
  EsPerecedero: number; // The backend seems to use this for the single item fetch
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
  const [alimentos, setAlimentos] = useState<any[]>([]); // This holds the list of all available foods
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [esNuevo, setEsNuevo] = useState(false);
  const [esPerecedero, setEsPerecedero] = useState<boolean | undefined>(undefined);
  const [imagen, setImagen] = useState<File | null>(null);
  const [currentAlimentoData, setCurrentAlimentoData] = useState<alimentos | null>(null); // To store the full data of the currently edited/selected alimento
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
        alimento.Alimento.toLowerCase().includes(searchTerm.toLowerCase()) : true
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
      obtenerAlimento(); // Call to fetch specific food data if stockId exists
    }
  }, [visible, stockId]);

  const obtenerAlimento = async () => {
    if (!stockId) {
        // If no stockId, it's a new item creation flow
        setCurrentAlimentoData(null);
        setEsNuevo(true); // Default to new if no stockId
        setEsPerecedero(undefined); // Reset perecedero state
        form.resetFields(); // Clear form for new entry
        setSearchTerm(""); // Clear search term for new entry
        return;
    }
    try {
      const response = await axios.get(`${PUERTO}/alUn/${stockId}`);
      const alimentoData = response.data;
      console.log("Datos de alimento obtenidos (alUn):", alimentoData);

      // Store the entire fetched alimento data
      setCurrentAlimentoData(alimentoData);
      setEsNuevo(false); // It's an existing item
      setEsPerecedero(alimentoData.EsPerecedero === 1);
      setSearchTerm(alimentoData.Nombre); // Pre-fill the search term

      // Set form values
      form.setFieldsValue({
        name: alimentoData.Nombre,
        expirationDate: alimentoData.Fecha ? moment(alimentoData.Fecha, "YYYY-MM-DD") : null,
        quantity: alimentoData.Cantidad,
        unit: alimentoData.id_unidad,
        type: alimentoData.id_tipo,
      });

    } catch (error) {
      message.error("No se pudo cargar el alimento.");
      console.error("Error fetching individual alimento:", error);
    }
  };

  const pregunta = () => {
    setIsPerecederoModalOpen(false);
    setEsPerecedero(true);
  };

  const preguntaNO = () => {
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
    formData.append('id_stock', stockId ? String(stockId) : '0'); // Always send id_stock

    if (esNuevo) {
      formData.append('nombre', values.name);
      formData.append('tipo', String(values.type));
      formData.append('es_perecedero', esPerecedero ? '1' : '0');
    } else {
      // If it's NOT a new food, we MUST send the Id_Alimento.
      // Use currentAlimentoData.Id_Alimento if it exists, otherwise prompt an error.
      if (currentAlimentoData && currentAlimentoData.Id_Alimento) {
        formData.append('id_alimento', String(currentAlimentoData.Id_Alimento));
      } else {
        message.error("No se pudo obtener el Id_Alimento para actualizar.");
        return;
      }
    }

    formData.append('id_unidad', String(values.unit));
    formData.append('cantidad', String(values.quantity));

    if (esPerecedero && values.expirationDate) {
      formData.append('fecha_caducidad', values.expirationDate.format("YYYY-MM-DD"));
    } else if (stockId && !esPerecedero) {
      formData.append('fecha_caducidad', ''); // Clear date if no longer perecedero
    }

    formData.append('Id_Usuario_Alta', idUsuario.toString());

    if (imagen) {
      formData.append('image', imagen);
    }

    let query = "";
    if (esNuevo) {
      query = "nuevoAlimento"; // For creating a new food and adding to stock
    } else {
      query = "alimento"; // For updating an existing food in stock
      if (esPerecedero) {
        query += "EsPerecedero";
      } else {
        query += "NoPerecedero";
      }
    }

    console.log("Sending formData:", Object.fromEntries(formData.entries())); // For debugging
    console.log(`Sending to: ${PUERTO}/alUn/${query}/${stockId}`);

    try {
      const response = await axios.put(`${PUERTO}/alUn/${query}/${stockId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Producto editado');
      onClose(); // Close modal after successful submission
      form.resetFields(); // Reset form
      setEsNuevo(false); // Reset state
      setEsPerecedero(undefined); // Reset state
      setSearchTerm(""); // Reset search term
      setCurrentAlimentoData(null); // Reset current alimento data
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

  const handleFinish = (values: any) => {
    handleSubmit(values);
  };

  const handleClose = () => {
    onClose();
    setEsNuevo(false);
    setEsPerecedero(undefined);
    setSearchTerm("");
    setCurrentAlimentoData(null); // Reset current alimento data on close
    form.resetFields();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorder: '#3E7E1E',
          colorBgContainer: '#CEFF77',
          colorText: '#244C24',
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
                  console.log("Alimento existente seleccionado del dropdown:", alimentoSeleccionado);
                  // When an existing food is selected from the dropdown, update currentAlimentoData
                  setCurrentAlimentoData(alimentoSeleccionado);
                  setEsNuevo(false);
                  setEsPerecedero(alimentoSeleccionado.Es_Perecedero === 1);
                } else {
                  console.log("Detectado nuevo alimento:", newValue);
                  setEsNuevo(true);
                  setCurrentAlimentoData(null); // No Id_Alimento yet for new food
                  setIsPerecederoModalOpen(true);
                }
              }}
              filterOption={false}
            />
          </Form.Item>

          {/* Rest of your form items (expirationDate, quantity, unit, type, imgsrc) remain the same */}
          {esPerecedero !== undefined && (
            <Form.Item name="expirationDate" label="Fecha de caducidad"
            rules={[
              {required: esPerecedero, message: 'Introduce la fecha de caducidad',},
              ]}>
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder="Selecciona una fecha"
                disabled={!esPerecedero}
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
          <Button type="primary" onClick={pregunta}>
            Sí
          </Button>
          <Button onClick={preguntaNO}>No</Button>
        </Space>
      </Modal>
    </ConfigProvider>
  );
};

export default ProductModal;