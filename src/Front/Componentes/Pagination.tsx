import React, { useState } from "react";
import { LeftOutlined, RightOutlined, CalendarOutlined, ShareAltOutlined } from "@ant-design/icons";

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
        backgroundColor: "#D3E2B4",
        borderRadius: "10px",
        padding: "10px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#86A071",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Botón Anterior */}
      <LeftOutlined
        onClick={onPrevious}
        style={{ fontSize: "30px", cursor: "pointer", color: "#6B8762" }}
      />

      {/* Texto con Ícono de Calendario */}
        <span style={{fontFamily: 'Jomhuria, serif', fontSize: '32px', color: "#6B8762",}}>{currentWeek}</span>
        <CalendarOutlined style={{ fontSize: "30px" , color: "#6B8762"}} />
        <ShareAltOutlined style={{ fontSize: "30px", cursor: "pointer", color: "#6B8762" }} />
      </div>

      {/* Botón Compartir y Siguiente */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <RightOutlined
          onClick={onNext}
          style={{ fontSize: "30px", cursor: "pointer", color: "#6B8762" }}
        />
      </div>
    </div>
  );
};

export default Pagination;
