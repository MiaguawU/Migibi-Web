import { Link, useNavigate } from 'react-router-dom';
import './Estilos/Recetas.css';
import { Input, Button, ConfigProvider, message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';
import RecipeCard from './Componentes/RecetaCard';

const { Search } = Input;

interface CardData {
  id: number;
  title: string;
  portions: string;
  calories: string;
  time: string;
  editar: boolean;
  image: string;
  Activo: number;
  Id_Usuario_Alta: number;
}

const Recetas: React.FC = (): JSX.Element => {
  const [recipes, setRecipes] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const datosReceta = async () => {
  setLoading(true);
  try {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      setLoading(false);
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
    const user = usuarios[currentUser];
    const parsedUserId = parseInt(currentUser, 10);

    if (!user || isNaN(parsedUserId)) {
      message.warning("Usuario no encontrado o ID inválido.");
      setLoading(false);
      return;
    }

    setUserId(parsedUserId);

    // 🔹 Obtener rol del usuario
    const resUsuario = await axios.get(`${PUERTO}/usuarios/${parsedUserId}`);
    const rol = resUsuario.data[0]?.Id_Rol;
    const esAdmin = rol === 2;

    // 🔹 Obtener todas las recetas
    const resRecetas = await axios.get(`${PUERTO}/recetaGeneral`);
    const todasLasRecetas = resRecetas.data || [];

    const recData: CardData[] = todasLasRecetas
      .filter((receta: any) => {
        const activa = receta.Activo > 0;
        const esDefault = receta.Id_Usuario_Alta === 1;
        const creadaPorUsuario = receta.Id_Usuario_Alta === parsedUserId;

        if (esAdmin) return activa;
        return activa && (esDefault || creadaPorUsuario); // solo sus recetas o por defecto
      })
      .map((receta: any) => {
        const creadaPorUsuario = receta.Id_Usuario_Alta === parsedUserId;
        const puedeEditar = esAdmin || creadaPorUsuario;

        return {
          id: receta.Id_Receta || 0,
          title: receta.Nombre || '',
          portions: receta.Porciones || '',
          calories: String(receta.Calorias || '0'),
          time: String(receta.Tiempo || '0'),
          image: receta.Imagen_receta ? `${PUERTO}${receta.Imagen_receta}` : 'defRec.png',
          Activo: receta.Activo,
          Id_Usuario_Alta: receta.Id_Usuario_Alta,
          editar: puedeEditar
        };
      });

    setRecipes(recData);
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    message.error("No se pudo conectar con el servidor.");
  } finally {
    setLoading(false);
  }
};

  const eliminarReceta = async (id: number) => {
    try {
      const response = await axios.put(`${PUERTO}/recetaGeneral/${id}`);
      if (response.status === 200) {
        message.success(`Receta eliminada exitosamente.`);
        datosReceta();
      } else {
        message.error("No se pudo eliminar la receta.");
      }
    } catch (error: any) {
      console.error("Error al eliminar receta:", error);
      message.error(error?.response?.data?.message || "No se pudo eliminar la receta.");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edReceta?id=${id}`);
  };

  useEffect(() => {
    datosReceta();
  }, []);

  useEffect(() => {
    const filtered = recipes.filter((recipe) => {
      const title = recipe.title.toLowerCase();
      return (
        (title.includes(searchTerm.toLowerCase()) ||
          recipe.calories.includes(searchTerm.toLowerCase()) ||
          recipe.time.includes(searchTerm.toLowerCase())) &&
        recipe.Activo > 0
      );
    });
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  if (loading) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00b96b',
            borderRadius: 10,
            colorBgContainer: '#CAE2B5',
          },
        }}
      >
        <div className="recetas-container">
          <div className="header">
            <Search
              placeholder="Buscar por nombre, calorías o tiempo"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '80%' }}
            />
            <Button className="btA" onClick={() => navigate('/verR')}>Agregar</Button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Cargando recetas...</p>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 10,
          colorBgContainer: '#CAE2B5',
        },
      }}
    >
      <div className="recetas-container">
        <div className="header">
          <Search
            placeholder="Buscar por nombre, calorías o tiempo"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '80%' }}
          />
          <Button className="btA" onClick={() => navigate('/verR')}>Agregar</Button>
        </div>
        <div
          style={{
            width: '100vw',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            padding: '16px',
          }}
        >
          {filteredRecipes.map((card, index) => (
            <RecipeCard
              id={card.id}
              key={index}
              title={card.title}
              portions={card.portions}
              calories={card.calories}
              time={card.time}
              image={card.image}
              editar={card.editar}
              onEdit={() => handleEdit(card.id)}
              onDelete={() => eliminarReceta(card.id)}
            />
          ))}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Recetas;
