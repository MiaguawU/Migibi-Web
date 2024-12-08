import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import axios from "axios";
import "../Estilos/proceso.css";
import PUERTO from "../../config";
import btAg from "../../Img/btagregar.png";
import InsModal from "./InstruccionModal";

interface ProcedimientoProps {
  recetaId: number;
  onSubmit?: boolean;
  onReset?: boolean;
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
  const [loading, setLoading] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDeleted, setTempDeleted] = useState<Item[]>([]);
  const [tempAdded, setTempAdded] = useState<Item[]>([]);

  // Función para obtener las instrucciones de la receta
  const datosInstrucciones = async () => {
    try {
      const response = await axios.get(`${PUERTO}/proceso/${recetaId}`);
      const proceso = response.data
        .filter((instruccion: any) => instruccion.Activo > 0) // Filtro de instrucciones con Activo > 0
        .map((instruccion: any) => ({
          id: instruccion.id,
          name: instruccion.Nombre,
          isChecked: false,
          orden: instruccion.Orden,
          Activo: instruccion.Activo,
        }));
      setItems(proceso);
      setTempDeleted([]);
      setTempAdded([]);
      message.success("Instrucciones obtenidas exitosamente.");
    } catch (error) {
      console.error("Error al obtener instrucciones:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos al inicio y después de un reset
  useEffect(() => {
    datosInstrucciones();
  }, [resetTrigger]);

  useEffect(() => {
    if (onReset) {
      // Reinicia el estado de los checkboxes
      setItems((prevItems) =>
        prevItems.map((item) => ({ ...item, isChecked: false }))
      );
      setResetTrigger((prev) => !prev); // Dispara la recarga de datos si es necesario
    }
  }, [onReset]);

  useEffect(() => {
    if (onSubmit) {
      subirCambios();
    }
  }, [onSubmit]);

  const subirCambios = async () => {
    try {
      if (tempAdded.length > 0) {
        await axios.post(`${PUERTO}/proceso/${recetaId}/agregar`, tempAdded);
      }
      if (tempDeleted.length > 0) {
        const idsToDelete = tempDeleted.map((item) => item.id);
        await axios.put(`${PUERTO}/proED`, { ids: idsToDelete });
      }
      message.success("Cambios enviados exitosamente.");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      message.error("No se pudo guardar los cambios.");
    }
  };

  const handleDeleteInstruction = (index: number) => {
    const itemToDelete = items[index];
    if (!tempAdded.some((item) => item.id === itemToDelete.id)) {
      setTempDeleted((prev) => [...prev, itemToDelete]);
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleAddInstruction = (newInstruction: Item) => {
    setTempAdded((prev) => [...prev, newInstruction]);
    setItems((prev) => [...prev, newInstruction]);
  };

  return (
    <>
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
            <Button type="link" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              Ver más
            </Button>
          }
          className="card-container"
          bodyStyle={{ padding: "16px" }}
        >
          {loading ? (
            <p>Cargando instrucciones...</p>
          ) : (
            <div className="card-checkbox-container">
              {items.slice(0, 5).map((item, index) => (
                <div key={index} className="card-checkbox">
                  <Checkbox
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                    className="card-checkbox-text"
                  >
                    {item.orden}. {item.name}
                  </Checkbox>
                  <Button danger onClick={() => handleDeleteInstruction(index)}>
                    Eliminar
                  </Button>
                </div>
              ))}
              <Button className="btAg" onClick={() => setIsModalOpen(true)}>
                <img className="img" src={btAg} alt="Agregar" />
              </Button>
            </div>
          )}
        </Card>

        <Drawer
          title="Instrucciones"
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={300}
        >
          {items.map((item, index) => (
            <div key={index} className="drawer-checkbox">
              <Checkbox
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(index)}
                className="drawer-checkbox-text"
              >
                {item.orden}. {item.name}
              </Checkbox>
              <Button danger onClick={() => handleDeleteInstruction(index)}>
                Eliminar
              </Button>
            </div>
          ))}
        </Drawer>
      </ConfigProvider>

      <InsModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(newInstruction: Item) => handleAddInstruction(newInstruction)}
          recetaId={recetaId}
        />

    </>
  );
};

export default ProcedimientoRecetaEditar;
