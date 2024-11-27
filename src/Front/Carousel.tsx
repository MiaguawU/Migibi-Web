import React from "react";
import { Carousel, Row, Col } from "antd";
import "./Carousel.css"; // CSS personalizado para estilos adicionales
import migibi from "../Img/Carousel1.png";
import dibujo from "../Img/Carousel.png";

const CarouselExample: React.FC = () => {
  const slides = [
    {
      image: migibi, // URL de la imagen
      title: "Migibi",
      description: "Migibi eats es un proyecto creado con el fin de ayudar a los hogares a reducir el desperdicio de los alimentos.",
    },
    {
      image: dibujo, // URL de la imagen
      title: "Conservar",
      description: "Conoce la manera de conservar tus alimentos por mas tiempo.",
    },
  ];

  return (

    <Carousel autoplay style={{width: "100%", backgroundColor: "#C4EFC4",}}>
      {slides.map((slide, index) => (
        <div key={index} className="carousel-slide">
          <div className="carousel-content">
            {/* Imagen */}
            <div className="carousel-image-container">
              <img src={slide.image} alt={slide.title} className="carousel-image" />
            </div>

            {/* Texto */}
            <div className="carousel-text">
              <p>{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselExample;
