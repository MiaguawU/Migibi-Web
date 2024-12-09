import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import IngModal from "./IngredienteModal";
import btAg from "../../Img/btagregar.png";
import "../Estilos/ing.css";
import axios from "axios";
import PUERTO from "../../config";

interface IngredientesProps {
  recetaId: number; // ID de la receta
  onSubmit?: boolean; // Indica si se deben guardar los cambios
  onReset?: boolean; // Indica si se debe reiniciar el estado
}


interface Item {
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  isChecked: boolean;
  cantidad: string;
  unidad: string;
  Activo: number;
}

const IngredientesRecetaEditar: React.FC<IngredientesProps> = ({ recetaId, onSubmit, onReset }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [tempDeleted, setTempDeleted] = useState<Item[]>([]);

  const id_receta = recetaId;

  // Función para obtener los ingredientes de la receta
  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/ingredientes/${recetaId}`);
      const ingredientes = response.data
        .filter((ingrediente: any) => ingrediente.Activo > 0) // Filtro dinámico
        .map((ingrediente: any) => ({
          id: ingrediente.id,
          name: ingrediente.Nombre || "Alimento desconocido",
          isChecked: false,
          cantidad: ingrediente.Cantidad,
          unidad: ingrediente.Unidad,
          Activo: ingrediente.Activo,
        }));
      setItems(ingredientes);
      setTempDeleted([]); // Reinicia los ingredientes eliminados temporalmente
      message.success("Ingredientes obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener ingredientes:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar ingredientes al inicio y tras un reset
  useEffect(() => {
    datosAlimento();
  }, []); // Agregar resetTrigger como dependencia

  useEffect(() => {
    if (onReset) {
      // Restablecer el estado de los checkboxes y recargar datos
      setItems((prevItems) =>
        prevItems.map((item) => ({ ...item, isChecked: false }))
      );
      datosAlimento();
    }
  }, [onReset]);

  // Manejar cambio de estado de los checkboxes
  const handleCheckboxChange = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  // Manejar eliminación de ingredientes
  const handleDelete = (index: number) => {
    const itemToDelete = items[index];
    setTempDeleted((prev) => [...prev, itemToDelete]);
    setItems((prev) => prev.filter((_, i) => i !== index)); // Eliminar visualmente
  };

  // Guardar cambios automáticamente al activar onSubmit
  useEffect(() => {
    const guardarCambios = async () => {
      if (onSubmit && tempDeleted.length > 0) {
        try {
          const idsToDelete = tempDeleted.map((item) => item.id);
          await axios.put(`${PUERTO}/ingED`, { ids: idsToDelete, Cantidad: 0 });
          message.success("Cambios guardados exitosamente.");
          setTempDeleted([]); // Limpiar los ingredientes eliminados temporalmente
        } catch (error) {
          console.error("Error al guardar cambios:", error);
          message.error("No se pudieron guardar los cambios.");
        }
      }
    };
    guardarCambios();
  }, [onSubmit]);

  // Abrir y cerrar el Drawer
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

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
          title={<span className="card-title">Ingredientes</span>}
          extra={
            <Button type="link" onClick={toggleDrawer} className="card-button-link">
              Ver más
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
                    {item.name} {item.cantidad} {item.unidad}
                  </Checkbox>
                  <Button danger onClick={() => handleDelete(index)}>
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
          title="Ingredientes"
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
                {item.name} {item.cantidad} {item.unidad}
              </Checkbox>
              <Button danger onClick={() => handleDelete(index)}>
                Eliminar
              </Button>
            </div>
          ))}
        </Drawer>
      </ConfigProvider>

      {/* Modal para agregar ingredientes */}
      <IngModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recetaId={recetaId}
        onSubmit={(newItem: Item) => setItems((prev) => [...prev, newItem])}
      />
    </>
  );
};

export default IngredientesRecetaEditar;
