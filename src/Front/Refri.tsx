import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';

import PorCaducar from './Componentes/PorCaducar';
import { AutoComplete, Input, Flex, Button, ConfigProvider, Row, Col, Card, Space, Tooltip, message, Spin } from 'antd';
import { CameraOutlined, WarningOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface CardData {
  ingrediente: string;
  cantidad: number;
  abreviatura: string;
  image: string;
  fecha: string;
  diasRestantes: number | string;
}

export default function Inicio() {
  const options = [
    { value: 'Burns Bay Road' },
    { value: 'Downing Street' },
    { value: 'Wall Street' },
  ];

  const [alimentosPerecederos, setAlimentosPerecederos] = useState<CardData[]>([]);
  const [alimentosNoPerecederos, setAlimentosNoPerecederos] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true); // Para mostrar el indicador de carga

  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/alimento`);
  
      // Validar si las claves esperadas están presentes
      const { Perecedero, NoPerecedero } = response.data;
      if (Array.isArray(Perecedero) && Array.isArray(NoPerecedero)) {
        // Mapear alimentos perecederos
        const perecederos = Perecedero.map((alimento) => {
          const fechaCaducidad = alimento.Fecha_Caducidad
            ? new Date(alimento.Fecha_Caducidad)
            : null;
    
          const diasRestantes = fechaCaducidad
            ? Math.max(
                0,
                Math.ceil(
                  (fechaCaducidad.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 'No definida';
    
          return {
            ingrediente: alimento.Nombre || ' ',
            cantidad: alimento.Cantidad || 1,
            abreviatura: alimento.Unidad || ' ',
            image: alimento.Imagen || ' ',
            fecha: diasRestantes === 'No definida' ? 'Fecha no disponible' : `${diasRestantes} días`,
            diasRestantes, // Guardar los días restantes para comparar después
          };
        });
    
        // Mapear alimentos no perecederos
        const noPerecederos = NoPerecedero.map((alimento) => ({
          ingrediente: alimento.Nombre || ' ',
          cantidad: alimento.Cantidad || 0,
          abreviatura: alimento.Unidad || ' ',
          image: alimento.Imagen || ' ',
          fecha: '🧀', // Default para no perecederos
          diasRestantes: 'No aplica',
        }));
    
        // Actualizar estados
        setAlimentosPerecederos(perecederos);
        setAlimentosNoPerecederos(noPerecederos);
        message.success("Alimentos obtenidos exitosamente");
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error al obtener alimentos", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false); // Al finalizar la carga, se puede mostrar el contenido
    }
  };

  // Ejecutar la función al montar el componente
  useEffect(() => {
    // Esperamos que ambas solicitudes se completen antes de renderizar
    Promise.all([datosAlimento()])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error en las peticiones", error);
        setLoading(false);
      });
  }, []);  // Aquí solo necesitamos un `useEffect`

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00b96b',
            borderRadius: 10,
            colorBgContainer: '#CAE2B5',
          },
          components: {
            Select: {
              optionActiveBg: '#CAE2B5',
              algorithm: true,
            }
          }
        }}
      >
        <div style={{ width: '80vw', alignContent: 'center', marginLeft: '10vw', marginRight: '10vw', marginTop: '10px' }}>
          <Flex align='center' justify='space-evenly'>
            <div>
              <AutoComplete
                style={{ width: "50vw" }}
                options={options}
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                <Input.Search size="large" placeholder="Buscar un ingrediente" />
              </AutoComplete>
            </div>
            <div>
              <CameraOutlined style={{ fontSize: 30, color: '#3E7E1E', backgroundColor: '#EEF6DD' }} />
            </div>
            <div>
              <Button style={{ color: "#3E7E1E", backgroundColor: "#CAE2B5" }}>Agregar</Button>
            </div>
          </Flex>
        </div>
        
        {loading ? (
          <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '16px' }}>
            <PorCaducar />
            {[...alimentosPerecederos, ...alimentosNoPerecederos].map((card, index) => (
              <Card
                key={index}
                hoverable
                style={{
                  border: '1px solid #3E7E1E',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    border: '1px solid #3E7E1E',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img alt={card.ingrediente} src="../Img/biCa.png" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 30,
                      color: '#86A071',
                      fontFamily: 'Jomhuria, sans-serif',
                    }}
                  >
                    {`${card.ingrediente}`}
                    <br />
                    {`${card.cantidad} ${card.abreviatura}`}
                    <br />
                    {card.diasRestantes === 'No definida' ? 'Fecha no disponible' : card.fecha}
                  </span>
                  <Space size="small">
                    <Tooltip title="Editar">
                      <EditOutlined style={{ color: '#6F895A', fontSize: 20 }} />
                    </Tooltip>
                    {typeof card.diasRestantes === 'number' && card.diasRestantes <= 0 && (
                      <Tooltip title="Advertencia">
                        <WarningOutlined style={{ color: '#E09134', fontSize: 20 }} />
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar">
                      <DeleteOutlined style={{ color: '#6F895A', fontSize: 20 }} />
                    </Tooltip>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        )}
        
      </ConfigProvider>
    </>
  );
}
