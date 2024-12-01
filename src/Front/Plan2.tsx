import React, { useState } from "react";
import {Card, ConfigProvider} from 'antd';  
import Pagination from "./Componentes/Pagination";
import RecipeCard from './Componentes/RecetaCard';
import imgdesayuno from "../Img/imgdesayuno.png";

import relojarena from "../Img/relojarena.png";
import cuadros from "../Img/cuadros.png";
import caducar from "../Img/biCa.png";
import agregar from "../Img/btagregar2.png";
{/*
import defRec from "../Img/defRec.png";
import btEditar from "../Img/btEditar.png";
import btCompartir from "../Img/btCompartir.png";
import imgCal from "../Img/imgCal.png";
import btEliminar from "../Img/btEliminar.png";
import flechaizquierda from "../Img/flechaizquierda.png";
import flechaderecha from "../Img/flechaderecha.png";
import calendario from "../Img/calendario.png";
import btagregar from "../Img/btagregar2.png";*/}

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
 
  return (  
    <>  
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
      <div style={{ marginLeft: '15px', marginRight: '15px',}}>
        <div style={{height: 'Auto', justifyContent: 'space-between', display: 'flex',}}>
          <div style={{height: '100%', width: '80%', display: 'flex',}}>
            <div style={{display: 'flex', flexDirection: "column"}}>
              <img src={caducar} style={{height: '100px',}}/>
              <span style={{fontFamily: 'Jomhuria, serif'}}>Caducar</span>
            </div>
            <div>
              <img src={relojarena} style={{height: '66px',}}/>
            </div>
          </div>
          <div style={{height: '100%', width: '20%', display: 'flex',}}>
            <img src={agregar} style={{height: '58px',}}/>
          </div>
        </div>
        <div style={{backgroundColor: '#D3E2B4', height: 'auto', borderRadius: '10px',}}>
          <Pagination
            currentWeek={weeks[weekIndex]}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <br /><br />

        <div style={{backgroundColor: '#D3E2B4', borderRadius: '8px', paddingRight: '15px', paddingLeft: '15px', paddingBottom: '10px', marginBottom: '20px'}}><a style={{fontFamily: 'Jomhuria', fontSize: '45px', color: '#86A071',}}>Desayuno</a>
        <div style={{width: '100%',display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap:'16px', padding:'16px'}}>
                
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
      </div>
      </ConfigProvider>
    </>  
  );  
}
