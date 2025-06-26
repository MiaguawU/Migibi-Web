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
  image: string;
  Activo: number;
  Id_Usuario_Alta: number;
}

const Recetas: React.FC = (): JSX.Element => {
  const [recipes, setRecipes] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (!user) {
        message.warning("Usuario no encontrado en los datos locales.");
        setLoading(false);
        return;
      }

      const userId = parseInt(currentUser, 10);
      if (isNaN(userId)) {
        message.error("ID de usuario inválido.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${PUERTO}/recetaGeneral`);
      if (response.data) {
        const recData = response.data
          .filter(
            (receta: any) =>
              receta.Activo > 0 &&
              (receta.Id_Usuario_Alta === userId || receta.Id_Usuario_Alta === 1)
          )
          .map((receta: any) => ({
            id: receta.Id_Receta || ' ',
            title: receta.Nombre || ' ',
            portions: receta.Porciones || ' ',
            calories: String(receta.Calorias || '0'),
            time: String(receta.Tiempo || '0'),
            image: receta.Imagen_receta ? `${PUERTO}${receta.Imagen_receta}` : 'defRec.png',
            Activo: receta.Activo,
            Id_Usuario_Alta: receta.Id_Usuario_Alta,
          }));

        setRecipes(recData);
        console.log("Recetas obtenidas exitosamente");
      }
    } catch (error) {
      console.error("Error al obtener recetas", error);
      message.error("No se pudo conectar con el servidor o ID de usuario inválido.");
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
      }
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      message.error("No se pudo eliminar la receta.");
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
            colorBgContainer: '#CEFF77',
            colorText: '#244C24',
          },
        }}
      >
        <div className="recetas-container" style={{ color: '#244C24' }}>
          <div className="header" style={{ color: '#244C24' }}>
            <Search
              placeholder="Buscar por nombre, calorías o tiempo"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '80%', color: '#244C24' }}
            />
            <Button
              className="btA"
              style={{ backgroundColor: '#CEFF77', color: '#244C24' }}
              onClick={() => navigate('/verR')}
            >
              Agregar
            </Button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#244C24' }}>
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
          colorBgContainer: '#CEFF77',
          colorText: '#244C24',
        },
      }}
    >
      <div className="recetas-container" style={{ color: '#244C24' }}>
        <div className="header" style={{ color: '#244C24' }}>
          <Search
            placeholder="Buscar por nombre, calorías o tiempo"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '80%', color: '#244C24' }}
          />
          <Button
            className="btA"
            style={{ backgroundColor: '#CEFF77', color: '#244C24' }}
            onClick={() => navigate('/verR')}
          >
            Agregar
          </Button>
        </div>
        <div
          style={{
            width: '100vw',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
            padding: '16px',
            color: '#244C24',
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
