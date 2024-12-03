import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Ingredientes from './Componentes/IngredientesRecetaEditar';
import { useSearchParams } from "react-router-dom";
import type { UploadProps } from 'antd';
import { Button, Select, Input, Tooltip, Form, TimePicker, Upload, InputNumber, message } from "antd";
import Proceso from './Componentes/ProcedimientoEditar';
import PUERTO from "../config";
import axios from "axios";
import def from '../Img/defRec.png';
import btCom from '../Img/btCompartir.png';
import './Estilos/EDrec.css';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
}

function getBase64(file: File, callback: (url: string) => void) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result as string);
  reader.onerror = (error) => message.error("Error al procesar la imagen.");
}

export default function EDreceta() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [form] = Form.useForm();
  const [Tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    Nombre: string;
    Imagen: string;
    Tiempo: Dayjs | null;
    id_Tipo: string | number;
    Porciones: number;
    Calorias: number;
  }>({
    Nombre: '',
    Imagen: def,
    Tiempo: dayjs('00:00:00', 'HH:mm:ss'),
    id_Tipo: '',
    Porciones: 1,
    Calorias: 0,
  });

  const uploadProps = {
    showUploadList: false, // No mostrar la lista de archivos
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Solo puedes subir archivos de imagen.");
        return false;
      }
      getBase64(file, (url) => setFormData((prev) => ({ ...prev, Imagen: url })));
      return false; // Evitar la subida automática
    },
  };

  // Obtener tipos de consumo
  const obtenerTipos = async () => {
    try {
      const response = await axios.get(`${PUERTO}/tipoC`, {
        headers: { "Content-Type": "application/json" },
      });
      if(response){
        setTipos(response.data );
        message.success("Tipos de consumo cargados correctamente.");
        console.log("Tipos recibidos:", response.data);
      }
      else{
        message.error("No hay datos en los tipos");
      }
      
    } catch (error) {
      console.error("Error al cargar tipos:", error);
      message.error("No se pudo cargar los tipos.");
    }
  };

  // Obtener datos de la receta
  const datosReceta = async () => {
    setLoading(true);
    try {
      if (!id) {
        message.warning("No se encontró el id de la receta.");
        return;
      }
      const response = await axios.get(`${PUERTO}/recetaCRUD/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.length > 0) {
        const receta = response.data[0];
        setFormData({
          Nombre: receta.Nombre || '',
          Imagen: receta.Imagen?.startsWith("http")
            ? receta.Imagen
            : `${PUERTO}${receta.Imagen}`,
          Tiempo: dayjs(receta.Tiempo, 'HH:mm:ss').isValid()
            ? dayjs(receta.Tiempo, 'HH:mm:ss')
            : dayjs('00:00:00', 'HH:mm:ss'),
          id_Tipo: receta.id_Tipo || '',
          Porciones: receta.Porciones || 1,
          Calorias: receta.Calorias || 0,
        });
        message.success("Receta obtenida");
      } else {
        message.warning("No se encontró información de la receta.");
      }
    } catch (error) {
      console.error("Error al obtener receta:", error);
      message.error("No se pudo cargar la receta.");
    } finally {
      setLoading(false);
    }
  };

  // Inicialización del componente
  useEffect(() => {
    datosReceta();
    obtenerTipos();
  }, []);

  // Manejar cambios en el Select
  const handleSelectChange = (value: string | number) => {
    setFormData((prev) => ({ ...prev, id_Tipo: value }));
  };

  // Manejar cambios en el TimePicker
  const handleTimeChange = (time: Dayjs | null) => {
    if (time && time.isValid()) {
      setFormData((prev) => ({ ...prev, Tiempo: time }));
    } else {
      message.error("Formato de tiempo inválido.");
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${PUERTO}/recetaCRUD/${id}`, formData);
      if (response.status === 200) {
        message.success("Receta actualizada correctamente.");
      } else {
        message.warning("No se pudo actualizar la receta.");
      }
    } catch (error) {
      console.error("Error al actualizar receta:", error);
      message.error("Hubo un problema al enviar los datos.");
    }
  };

  // Resetear el formulario
  const onReset = () => {
    datosReceta();
    obtenerTipos();
  };

  return (
    <div className="todo">
      <Form form={form} onFinish={handleSubmit}>
        <div className="receta">
          <div className="f1">
            <div className="imgDiv">
              <img src={formData.Imagen} alt="Receta" style={{
                  maxHeight: '400px',
                  maxWidth: '300px',
                  border: '1px solid #3E7E1E',
                  borderRadius: '10px' 
                }}/>
              <Upload {...uploadProps}>
                <Button className="btUp" icon={<UploadOutlined />}></Button>
              </Upload>
            </div>
            <div className="ttpcDiv">
              <div className="tiempo">
                <p className="txt">Tiempo:</p>
                <TimePicker
                  value={formData.Tiempo}
                  className="time"
                  onChange={handleTimeChange}
                  placeholder="Seleccione tiempo"
                />
              </div>
              <div className="tipo">
                <p className="txi">Tipo:</p>
                <Select
                  placeholder="Seleccione un tipo"
                  value={formData.id_Tipo}
                  onChange={handleSelectChange}
                  style={{ width: 200 }}
                >
                  {Tipos.map((tipo) => (
                    <Option key={tipo.Id_Tipo_Consumo} value={tipo.Id_Tipo_Consumo}>
                      {tipo.Tipo_Consumo}
                    </Option>
                  ))}
                </Select>

              </div>
              <div className="porciones">
                <p className="txp">Porciones:</p>
                <InputNumber
                  className="nP"
                  min={1}
                  max={100000}
                  value={formData.Porciones}
                  onChange={(value) =>
                    setFormData({ ...formData, Porciones: value || 1 })
                  }
                />
              </div>
              <div className="calorias">
                <p className="txc">Calorías:</p>
                <InputNumber
                  className="nC"
                  min={1}
                  max={100000}
                  value={formData.Calorias}
                  onChange={(value) =>
                    setFormData({ ...formData, Calorias: value || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <div className="f2">
            <h2>{formData.Nombre}</h2>
            <Button type="primary" htmlType="submit" className="btEn">
              Enviar
            </Button>
            <Button htmlType="button" onClick={onReset} className="btEn2">
              Reset
            </Button>
          </div>
          <div className="f3">
            <Ingredientes recetaId={Number(id)} />
            <Proceso  recetaId={Number(id)} />
          </div>
        </div>
      </Form>
    </div>
  );
}
