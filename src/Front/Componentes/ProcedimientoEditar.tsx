import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import axios from "axios";
import "../Estilos/proceso.css";
import PUERTO from "../../config";
import btAg from '../../Img/btagregar.png';
import InsModal from "./InstruccionModal";

interface ProcedimientoProps {
  recetaId: number;
  onReset?: () => void;
  onSubmit?: () => void;
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal


  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('quantity', values.quantity);
    formData.append('unit', values.unit);
    formData.append('type', values.type);
  };

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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };


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

  const handleAgregar = () => {
    console.log("Abrir modal o formulario para agregar nuevo ingrediente.");
    toggleDrawer();
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
          <>
            <Button
              type="primary"
              onClick={enviarIdsSeleccionados}
              disabled={selectedIds.length === 0}
            >
              Eliminar
            </Button>
            <Button type="link" onClick={toggleDrawer} className="card-button-link">Ver más</Button>
            </>

        }
        className="card-container"
        bodyStyle={{ padding: "16px" }}
      >
        {loading ? (
            <p>Cargando ingredientes...</p>
          ) : (
          <div className="card-checkbox-container">
            {items.slice(0, 5).map((item, index) => (
              <div key={index} className="card-checkbox">
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                  className="card-checkbox-text"
                >
                  {item.orden}.{item.name}
                </Checkbox>
              </div>
            ))}
            <Button className="btAg" onClick={() => setIsModalOpen(true)}>
              <img className="img" src={btAg} alt="Agregar" />
            </Button>
          </div>
          )}

      </Card>
      <Drawer
          title="Agregar Ingrediente"
          placement="right"
          onClose={toggleDrawer}
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
                {item.name}
              </Checkbox>
            </div>
          ))}
        </Drawer>
    </ConfigProvider>
    <InsModal
    visible={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmit}
  />
</>

  );
};

export default ProcedimientoRecetaEditar;
