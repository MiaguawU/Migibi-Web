import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';
import PorCaducar from './Componentes/PorCaducar';
import { AutoComplete, Input, Button, ConfigProvider, Card, Space, Tooltip, message, Spin } from 'antd';
import { CameraOutlined, WarningOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface CardData {
  ingrediente: string;
  cantidad: number;
  abreviatura: string;
  image: string;
  fecha: string;
  diasRestantes: string | number;
  caducidadPasada: boolean | null;
  Tipo: string;
}

export default function Inicio() {
  const [alimentosPerecederos, setAlimentosPerecederos] = useState<CardData[]>([]);
  const [alimentosNoPerecederos, setAlimentosNoPerecederos] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener datos de alimentos
  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/alimento`);
      const { Perecedero, NoPerecedero } = response.data;

      if (Array.isArray(Perecedero) && Array.isArray(NoPerecedero)) {
        const perecederos = Perecedero.map((alimento) => {
          const fechaCaducidad = alimento.Fecha_Caducidad ? new Date(alimento.Fecha_Caducidad) : null;
          const caducidadPasada = fechaCaducidad && fechaCaducidad < new Date();
          const diasRestantes = fechaCaducidad
            ? Math.max(
                0,
                Math.ceil(
                  (fechaCaducidad.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 'No definida';
          const fecha = fechaCaducidad ? fechaCaducidad.toLocaleDateString() : 'Fecha no disponible';

          return {
            ingrediente: alimento.Nombre || ' ',
            cantidad: alimento.Cantidad || 1,
            abreviatura: alimento.Unidad || ' ',
            image: alimento.Imagen ? `${PUERTO}${alimento.Imagen}` : '/imagenes/defIng.png',
            fecha: caducidadPasada ? fecha : `${diasRestantes} días`,
            diasRestantes,
            caducidadPasada,
            Tipo: alimento.Tipo_Alimento,
          };
        });

        const noPerecederos = NoPerecedero.map((alimento) => ({
          ingrediente: alimento.Nombre || ' ',
          cantidad: alimento.Cantidad || 0,
          abreviatura: alimento.Unidad || ' ',
          image: alimento.Imagen ? `${PUERTO}${alimento.Imagen}` : '/imagenes/defIng.png',
          fecha: '🧀',
          diasRestantes: 'No aplica',
          caducidadPasada: false,
          Tipo: alimento.Tipo_Alimento,
        }));

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
      setLoading(false);
    }
  };

  useEffect(() => {
    datosAlimento();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredAlimentos = [...alimentosPerecederos, ...alimentosNoPerecederos].filter((alimento) => {
    const nombre = alimento.ingrediente.toLowerCase();
    const tipo = alimento.Tipo.toLowerCase();
    const cantidad = alimento.cantidad.toString();
    return (
      nombre.includes(searchTerm) ||
      tipo.includes(searchTerm) ||
      cantidad.includes(searchTerm)
    );
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#00b96b',
          borderRadius: 10,
          

          // Alias Token
          colorBgContainer: '#CAE2B5',
      },
      components: {
          Select: {
              optionActiveBg: '#CAE2B5',
              algorithm: true
          }
      }

      }}
    >
      <div style={{ width: '80vw', margin: '10px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input.Search
            size="large"
            placeholder="Buscar ingrediente"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '60%' }}
          />
          <CameraOutlined style={{ fontSize: 30, color: '#3E7E1E' }} />
          <Button style={{ color: '#3E7E1E', backgroundColor: '#CAE2B5' }}>Agregar</Button>
        </div>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />
      ) : (
        <>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '16px' }}>
          <PorCaducar />
            {filteredAlimentos.map((card, index) => (
              <Card
                key={index}
                hoverable
                style={{
                  border: '1px solid #3E7E1E',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <span style={{fontSize: 30, color: '#86A071', fontFamily: 'Jomhuria, sans-serif'}}>

                <img alt={card.image} src={card.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                
                <Meta
                  title={<span style={{ fontSize: '30px', color: '#86A071', fontFamily: 'Jomhuria, sans-serif', fontWeight: 'normal' }}>{card.ingrediente}</span>}
                  description={`${card.cantidad} ${card.abreviatura}`}
                  style={{ marginTop: '10px' }}
                />
                <div style={{ marginTop: '10px', color: card.caducidadPasada ? '#FF4D4F' : '#86A071' }}>
                  {card.fecha}
                </div>
                <Space size="small" style={{ marginTop: '10px' }}>
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
                </span>
              </Card>
            ))}
          </div>
        </>
      )}
    </ConfigProvider>
  );
}
