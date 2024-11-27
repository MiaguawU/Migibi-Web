import { Link, useNavigate } from 'react-router-dom'; 
import './Estilos/Recetas.css';
import { Input, Button, Select, Space, Tooltip, Card, ConfigProvider } from 'antd'; // Ant Design
import btEditar from '../Img/btEditar.png';
import def from '../Img/defRec.png';
import btEl from '../Img/btEliminar.png';
import cal from '../Img/imgCal.png';
import tiempo from '../Img/imgTiempo.png';
import btCom from '../Img/btCompartir.png';

import type { SelectProps } from 'antd';
import React, { useState } from 'react';
import RecipeCard from './Componentes/RecetaCard';

interface ItemProps {
  label: string;
  value: string;
}

const { Meta } = Card;

const { Search } = Input;
const options: ItemProps[] = [];

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({
    label: `Long Label: ${value}`,
    value,
  });
}

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options,
  placeholder: 'Select Item...',
  maxTagCount: 'responsive',
};

export default function Recetas() {

  interface CardData {
    title: string;
    portions: string;
    calories: string;
    time: string;
    image: string;
  }
  
  const { Meta } = Card;
  const cardsData: CardData[] = [
    { title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300' },
    { title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300' },
    { title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300' },
    { title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300' },
    { title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300' },
  ];

  const navigate = useNavigate();
  const onSearch = (value: string) => {
    console.log("Buscando:", value);
    // Lógica para búsqueda
  };

  const [value, setValue] = useState(['a10', 'c12', 'h17', 'j19', 'k20']);

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  };

  const IReditar = () =>{
    navigate('/edReceta');
  };
  const IRver = () =>{
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
    <div className="recetas-container">
      <div className="header" >
      <Space direction="vertical" style={{ width: '100%' }} className='buscar'>
        <Select {...sharedProps} {...selectProps}  />
      </Space>
        <Button className="btA" onClick={IRver}>Agregar</Button>

      </div>
      <div style={{width: '100vw',display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap:'16px', padding:'16px'}}>
                
        {cardsData.map((card, index) => (
          <RecipeCard
            title= {card.title}
            portions= {card.portions}
            calories= {card.calories}
            time= {card.time}
            image= {card.image}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      
    </div>
    </ConfigProvider>
  );
}
