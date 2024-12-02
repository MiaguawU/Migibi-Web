import { Link, useNavigate } from 'react-router-dom';
import './Estilos/Recetas.css';
import { Input, Button, ConfigProvider, message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PUERTO from '../config';
import RecipeCard from './Componentes/RecetaCard';

const { Search } = Input;

interface CardData {
  title: string;
  portions: string;
  calories: string; // Puede ser string o número
  time: string; // Puede ser string o número
  image: string;
}

export default function Recetas() {
  const [recipes, setRecipes] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<CardData[]>([]);

  // Obtener datos de recetas
  const datosReceta = async () => {
    try {
      const response = await axios.get(`${PUERTO}/recetaGeneral`);
      if (response.data) {
        const recData = response.data.map((receta: any) => ({
          title: receta.Nombre || ' ',
          portions: receta.Porciones || ' ',
          calories: String(receta.Calorias || '0'), // Convertir a cadena
          time: String(receta.Tiempo || '0'), // Convertir a cadena
          image: receta.Imagen_receta ? `${PUERTO}${receta.Imagen_receta}` : 'defRec.png',
        }));
        
        setRecipes(recData);
        setFilteredRecipes(recData); // Inicializar con todas las recetas
        message.success("Recetas obtenidas exitosamente");
      }
    } catch (error) {
      console.error("Error al obtener recetas", error);
      message.error("No se pudo conectar con el servidor.");
    }
  };

  useEffect(() => {
    datosReceta();
  }, []);

  // Manejar búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
    const filtered = recipes.filter((recipe) => {
      const title = recipe.title.toLowerCase();
      const calories = String(recipe.calories).toLowerCase(); // Convertir a cadena
      const time = String(recipe.time).toLowerCase(); // Convertir a cadena
  
      return (
        title.includes(value.toLowerCase()) ||
        calories.includes(value.toLowerCase()) ||
        time.includes(value.toLowerCase())
      );
    });
    setFilteredRecipes(filtered);
  };

  const navigate = useNavigate();

  const IRver = () => {
    navigate('/verR');
  };

  const handleEdit = () => {
    console.log("Editar receta");
  };

  const handleDelete = () => {
    console.log("Eliminar receta");
  };

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
              key={index}
              title={card.title}
              portions={card.portions}
              calories={card.calories}
              time={card.time}
              image={card.image}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </ConfigProvider>
  );
}
