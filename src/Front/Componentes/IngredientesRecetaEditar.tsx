import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import IngModal from "./IngredienteModal";
import btAg from '../../Img/btagregar.png';
import '../Estilos/ing.css'; // Importa el archivo CSS
import axios from "axios";
import PUERTO from "../../config"; // Asegúrate de que PUERTO esté configurado correctamente

interface IngredientesProps {
  recetaId: number; // ID de la receta
  onSubmit?: () => void;
  onReset?: () => void; // Ahora opcional
}

interface Item {
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  isChecked: boolean;
  cantidad: string;
  unidad: string;
  Activo: number;
}

const IngredientesRecetaEditar: React.FC<IngredientesProps> = ({
  recetaId,
  onSubmit,
  onReset,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [resetTrigger, setResetTrigger] = useState(false); // Estado para disparar reinicio

  // Manejar envío del formulario desde el modal
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        name: values.name,
        quantity: values.quantity,
        unit: values.unit,
        type: values.type,
      };

      const response = await axios.post(`${PUERTO}/ingredientes`, formData);
      console.log("Ingrediente agregado:", response.data);

      message.success("Ingrediente agregado correctamente.");
      datosAlimento(); // Refrescar la lista de ingredientes
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar ingrediente:", error);
      message.error("No se pudo agregar el ingrediente.");
    }
  };

  const id_receta = recetaId;

  // Función para obtener los ingredientes de la receta
  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/ingredientes/${id_receta}`);
      console.log("Datos recibidos:", response.data);

      const ingredientes = response.data.map((ingrediente: any) => ({
        id: ingrediente.id,
        name: ingrediente.Nombre || "Alimento desconocido",
        isChecked: false,
        cantidad: ingrediente.Cantidad,
        unidad: ingrediente.Unidad,
        Activo: ingrediente.Activo,
      }));

      setItems(ingredientes);
      message.success("Ingredientes obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener Ingredientes:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    datosAlimento();
  }, [resetTrigger]); // Agregar resetTrigger como dependencia

  // Efecto para escuchar el evento onReset
  useEffect(() => {
    onReset && setResetTrigger((prev) => !prev);
  }, [onReset]);

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
      const response = await axios.put(`${PUERTO}/ingED`, {
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
            <>
              <Button
                type="primary"
                onClick={enviarIdsSeleccionados}
                disabled={selectedIds.length === 0}
              >
                Eliminar
              </Button>
              <Button type="link" onClick={toggleDrawer} className="card-button-link">
                Ver más
              </Button>
            </>
          }
          className="card-container"
          bodyStyle={{ padding: "16px" }}
        >
          {loading ? (
            <p>Cargando ingredientes...</p>
          ) : (
            <div className="card-checkbox-container">
              {items
                .filter((item) => item.Activo > 0)
                .map((item, index) => (
                  <div key={index} className="card-checkbox">
                    <Checkbox
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(index)}
                      className="card-checkbox-text"
                    >
                      {item.name} {item.cantidad} {item.unidad}
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
          title="Ingredientes"
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerOpen}
          width={300}
        >
          <p>Formulario aquí...</p>
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
      {/* Modal externo para agregar producto */}
      <IngModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default IngredientesRecetaEditar;
