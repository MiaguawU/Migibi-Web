import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import SyncedInputs from "./Componentes/SyncedInput";
import Ingredientes from './Componentes/IngredientesRecetaEditar';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
import usePreventExit from "./hook/Proteger";
import useBlockNavigation from "./hook/Bloquear";
import useBlockShortcuts from "./hook/BloquearC";

const { Option } = Select;
const { TextArea } = Input;

interface Tipo {
  Id_Tipo_Consumo: number;
  Tipo_Consumo: string;
}

interface id_rec {
  id_r: number;
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
  const navigate = useNavigate();
const location = useLocation();
const [id, setId] = useState<number | null>(null); // Cambiar tipo a número o null
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
    FileImagen?: File;
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

  usePreventExit();
  useBlockNavigation();
  useBlockShortcuts();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Prevenir la recarga o cierre.
    };
  
    const initializeRecipe = async () => {
      await agregar(); // Crear receta al cargar.
      await obtenerId(); // Obtener el ID de la nueva receta.
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    initializeRecipe(); // Ejecutar funciones iniciales.
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  

  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Solo puedes subir archivos de imagen.");
        return false;
      }
      setFormData((prev) => ({ ...prev, Imagen: URL.createObjectURL(file), FileImagen: file })); // Previsualización y guardado del archivo
      return false; // Evitar subida automática
    },
    
  };

  const agregar = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        return;
      }
  
      const id_us = Number(currentUser);
      const response = await axios.post(`${PUERTO}/RecetaGeneral/${id_us}`, {}, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        message.success("Receta creada correctamente.");
      } else {
        message.error("Error al crear la receta.");
      }
    } catch (error) {
      console.error("Error al crear la receta:", error);
      message.error("No se pudo conectar al servidor.");
    }
  };
  

  const obtenerId = async () => {
    try {
      const response = await axios.get(`${PUERTO}/agReceta`, {
        headers: { "Content-Type": "application/json" },
      });
      
      console.log("Respuesta del servidor:", response);  // Aquí puedes ver qué datos están llegando
      
      if (response.status === 200 && response.data?.id) {
        const newId = response.data.id; // Verifica la estructura de la respuesta
        setId(newId);  // Guarda el id en el estado
        console.log("ID de nueva receta:", newId);
      } else {
        message.error("No se pudo obtener el ID de la receta.");
      }
    } catch (error) {
      console.error("Error al obtener el ID:", error);
      message.error("No se pudo conectar al servidor.");
    }
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

  

  
  

  // Inicialización del componente
  useEffect(() => {
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
      if (id === null) {
        message.warning("No se encontró el ID de la receta.");
        return; // Salir si no hay id
      }
  
      const datosForm = new FormData();
      datosForm.append("nombre", formData.Nombre || ""); 
      datosForm.append("tiempo", formData.Tiempo?.format("HH:mm:ss") || "");
      datosForm.append("porciones", String(formData.Porciones));
      datosForm.append("calorias", String(formData.Calorias));
      datosForm.append("id_tipo_consumo", String(formData.id_Tipo));
      if (formData.FileImagen) {
        datosForm.append("imagen", formData.FileImagen); // Solo añade la imagen si existe
      }
  
      // Enviar la solicitud PUT con el id en la URL
      const response = await axios.put(
        `${PUERTO}/recetaCRUD/${id}`, // Usa el ID directamente en la URL
        datosForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      if (response.status === 200) {
        message.success("Receta actualizada correctamente.");
        setRecetaInicial((prev) => ({ ...prev, Imagen: formData.Imagen })); // Actualiza la receta inicial si es necesario
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
    obtenerTipos(); // Recargar tipos de consumo
    setResetTrigger((prev) => !prev); // Cambiar trigger para componentes dependientes
  };

  const onSubmit = async () => {
    if (id === null) {
      message.error("No se ha encontrado el ID de la receta.");
      return;
    }
    await actualizar();
    setenviarDatos((prev) => !prev); // Esto probablemente asegura que el componente Ingredientes se refresque.
  };
  
  useEffect(() => {
    if (id !== null) {
      // Aquí ya puedes llamar a la función actualizar
      actualizar();
    } else {
      message.error("No se ha obtenido el ID.");
    }
  }, [id]);  // Asegúrate de que se ejecute solo cuando id cambie.
  
  
  
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
              <img
                  src={formData.Imagen || def}
                  alt="Receta"
                  style={{
                    maxHeight: '400px',
                    maxWidth: '300px',
                    border: '1px solid #3E7E1E',
                    borderRadius: '10px',
                  }}
                />

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
                <div className="tipo" style={{padding:'10px'}}>
                  <p className="txi">Tipo:</p>
                  <Select
                    placeholder="Seleccione un tipo"
                    value={formData.id_Tipo}
                    onChange={handleSelectChange}
                    style={{ width: 150 }}
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
              <Ingredientes recetaId={id ?? 0} onSubmit={enviarDatos} onReset={resetTrigger} />
                { (isMobile || isTablet) && (
                <div className='proceso'>
                  <Proceso recetaId={Number(id)} />

                </div>
                )}
              </div>
            </div>
            <div className='f3'>
              {!isMobile && !isTablet && (
              <div className='proceso'>
                <Proceso recetaId={id ?? 0} onSubmit={enviarDatos} onReset={resetTrigger} />
              </div>
              )}
            </div>
          
          </div>
        </Form>
      </div>
  );
};

  

  
