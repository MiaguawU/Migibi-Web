import { Link, useNavigate } from 'react-router-dom';
import './Estilos/Recetas.css';
import { Input, Button, ConfigProvider, message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';
import RecipeCard from './Componentes/RecetaCard'

const { Search } = Input;

interface CardData {
  id: number;
  title: string;
  portions: string;
  calories: string; 
  time: string; 
  image: string;
  Activo: number;
}

const Recetas: React.FC = (): JSX.Element => {
  const [recipes, setRecipes] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  const datosReceta = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PUERTO}/recetaGeneral`);
      if (response.data) {
        const recData = response.data
          .filter((receta: any) => receta.Activo > 0)
          .map((receta: any) => ({
            id: receta.Id_Receta || ' ',
            title: receta.Nombre || ' ',
            portions: receta.Porciones || ' ',
            calories: String(receta.Calorias || '0'),
            time: String(receta.Tiempo || '0'),
            image: receta.Imagen_receta ? `${PUERTO}${receta.Imagen_receta}` : 'defRec.png',
            Activo: receta.Activo,
          }));

        setRecipes(recData);
        setLoading(false);
        message.success("Recetas obtenidas exitosamente");
      }
    } catch (error) {
      console.error("Error al obtener recetas", error);
      setLoading(false);
      message.error("No se pudo conectar con el servidor.");
    }
  };

  const eliminarReceta = async (id: number) => {
    try {
      const response = await axios.put(`${PUERTO}/recetaGeneral/${id}`);
      if (response.status === 200) {
        message.success(`Receta eliminada exitosamente.`);
        datosReceta(); 
      }
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      message.error("No se pudo eliminar la receta.");
    }
  };
  

  const handleEdit = (id: number) => {
    // Navigate to the edit page (you can pass the recipe ID or other params if needed)
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

  // Manejar búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
  };

  const navigate = useNavigate();

  const IRver = () => {
    navigate('/verR');
  };

  // Ensure that loading state is handled properly
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
          {/* Loading state */}
          <div className="header">
            <Search
              placeholder="Buscar por nombre, calorías o tiempo"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '80%' }}
            />
            <Button className="btA" onClick={IRver}>Agregar</Button>
          </div>

          {/* Loading Spinner or Message */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Cargando recetas...</p>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  // Return valid JSX for loaded state
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
        {/* Encabezado con búsqueda */}
        <div className="header">
          <Search
            placeholder="Buscar por nombre, calorías o tiempo"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '80%' }}
          />
          <Button className="btA" onClick={IRver}>Agregar</Button>
        </div>

        {/* Listado de recetas */}
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
