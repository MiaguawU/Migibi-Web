import React, { useState, useEffect } from 'react';
import './Estilos/Recetas.css';
import { customColors } from './Estilos/colores';
import axios from 'axios';
import PUERTO from '../config';
import PorCaducar from './Componentes/PorCaducar';
import ProductModal from './Componentes/AlimentoAgregar';
import { AutoComplete, Input, Button, ConfigProvider, Card, Space, Tooltip, message, Spin } from 'antd';
import { CameraOutlined, WarningOutlined, DeleteOutlined, EditOutlined, MinusSquareOutlined } from '@ant-design/icons';
import ModalEd from './Componentes/AlimentoEditar';
import ModalCon from './Componentes/AlimentoConsumir';import { notification } from 'antd';
import guardadoImg from '../assets/Guardado.png'; // Asegúrate que esté ahí

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
  const [conAlimento, setConAlimento] = useState<number | null>(null);

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

      const userId = parseInt(currentUser, 10);
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
            ? Math.max(0, Math.ceil((fechaCaducidad.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
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
        console.log("Alimentos obtenidos exitosamente");
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
      (nombre.includes(searchTerm) || tipo.includes(searchTerm) || cantidad.includes(searchTerm)) &&
      alimento.cantidad > 0 && alimento.Activo > 0
    );
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 10,
          colorBgContainer: customColors.colorBgTarjeta,
        },
      }}
    >
    <div className="recetas-container" style={{ color: '#244C24' }}>
      <div className="header" style={{ color: '#244C24' }}>
        <Input.Search
          placeholder="Buscar ingrediente"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '80%', color: '#244C24' }}
        />
        <Button
          className="btA"
          style={{ backgroundColor: customColors.colorBgTarjeta, color: customColors.colorTextTarjeta, borderColor: 'white'}}
          onClick={() => setIsModalOpen(true)}
        >
          Agregar
        </Button>
      </div>

      {loading ? (
        <>
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />
        </>
      ) : (
        <>
          <div style={{ 
            width: '100vw',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            padding: '16px',
            color: '#244C24', }}>
            <PorCaducar onUpdate={datosAlimento} />
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
                <span style={{}}>
                  <img alt={card.image} src={card.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }} />
                  <Meta
                    title={<span style={{  }}>{card.ingrediente}</span>}
                    description={<span style={{ color: customColors.colorFrio2 }}>{card.cantidad} {card.abreviatura}</span>}
                    style={{ marginTop: '10px', color: customColors.colorFrio2 }}
                  />
                  <div style={{ marginTop: '10px', color: card.caducidadPasada ? customColors.colorError : customColors.colorFrio3 }}>
                    {card.fecha}
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Space size="small" style={{ marginTop: '10px' }}>
                      <Tooltip title="Editar">
                        <EditOutlined style={{ color: customColors.colorFrio2, fontSize: 20 }}  onClick={() => setEdAlimento(card.id)}/>
                      </Tooltip>
                      {typeof card.diasRestantes === 'number' && card.diasRestantes <= 0 && (
                        <Tooltip title="Advertencia">
                          <WarningOutlined style={{ color: customColors.colorWarning, fontSize: 20 }} />
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <DeleteOutlined  onClick={() => eliminarAlimento(card.id)} style={{ color: customColors.colorError, fontSize: 20 }} />
                      </Tooltip>
                    </Space>
                    <Tooltip title="Consumir">
                      <MinusSquareOutlined  onClick={() => setConAlimento(card.id)} style={{ color: customColors.colorFrio2, fontSize: 20 }} />
                    </Tooltip>
                  </div>
                </span>
              </Card>
            ))}
            <ProductModal
              visible={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                datosAlimento();
              }}
            />
            <ModalEd
              visible={edAlimento !== null}
              onClose={() => {
                setEdAlimento(null);
                datosAlimento();
              }}
              stockId={edAlimento}
            />
            <ModalCon
              visible={conAlimento !== null}
              onClose={() => {
                setConAlimento(null);
                datosAlimento(); // Llamar para refrescar los datos después de editar
              }}
              alimentoId={conAlimento}
            />
          </div>
        </>
      )}
    </div>
    </ConfigProvider>
  );
}
