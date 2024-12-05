import React, { useState } from "react";
import { Row, Card, Col, ConfigProvider } from 'antd'; 

import RecipeCard from './Componentes/RecetaCard';
import Pagination from './Componentes/Pagination';
import imgdesayuno from "../Img/imgdesayuno.png";
import relojarena from "../Img/relojarena.png";
import cuadros from "../Img/cuadros.png";
import caducar from "../Img/biCa.png";
import agregar from "../Img/btagregar2.png";

const { Meta } = Card;

const handleEdit = () => {
  console.log("Editar receta");
};

const handleDelete = () => {
  console.log("Eliminar receta");
};

export default function Inicio() {   
  const [weekIndex, setWeekIndex] = useState(0);

  const weeks = [
    "Semana del 1 al 7 de noviembre",
    "Semana del 8 al 14 de noviembre",
    "Semana del 15 al 21 de noviembre",
    "Semana del 22 al 28 de noviembre",
  ];

  const handlePrevious = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNext = () => {
    if (weekIndex < weeks.length - 1) setWeekIndex(weekIndex + 1);
  };

  interface CardData {
    id: number;
    title: string;
    portions: string;
    calories: string;
    time: string;
    image: string;
  }

  const cardsData: CardData[] = [
    {id: 1, title: 'Pastel', portions: '30', calories: "2000Kcal", time: '2hr', image: 'https://via.placeholder.com/300'},
    // Puedes agregar más datos aquí
  ];

  interface comidaSemana {
    comida: string;
    recetas: CardData[];
  }

  const comidasData: comidaSemana[] = [
    {comida: "Desayuno", recetas: cardsData},
    {comida: "Comida", recetas: cardsData}
  ];

  const semanaData: { fecha: string; comidas: comidaSemana[] }[] = [
    {fecha: "Jueves 10 de noviembre 2024", comidas: comidasData},
    {fecha: "Viernes 11 de noviembre 2024", comidas: comidasData}
  ];

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
            algorithm: true
          }
        }
      }}
    >
      <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <div style={{height: 'Auto', justifyContent: 'space-between', display: 'flex'}}>
          <div style={{height: '100%', display: 'flex'}}>
            <img src={imgdesayuno} style={{height: '100px'}} />
            <img src={relojarena} style={{height: '66px'}} />  
          </div>
          <div style={{height: '100%', display: 'flex', paddingLeft: '0'}}>
            <img src={cuadros} style={{height: '58px'}} />
          </div>
        </div>

        <div style={{backgroundColor: '#D3E2B4', height: 'auto', borderRadius: '10px'}}>
          <Pagination
            currentWeek={weeks[weekIndex]}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>

        <br />

        {semanaData.map((dia, index) => (
          <div key={index}>
            <div style={{backgroundColor: '#D3E2B4', height: '45px', borderRadius: '10px', display: "flex", alignItems: "center", flexWrap: "wrap"}}>
              <div style={{margin: '10px', marginTop: '5px', alignItems: 'center'}}>
                <a style={{fontFamily: 'Jomhuria', fontSize: '32px', color: '#86A071'}}>{dia.fecha}</a>      
              </div>
            </div>
            <br /><br />
            {dia.comidas.map((comida, index) => (
              <div key={index}>
                <div style={{backgroundColor: '#D3E2B4', borderRadius: '8px', paddingRight: '15px', paddingLeft: '15px', paddingBottom: '10px'}}>
                  <a style={{fontFamily: 'Jomhuria', fontSize: '45px', color: '#86A071'}}>{comida.comida}</a>
                  <div>
                    <div style={{width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '16px'}}>
                      {comida.recetas.map((card) => (
                        <RecipeCard
                          key={card.id}
                          id={card.id}
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
                  <br /><br />
                </div>
                <br /><br />
              </div>
            ))}
            <br />
          </div>
        ))}
      </div>
    </ConfigProvider>
  );
}
