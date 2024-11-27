import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  const iraAcceder = () => {
    navigate("/acceder");
  };

  return (
    <div>
      <h1>Página Principal</h1>
      <Button type="primary" onClick={iraAcceder}>
        Acceder
      </Button>
    </div>
  );
}
  
  