import React from "react";
import { Button, Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import CarouselExample from "./Carousel";
import Carousel2 from "../Img/Infografía MIGIBI 1.png";

export default function Inicio() {
  const navigate = useNavigate();

  const iraAcceder = () => {
    navigate("/acceder");
  };


  return (
    <>
      <CarouselExample />
      <div>
        <img src={Carousel2} alt="Descripción de la imagen" style={{ maxWidth: "100%", height: "auto" }} />
      </div>
    </>
  );
}
  
  