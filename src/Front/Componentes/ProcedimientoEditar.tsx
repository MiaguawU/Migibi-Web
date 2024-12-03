import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import btAg from "../../Img/btagregar.png"; // Asegúrate de que la ruta sea correcta
import "../Estilos/ing.css"; // Importa el archivo CSS
import axios from "axios";
import PUERTO from "../../config"; // Asegúrate de que PUERTO esté configurado correctamente

interface ProcedimientoProps {
  recetaId: number; // ID de la receta
}

interface Item {
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  isChecked: boolean;
  orden: number;
}

const ProcedimientoRecetaEditar: React.FC<ProcedimientoProps> = ({ recetaId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const id_receta = recetaId;

  // Función para obtener los ingredientes de la receta
  const datosInstrucciones = async () => {
    try {
      const response = await axios.get(`${PUERTO}/proceso/${id_receta}`);
      console.log("Datos recibidos:", response.data);

      const proceso = response.data.map((instrucciones: any) => ({
        id: instrucciones.id,
        name: instrucciones.Nombre || "Alimento desconocido",
        isChecked: false,
        orden: instrucciones.Orden,
      }));

      setItems(proceso);
      message.success("instrucciones obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener Ingredientes:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    datosInstrucciones();
  }, []);

  // Alternar el estado del Drawer (Agregar ingredientes)
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Manejar el cambio en los checkboxes
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setItems(updatedItems);

    const itemId = updatedItems[index].id;

    setSelectedIds((prevIds) =>
      updatedItems[index].isChecked
        ? [...prevIds, itemId] // Agregar si está seleccionado
        : prevIds.filter((id) => id !== itemId) // Remover si está deseleccionado
    );
  };

  // Enviar los IDs seleccionados al servidor
  const enviarIdsSeleccionados = async () => {
    if (selectedIds.length === 0) {
      message.warning("No has seleccionado ningún alimento.");
      return;
    }

    try {
      const response = await axios.put(`${PUERTO}/caducar`, {
        ids: selectedIds,
        Cantidad: 0,
      });

      console.log(response.data.message);
      message.success("Ingredientes eliminados exitosamente.");

      // Actualizar el estado local para desmarcar los seleccionados
      setItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          isChecked: selectedIds.includes(item.id) ? false : item.isChecked,
        }))
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error al actualizar alimentos:", error);
      message.error("No se pudo eliminar los ingredientes.");
    }
  };

  // Manejar el evento del botón "Agregar"
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
            <Button
              type="primary"
              onClick={enviarIdsSeleccionados}
              disabled={selectedIds.length === 0}
            >
              Eliminar
            </Button>
          }
          className="card-container"
          bodyStyle={{ padding: "16px" }}
        >
          {loading ? (
            <p>Cargando ingredientes...</p>
          ) : (
            <div className="card-checkbox-container">
              {items.map((item, index) => (
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
              <Button className="btAg" onClick={handleAgregar}>
                <img className="img" src={btAg} alt="Agregar" />
              </Button>
            </div>
          )}
        </Card>
      </ConfigProvider>

      {/* Drawer para agregar ingredientes */}
      <Drawer
        title="Agregar Ingrediente"
        placement="right"
        onClose={toggleDrawer}
        open={isDrawerOpen}
      >
        {/* Contenido del formulario para agregar ingrediente */}
        <p>Formulario aquí...</p>
      </Drawer>
    </>
  );
};

export default ProcedimientoRecetaEditar;
