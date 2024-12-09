import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import SyncedInputs from "./Componentes/SyncedInput";
import Ingredientes from './Componentes/IngredientesRecetaEditar';
import { useSearchParams } from "react-router-dom";
import type { UploadProps } from 'antd';
import type { InputNumberProps } from 'antd';
import { Button, Select, Input, Tooltip, Form, TimePicker, Upload, InputNumber, message, ConfigProvider } from "antd";
import Proceso from './Componentes/ProcedimientoEditar';
import NumericInput from './Componentes/NumberInput';
import PUERTO from "../config";
import axios from "axios";
import def from '../Img/defRec.png';
import btEd from '../Img/btEditar.png';
import btCom from '../Img/btCompartir.png';
import './Estilos/EDrec.css';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
}

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value);
};

function getBase64(file: File, callback: (url: string) => void) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => callback(reader.result as string);
  reader.onerror = (error) => message.error("Error al procesar la imagen.");
}

const props: UploadProps = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
  previewFile(file) {
    console.log('Your upload file:', file);
    return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
      method: 'POST',
      body: file,
    })
      .then((res) => res.json())
      .then(({ thumbnail }) => thumbnail);
  },
};

export default function EDreceta() {
  const [syncedValue1, setSyncedValue1] = useState("Valor inicial 1");
  const [syncedValue2, setSyncedValue2] = useState("Valor inicial 2");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [form] = Form.useForm();
  const [Tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [enviarDatos, setenviarDatos] = useState(false);
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

  const [recetaInicial, setRecetaInicial] = useState({
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
        const recetaCargada = {
          Nombre: receta.Nombre || '',
          Imagen: receta.Imagen?.startsWith("http")
            ? receta.Imagen
            : `${PUERTO}${receta.Imagen}`,
          Tiempo: receta.Tiempo ? dayjs(receta.Tiempo, 'HH:mm:ss') : dayjs(), // Valor por defecto
          id_Tipo: receta.id_Tipo || '',
          Porciones: receta.Porciones || 1,
          Calorias: receta.Calorias || 0,
        };
        
        setFormData(recetaCargada);        
        setRecetaInicial(recetaCargada); // Guardar datos iniciales
        message.success("Receta obtenida correctamente.");
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
  }, [id]);
  

  const handleSyncedChange = (value: string) => {
    console.log("Nuevo valor para Nombre:", value);
    setFormData((prevData) => ({
      ...prevData,
      Nombre: value,
    }));
  };
  

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

 
  const actualizar = async () => {
    try {
      if (!id) {
        message.warning("No se encontró el id de la receta.");
        return;
      }
  
      const datosAEnviar = {
        nombre: formData.Nombre,
        tiempo: formData.Tiempo?.format('HH:mm:ss') || null,
        porciones: formData.Porciones || 1, // En minúscula
        calorias: formData.Calorias || 0,
        id_tipo_consumo: formData.id_Tipo || '',
        imagen: formData.Imagen || def,
      };
      
      
      const response = await axios.put(`${PUERTO}/recetaCRUD/${id}`, datosAEnviar);
  
      if (response.status === 200) {
        message.success("Receta actualizada correctamente.");
      } else {
        message.error("No se pudo actualizar la receta.");
      }
    } catch (error) {
      console.error("Error al actualizar receta:", error);
      message.error("Hubo un problema al enviar los datos.");
    }
  };
  
  

  
  const { TextArea } = Input;

  const [value, setValue] = useState('');
  
  const [inputValue, setInputValue] = useState<string>("");

  // Función para actualizar el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onReset = () => {
    datosReceta(); // Recargar receta
    obtenerTipos(); // Recargar tipos de consumo
    setResetTrigger((prev) => !prev); // Cambiar trigger para componentes dependientes
  };

  const onSubmit = async () => {
    await actualizar();
    setenviarDatos((prev) => !prev); 
  };
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  
  useEffect(() => {
      
    const handleResize = () => {
      const width = window.innerWidth;

      // Configuración de estado para móvil y tablet
      setIsMobile(width <= 655);
      setIsTablet(width > 655 && width <= 900);
    };

    handleResize(); // Ejecuta al cargar
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    return (
      <div className='todo'>
        <Form  form={form} >
          <div className='receta'>
              { (isMobile || isTablet) && (
              <div className='rect'>
                <div className='nRecCom'>
                  <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: "Jomhuria, Serif",
                        fontSize: 35,
                        colorText: "#8BA577",
                      },
                    }}
                  >
                    <SyncedInputs
                        variant="borderless"
                        className="nRec"
                        placeholder1="receta"
                        value={formData.Nombre}
                        onChange={handleSyncedChange}
                      />

                    <Button className='btImg' ><img src={btCom} className='imgCom'/></Button>
                  </ConfigProvider>
                </div>
                <div className='divEnviarReset'>
                <Button htmlType="button" className='btEn' onClick={onSubmit}>
                      <p className='tx2'>Enviar</p>
                    </Button>

                  <Button htmlType="button" onClick={onReset} className='btEn2' ><p className='tx2'>Reset</p></Button>
                </div>
              </div>
              )}
            
            <div className='f1'>
              <div className='imgDiv'>
                <img src={formData.Imagen} alt='Receta'/> 
                {/*style={{
                  maxHeight: '400px',
                  maxWidth: '300px',
                  border: '1px solid #3E7E1E',
                  borderRadius: '10px' 
                }}/>de Isis*/}
                <Upload {...uploadProps}>{/*...props de Nisa*/}
                  <Button className='btUp' icon={<UploadOutlined />}></Button>
                </Upload>
              </div>
              <div className = 'ttpcDiv'>
                <div className='tiempo'>
                  <p className='txt'>Tiempo:</p>
                  <TimePicker 
                  value = {formData.Tiempo}
                  onChange={handleTimeChange}
                  minuteStep={15}
                  secondStep={10} 
                  hourStep={1} 
                  className='time' 
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
                <div className='porciones'>
                  <p className='txp'>Porciones:</p>    
                  <InputNumber 
                    className="nP"
                    min={1}
                    max={100000}
                    value={formData.Porciones}
                    onChange={(value) =>
                      setFormData({ ...formData, Porciones: value || 1 })
                    }
                    defaultValue={3} />
                </div>
                <div className='calorias'>
                  <p className='txc'>Calorias:</p>
                  <InputNumber 
                    className="nC"
                    min={1}
                    defaultValue={3}
                    max={100000}
                    value={formData.Calorias}
                    onChange={(value) =>
                      setFormData({ ...formData, Calorias: value || 0 })
                    }/>
                   
                </div>
              </div>
            </div>
            <div className='f2'>
              {!isMobile && !isTablet && (
              <div className='rect'>
                <div className='nRecCom'>
                  <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: "Jomhuria, Serif",
                        fontSize: 35,
                        colorText: "#8BA577",
                      },
                    }}
                  >
                    <SyncedInputs variant="borderless" className="nRec" placeholder1='receta' value={formData.Nombre} onChange={handleSyncedChange}/>
                    <Button className='btImg' ><img src={btCom} className='imgCom'/></Button>
                  </ConfigProvider>
                </div>
                <div className='divEnviarReset'>
                  <Button htmlType="submit"  className='btEn' onClick={onSubmit}><p className='tx2'>Enviar</p></Button>
                  <Button htmlType="button" onClick={onReset} className='btEn2' ><p className='tx2'>Reset</p></Button>
                </div>
              </div>
              )}
              <div className='ing'>
                <Ingredientes  recetaId={Number(id)} />
                { (isMobile || isTablet) && (
                <div className='proceso'>
                  <Proceso  recetaId={Number(id)} />
                </div>
                )}
              </div>
            </div>
            <div className='f3'>
              {!isMobile && !isTablet && (
              <div className='proceso'>
                <Proceso recetaId={Number(id)} onSubmit={enviarDatos} onReset={resetTrigger} />
              </div>
              )}
            </div>
          
          </div>
        </Form>
      </div>
  );
};

  
  