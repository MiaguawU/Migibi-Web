import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import btAg from '../../Img/btagregar.png'
import '../Estilos/ing.css'; // Importa el archivo CSS
import axios from "axios";
import PUERTO from "../../config";

interface IngredientesProps {
  recetaId: number; // ID de la receta
}

interface Item {
  id_receta: number;
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  isChecked: boolean;
  cantidad: string;
}

const IngredientesRecetaEditar: React.FC<IngredientesProps> = ({ recetaId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // Nuevo estado para almacenar los IDs seleccionados
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/ingredientes`);
      console.log("Datos recibidos:", response.data);

      const ingredientes = response.data.map((ingrediente: any) => {
        return {
          id_receta: ingrediente.id_receta,
          id: ingrediente.id,
          name: ingrediente.Nombre || "Alimento desconocido",
          isChecked: false,
          cantidad: ingrediente.Cantidad,
        };
      });
      setItems(ingredientes);
      message.success("Ingredientes obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener Ingredientes", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    datosAlimento();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Actualizar estado del checkbox y manejar el arreglo `selectedIds`
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setItems(updatedItems);

    const itemId = updatedItems[index].id;

    setSelectedIds((prevIds) => {
      if (updatedItems[index].isChecked) {
        // Agregar el ID al arreglo si está seleccionado
        return [...prevIds, itemId];
      } else {
        // Eliminar el ID del arreglo si se deselecciona
        return prevIds.filter((id) => id !== itemId);
      }
    });
  };

  // Función para enviar los IDs al servidor
  const enviarIdsSeleccionados = async () => {
    if (selectedIds.length === 0) {
      message.warning("No has seleccionado ningún alimento.");
      return;
    }

    try {
      const response = await axios.put(`${PUERTO}/caducar`, {
        ids: selectedIds, // Enviar los IDs seleccionados
        Cantidad: 0, // Cantidad que deseas actualizar
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
      setSelectedIds([]); // Limpiar la lista de seleccionados
    } catch (error) {
      console.error("Error al actualizar alimentos", error);
      message.error("No se pudo eliminar los Ingredientes.");
    }
  };
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#638552',
          },
        }}
      >
        <Card
          title={<span className="card-title">Ingredientes</span>}
          extra={<Button
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
          <div className="card-checkbox-container">
            {items.slice(0, 5).map((item, index) => (
              <div key={index} className="card-checkbox">
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                  className="card-checkbox-text"
                >
                  {item.name}
                </Checkbox>
              </div>
            ))}
            <Button className="btAg"><img className="img" src={btAg} alt="Agregar" /></Button>
          </div>
        </Card>
      </ConfigProvider>
    </>
  );
};

export default IngredientesRecetaEditar;
