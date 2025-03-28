import React, { useState, useEffect} from "react";
import { Card, ConfigProvider, message, Button } from 'antd'; 

import axios from "axios";
import PUERTO from "../config";
import "./perfil.css";
import {formatoFechaLegible} from "./Metodos/FormatoFecha";
import PlanEditar from "./Componentes/PlanEditar";
import PlanAgregar from "./Componentes/PlanAgregar";
//import {FormatoSQL} from "./Metodos/FormatoSQL";
import RecipeCard from './Componentes/RecetaCard';
import Pagination from './Componentes/Pagination';
//import imgdesayuno from "../Img/imgdesayuno.png";
//import relojarena from "../Img/relojarena.png";
//import cuadros from "../Img/cuadros.png";
//import caducar from "../Img/biCa.png";
//import agregar from "../Img/btagregar2.png";

const { Meta } = Card;

interface CardData {
  id: number;
  title: string;
  portions: string;
  calories: string;
  time: string;
  image: string;
}
interface comidaSemana {
  comida: string;
  recetas: CardData[];
}
interface semanaData {
  id: number;
  fecha: string; 
  comidas: comidaSemana[] 
}

const Inicio = () => { 
  const [DiasPlan, setDiasPlan] = useState<semanaData[]>([]);
  const [loading, setLoading] = useState(true);  
  const [weekIndex, setWeekIndex] = useState(0);
  const [isEditarOpen, setIsEditarOpen] = useState(false); // Estado del modal
  const [isAgregarOpen, setIsAgregarOpen] = useState(false); // Estado del modal
  const [diaSelected, setdiaSelected] = useState(0);
  const [comidaSelected, setcomidaSelected] = useState("");

  const weeks = [
    "Semana del 1 al 7 de noviembre",
    "Semana del 8 al 14 de noviembre",
    "Semana del 15 al 21 de noviembre",
    "Semana del 22 al 28 de noviembre",
  ];
  const datosRecetasSemana = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PUERTO}/planGeneral`);
  
      if (response.data) {
        const semanaData: semanaData[] = response.data.map((registro: any) => ({
          id: registro.Id_Recetas_Dia,
          fecha: new Date(registro.Fecha).toISOString().split("T")[0], // Formato de fecha
          comidas: [
            {
              comida: "Desayuno",
              recetas: registro.Activo_Desayuno > 0
                ? [
                    {
                      id: registro.Id_Receta_Desayuno || 0,
                      title: registro.Nombre_Desayuno || "",
                      portions: String(registro.Porciones_Desayuno || "0"),
                      calories: String(registro.Calorias_Desayuno || "0"),
                      time: registro.Tiempo_Desayuno || "",
                      image: registro.Imagen_Desayuno
                        ? `${PUERTO}${registro.Imagen_Desayuno}`
                        : "defRec.png",
                    },
                  ]
                : [],
            },
            {
              comida: "Comida",
              recetas: registro.Activo_Comida > 0
                ? [
                    {
                      id: registro.Id_Receta_Comida || 0,
                      title: registro.Nombre_Comida || "",
                      portions: String(registro.Porciones_Comida || "0"),
                      calories: String(registro.Calorias_Comida || "0"),
                      time: registro.Tiempo_Comida || "",
                      image: registro.Imagen_Comida
                        ? `${PUERTO}${registro.Imagen_Comida}`
                        : "defRec.png",
                    },
                  ]
                : [],
            },
            {
              comida: "Cena",
              recetas: registro.Activo_Cena > 0
                ? [
                    {
                      id: registro.Id_Receta_Cena || 0,
                      title: registro.Nombre_Cena || "",
                      portions: String(registro.Porciones_Cena || "0"),
                      calories: String(registro.Calorias_Cena || "0"),
                      time: registro.Tiempo_Cena || "",
                      image: registro.Imagen_Cena
                        ? `${PUERTO}${registro.Imagen_Cena}`
                        : "defRec.png",
                    },
                  ]
                : [],
            },
          ],
        }));
  
        console.log("Semana Data procesada:", semanaData);
        setDiasPlan(semanaData);
        setLoading(false);
        message.success("Recetas de la semana obtenidas exitosamente.");
      }
    } catch (error) {
      console.error("Error al obtener las recetas de la semana", error);
      setLoading(false);
      message.error("No se pudo conectar con el servidor.");
    }
  };
  
  useEffect(() => {
    datosRecetasSemana();
  }, []);

  const handlePrevious = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNext = () => {
    if (weekIndex < weeks.length - 1) setWeekIndex(weekIndex + 1);
  };

  const handleEdit = (idDia: number, comidaNombre: string) => {
    setdiaSelected(idDia);
    setcomidaSelected(comidaNombre);
    setIsEditarOpen(true);
  };
  
  const handleDelete = async(idDia: number, comidaNombre: string) => {
    setdiaSelected(idDia);
    setcomidaSelected(comidaNombre);
    console.log(diaSelected);
    console.log(comidaSelected);
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    const payload = {
        Id_Recetas_Dia: idDia,
      Id_Usuario_Modif: Number(currentUser)
    };

    try {
      const response = await axios.put(`${PUERTO}/editar${comidaSelected}/borrar/${diaSelected}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success("Receta editada correctamente.");
        datosRecetasSemana();
      } else {
        message.error("Error al editar la receta.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud.");
    }
  };

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
          <div style={{height: '100%', display: 'flex', alignItems: 'center', padding: '15px'}}>
            <ConfigProvider
            theme={{
              token: {
                fontFamily: "Jomhuria, Serif",
                fontSize: 40,
                colorText: "#6B8762",
                colorPrimary: '#00b96b',
                borderRadius: 10,
                colorBgContainer: '#CAE2B5',
              }}}>
              <Button
                key={`AgregarNuevoPlan`}
                style={{height: "40px", margin: '10px', marginTop: '5px',}}
                onClick={() => {setIsAgregarOpen(true);}}>
                Agregar receta
              </Button>
              </ConfigProvider>
              {/**
               * 
            <img src={imgdesayuno} style={{height: '100px'}} />
            <img src={relojarena} style={{height: '66px'}} />  
               */}
          </div>
          <div style={{height: '100%', display: 'flex', paddingLeft: '0'}}>
            {/** 
            <img src={cuadros} style={{height: '58px'}} />*/}
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

        {DiasPlan.map((dia, index) => (
          <div key={index}>
            <div style={{backgroundColor: '#D3E2B4', height: '45px', borderRadius: '10px', display: "flex", alignItems: "center", flexWrap: "wrap"}}>
              <div style={{margin: '10px', marginTop: '5px', alignItems: 'center'}}>
                <a style={{fontFamily: 'Jomhuria', fontSize: '32px', color: '#86A071'}}>{formatoFechaLegible(dia.fecha)}</a>      
              </div>
            </div>
            <br /><br />
            {dia.comidas.map((comida, index) => (
              <div key={index}>
                <div style={{backgroundColor: '#D3E2B4', borderRadius: '8px', paddingRight: '15px', paddingLeft: '15px', paddingBottom: '10px'}}>
                  <a style={{fontFamily: 'Jomhuria', fontSize: '45px', color: '#86A071'}}>{comida.comida}</a>

                  <div>
                    <div style={{width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '16px'}}>
                    {comida.recetas.length > 0 ? (
                      comida.recetas.map((card) => (
                        <RecipeCard
                          key={card.id}
                          id={card.id}
                          title={card.title}
                          portions={card.portions}
                          calories={card.calories}
                          time={card.time}
                          image={card.image}
                          onEdit={() => handleEdit(dia.id, comida.comida)}
                          onDelete={() => handleDelete(dia.id, comida.comida)}
                        />
                      ))
                    ) : (
                      
                    <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: "Jomhuria, Serif",
                        fontSize: 40,
                        colorText: "#8BA577",
                        colorPrimary: '#00b96b',
                        borderRadius: 10,
                        colorBgContainer: '#CAE2B5',
                      }}}>
                      <Button
                        key={`add-recipe-${dia.id}-${comida.comida}`}
                        style={{height: "40px"}}
                        onClick={() => {
                          setdiaSelected(dia.id);
                          setcomidaSelected(comida.comida);
                          setIsEditarOpen(true); // Abre el modal para agregar receta
                        }}
                      >
                        Agregar receta
                      </Button>
                      </ConfigProvider>
                    )}
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
        
        <PlanEditar
              visible= {isEditarOpen}
              onClose={() => setIsEditarOpen(false)}
              planId={diaSelected}
              comida={comidaSelected}
              onSubmit={datosRecetasSemana}
            />
        <PlanAgregar
              visible= {isAgregarOpen}
              onClose={() => setIsAgregarOpen(false)}
              onSubmit={datosRecetasSemana}
            />
      </div>
    </ConfigProvider>
  );
}

export default Inicio;