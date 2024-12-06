import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, ConfigProvider, message } from "antd";
import axios from "axios";
import "../Estilos/proceso.css";
import PUERTO from "../../config";

interface ProcedimientoProps {
  recetaId: number;
  onSubmit?: () => void;
  onReset?: () => void; // Para manejar el reset externo
}

interface Item {
  id: number;
  name: string;
  isChecked: boolean;
  orden: number;
  Activo: number;
}

const ProcedimientoRecetaEditar: React.FC<ProcedimientoProps> = ({ recetaId, onSubmit, onReset }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);

  // Función para obtener las instrucciones de la receta
  const datosInstrucciones = async () => {
    try {
      const response = await axios.get(`${PUERTO}/proceso/${recetaId}`);
      const proceso = response.data.map((instruccion: any) => ({
        id: instruccion.id,
        name: instruccion.Nombre,
        isChecked: false,
        orden: instruccion.Orden,
        Activo: instruccion.Activo,
      }));
      setItems(proceso);
      message.success("Instrucciones obtenidas exitosamente.");
    } catch (error) {
      console.error("Error al obtener instrucciones:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al inicio y después de un reset
  useEffect(() => {
    datosInstrucciones();
  }, [resetTrigger]);

  // Escuchar cambios en el evento onReset
  useEffect(() => {
    if (onReset) {
      setResetTrigger((prev) => !prev);
    }
  }, [onReset]);

  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setItems(updatedItems);

    const itemId = updatedItems[index].id;
    setSelectedIds((prevIds) =>
      updatedItems[index].isChecked
        ? [...prevIds, itemId]
        : prevIds.filter((id) => id !== itemId)
    );
  };

  // Eliminar instrucciones seleccionadas
  const enviarIdsSeleccionados = async () => {
    if (selectedIds.length === 0) {
      message.warning("No has seleccionado ninguna instrucción.");
      return;
    }
    try {
      await axios.put(`${PUERTO}/proED`, { ids: selectedIds, Cantidad: 0 });
      message.success("Instrucciones eliminadas exitosamente.");
      setItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          isChecked: selectedIds.includes(item.id) ? false : item.isChecked,
        }))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error al eliminar instrucciones:", error);
      message.error("No se pudo eliminar las instrucciones.");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#638552",
        },
      }}
    >
      <Card
        title={<span className="card-title">Instrucciones</span>}
        extra={
          <>
            <Button
              type="primary"
              onClick={enviarIdsSeleccionados}
              disabled={selectedIds.length === 0}
            >
              Eliminar
            </Button>
          </>
        }
        className="card-container"
        bodyStyle={{ padding: "16px" }}
      >
        {loading ? (
          <p>Cargando instrucciones...</p>
        ) : (
          <div className="card-checkbox-container">
            {items
              .filter((item) => item.Activo > 0)
              .map((item, index) => (
                <div key={item.id} className="drawer-checkbox">
                  <Checkbox
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  >
                    {item.orden}. {item.name}
                  </Checkbox>
                </div>
              ))}
          </div>
        )}
      </Card>
    </ConfigProvider>
  );
};

export default ProcedimientoRecetaEditar;
