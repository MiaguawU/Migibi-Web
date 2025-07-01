import React, { useState } from "react";
import { LeftOutlined, RightOutlined, CalendarOutlined, ShareAltOutlined } from "@ant-design/icons";
import { customColors } from "../Estilos/colores";

interface PaginationProps {
  currentWeek: string;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentWeek, onPrevious, onNext }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: customColors.colorPrimarioClaro,
        borderRadius: "10px",
        padding: "10px 20px",
        color: customColors.colorFrio3,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Botón Anterior */}
      <LeftOutlined
        onClick={onPrevious}
        style={{ fontSize: "30px", cursor: "pointer", color: customColors.colorFrio3 }}
      />

      {/* Texto con Ícono de Calendario */}
        <span style={{fontSize: '23px', color: customColors.colorFrio3, fontWeight: '500'}}>{currentWeek}</span>
        <CalendarOutlined style={{ fontSize: "30px" , color: customColors.colorFrio3}} />
        <ShareAltOutlined style={{ fontSize: "30px", cursor: "pointer", color: customColors.colorFrio3 }} />
      </div>

      {/* Botón Compartir y Siguiente */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <RightOutlined
          onClick={onNext}
          style={{ fontSize: "30px", cursor: "pointer", color: customColors.colorFrio3 }}
        />
      </div>
    </div>
  );
};

export default Pagination;
