import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';
import PorCaducar from './Componentes/PorCaducar';
import ProductModal from './Componentes/ProductoRefriModal'; // Importa el modal separado
import { AutoComplete, Input, Button, ConfigProvider, Card, Space, Tooltip, message, Spin } from 'antd';
import { CameraOutlined, WarningOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalEd from './Componentes/AlimentoEditar';

const { Meta } = Card;

interface CardData {
  id: number;
  ingrediente: string;
  cantidad: number;
  abreviatura: string;
  image: string;
  fecha: string;
  diasRestantes: string | number;
  caducidadPasada: boolean | null;
  Tipo: string;
  Activo: number;
  Id_Usuario_Alta: number;
}

export default function Inicio() {
  const [alimentosPerecederos, setAlimentosPerecederos] = useState<CardData[]>([]);
  const [alimentosNoPerecederos, setAlimentosNoPerecederos] = useState<CardData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [edAlimento, setEdAlimento] = useState<number | null>(null);
  

  const agregarAlimento = async () =>{
    setLoading(true);
    try {
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
      const id_alta = currentUser
      const response = await axios.get(`${PUERTO}/usuarios`, {
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Error al obtener usuario:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  const eliminarAlimento = async (id: number) => {
    try {
      const response = await axios.put(`${PUERTO}/alimentoInactivo/${id}`, {
        id: id,
      });

      if (response.status === 200) {
        message.success("Alimento eliminado exitosamente.");
        datosAlimento(); 
      } else {
        message.error("No se pudo eliminar el alimento.");
      }
    } catch (error) {
      console.error("Error al eliminar alimento:", error);
      message.error("Ocurrió un error al intentar eliminar el alimento.");
    }
  };

  const datosAlimento = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        message.warning("No hay un usuario logueado actualmente.");
        setLoading(false);
        return;
      }
  
      const userId = parseInt(currentUser, 10); // Asegurarse de convertir a número
      if (isNaN(userId)) {
        message.error("ID de usuario inválido.");
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`${PUERTO}/alimento/${userId}`);
      const { Perecedero, NoPerecedero } = response.data;
  
      if (Array.isArray(Perecedero) && Array.isArray(NoPerecedero)) {
        const perecederos = Perecedero.filter(
          (alimento) => alimento.Id_Usuario_Alta === userId
        ).map((alimento) => {
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
            id: alimento.id || ' ',
            ingrediente: alimento.Nombre || ' ',
            cantidad: alimento.Cantidad || 1,
            abreviatura: alimento.Unidad || ' ',
            image: alimento.Imagen ? `${PUERTO}${alimento.Imagen}` : '/imagenes/defIng.png',
            fecha: caducidadPasada ? fecha : `${diasRestantes} días`,
            diasRestantes,
            caducidadPasada,
            Tipo: alimento.Tipo_Alimento,
            Activo: alimento.Activo,
            Id_Usuario_Alta: alimento.Id_Usuario_Alta,
          };
        });
  
        const noPerecederos = NoPerecedero.filter(
          (alimento) => alimento.Id_Usuario_Alta === userId
        ).map((alimento) => ({
          id: alimento.id || ' ',
          ingrediente: alimento.Nombre || ' ',
          cantidad: alimento.Cantidad || 0,
          abreviatura: alimento.Unidad || ' ',
          image: alimento.Imagen ? `${PUERTO}${alimento.Imagen}` : '/imagenes/defIng.png',
          fecha: '🧀',
          diasRestantes: 'No aplica',
          caducidadPasada: false,
          Tipo: alimento.Tipo_Alimento,
          Activo: alimento.Activo,
          Id_Usuario_Alta: alimento.Id_Usuario_Alta,
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
      (nombre.includes(searchTerm) ||
        tipo.includes(searchTerm) ||
        cantidad.includes(searchTerm)) &&
      alimento.cantidad > 0 && alimento.Activo > 0
    );
  });  

  
  return (
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
          },
        },
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
          <Button style={{ color: '#3E7E1E', backgroundColor: '#CAE2B5' }} onClick={() => setIsModalOpen(true)}>Agregar</Button>
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
                      <EditOutlined style={{ color: '#6F895A', fontSize: 20 }}  onClick={() => setEdAlimento(card.id)}/>
                    </Tooltip>
                    {typeof card.diasRestantes === 'number' && card.diasRestantes <= 0 && (
                      <Tooltip title="Advertencia">
                        <WarningOutlined style={{ color: '#E09134', fontSize: 20 }} />
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar">
                      <DeleteOutlined  onClick={() => eliminarAlimento(card.id)} style={{ color: '#6F895A', fontSize: 20 }} />
                    </Tooltip>
                  </Space>
                </span>
              </Card>
            ))}
            {/* Modal externo para agregar producto */}
            <ProductModal
              visible={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                datosAlimento(); // Llamar para refrescar los datos después de agregar
              }}
            />
            <ModalEd
              visible={edAlimento !== null}
              onClose={() => {
                setEdAlimento(null);
                datosAlimento(); // Llamar para refrescar los datos después de editar
              }}
              alimentoId={edAlimento}
            />
          </div>
        </>
      )}
    </ConfigProvider>
  );
}