import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import SyncedInputs from "./Componentes/SyncedInput";
import Ingredientes from './Componentes/IngredientesRecetaEditar';
import { useSearchParams } from "react-router-dom";
import { Button, Select, Input, Form, TimePicker, Upload, InputNumber, message, ConfigProvider } from "antd";
import Proceso from './Componentes/ProcedimientoEditar';
import PUERTO from "../config";
import axios from "axios";
import def from '../Img/defRec.png';
import btCom from '../Img/btCompartir.png';
import './Estilos/EDrec.css';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
}

export default function EDreceta() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [form] = Form.useForm();
  const [Tipos, setTipos] = useState<Tipo[]>([]);
  const [formData, setFormData] = useState({
    Nombre: '',
    Imagen: def,
    Tiempo: dayjs('00:00:00', 'HH:mm:ss'),
    id_Tipo: '',
    Porciones: 1,
    Calorias: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 655);
      setIsTablet(width > 655 && width <= 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const response = await axios.get(`${PUERTO}/tipoC`);
        setTipos(response.data);
      } catch {
        message.error("No se pudieron cargar los tipos.");
      }
    };

    const datosReceta = async () => {
      try {
        const response = await axios.get(`${PUERTO}/recetaCRUD/${id}`);
        const receta = response.data[0];
        setFormData({
          Nombre: receta.Nombre || '',
          Imagen: receta.Imagen?.startsWith("http")
            ? receta.Imagen
            : `${PUERTO}${receta.Imagen}`,
          Tiempo: dayjs(receta.Tiempo, 'HH:mm:ss'),
          id_Tipo: receta.id_Tipo || '',
          Porciones: receta.Porciones || 1,
          Calorias: receta.Calorias || 0,
        });
      } catch {
        message.error("Error al cargar la receta.");
      }
    };

    obtenerTipos();
    datosReceta();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${PUERTO}/recetaCRUD/${id}`, formData);
      if (response.status === 200) message.success("Receta actualizada.");
    } catch {
      message.error("No se pudo actualizar la receta.");
    }
  };

  const handleUpload = {
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Solo se permiten imágenes.");
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        setFormData((prev) => ({ ...prev, Imagen: reader.result as string }));
      return false;
    },
  };

  return (
    <div className="todo">
      <Form form={form} onFinish={handleSubmit}>
        <div className="receta">
          {(isMobile || isTablet) && (
            <div className="rect">
              <div className="nRecCom">
                <ConfigProvider
                  theme={{
                    token: { fontFamily: "Jomhuria, Serif", fontSize: 35, colorText: "#8BA577" },
                  }}
                >
                  <SyncedInputs
                    variant="borderless"
                    className="nRec"
                    placeholder1="receta"
                    value={formData.Nombre}
                    onChange={(value) => setFormData((prev) => ({ ...prev, Nombre: value }))}
                  />
                  <Button className="btImg">
                    <img src={btCom} className="imgCom" />
                  </Button>
                </ConfigProvider>
              </div>
              <div className="divEnviarReset">
                <Button htmlType="submit" className="btEn">
                  Enviar
                </Button>
              </div>
            </div>
          )}
          <div className="f1">
            <div className="imgDiv">
              <img src={formData.Imagen} alt="Receta" />
              <Upload {...handleUpload}>
                <Button className="btUp" icon={<UploadOutlined />} />
              </Upload>
            </div>
            <div className="ttpcDiv">
              <div className="tiempo">
                <p className="txt">Tiempo:</p>
                <TimePicker
                  value={formData.Tiempo}
                  onChange={(time) =>
                    setFormData((prev) => ({ ...prev, Tiempo: time || prev.Tiempo }))
                  }
                  className="time"
                />
              </div>
              <div className="tipo">
                <p className="txi">Tipo:</p>
                <Select
                  placeholder="Seleccione un tipo"
                  value={formData.id_Tipo}
                  onChange={(value) => setFormData((prev) => ({ ...prev, id_Tipo: value }))}
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
                  min={1}
                  max={100}
                  value={formData.Porciones}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, Porciones: value || 1 }))
                  }
                />
              </div>
              <div className="calorias">
                <p className="txc">Calorías:</p>
                <InputNumber
                  min={1}
                  max={10000}
                  value={formData.Calorias}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, Calorias: value || 0 }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="f2">
            {!isMobile && !isTablet && (
              <div className="rect">
                <div className="nRecCom">
                  <ConfigProvider
                    theme={{
                      token: { fontFamily: "Jomhuria, Serif", fontSize: 35, colorText: "#8BA577" },
                    }}
                  >
                    <SyncedInputs
                      variant="borderless"
                      className="nRec"
                      placeholder1="receta"
                      value={formData.Nombre}
                      onChange={(value) => setFormData((prev) => ({ ...prev, Nombre: value }))}
                    />
                    <Button className="btImg">
                      <img src={btCom} className="imgCom" />
                    </Button>
                  </ConfigProvider>
                </div>
                <div className="divEnviarReset">
                  <Button htmlType="submit" className="btEn">
                    Enviar
                  </Button>
                </div>
              </div>
            )}
            <Ingredientes recetaId={Number(id)} />
          </div>
          <div className="f3">
            <Proceso recetaId={Number(id)} />
          </div>
        </div>
      </Form>
    </div>
  );
}
