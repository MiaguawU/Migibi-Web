import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import axios from "axios";
import PUERTO from "../../config";

interface Item {
  id: number; // Representa el Id_Stock_Detalle
  name: string;
  dias: string;
  isChecked: boolean;
  cantidad: string;
}

const PorCaducar: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // Nuevo estado para almacenar los IDs seleccionados
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Función para obtener alimentos por caducar
  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/caducar`);
      console.log("Datos recibidos:", response.data);

      const perecederos = response.data.porcaducar.map((alimento: any) => {
        const fechaCaducidad = alimento.Fecha
          ? new Date(alimento.Fecha)
          : null;

        const diasRestantes = fechaCaducidad
          ? Math.max(
              0,
              Math.ceil(
                (fechaCaducidad.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : "No definida";

        return {
          id: alimento.id,
          name: alimento.Nombre || "Alimento desconocido",
          dias:
            diasRestantes === "No definida"
              ? "Fecha no disponible"
              : `${diasRestantes} días`,
          isChecked: false,
          cantidad: alimento.Cantidad,
        };
      });

      setItems(perecederos);
      message.success("Alimentos obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener alimentos", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la función al montar el componente
  useEffect(() => {
    datosAlimento();
  }, []);

  // Función para abrir/cerrar el Drawer
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
      message.success("Alimentos actualizados exitosamente.");

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
      message.error("No se pudo actualizar el estado de los alimentos.");
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
          title="Por caducar"
          extra={
            <Button
              type="primary"
              onClick={enviarIdsSeleccionados}
              disabled={selectedIds.length === 0}
            >
              Actualizar
            </Button>
          }
          style={{
            width: "auto",
            backgroundColor: "#CEDFAC",
            borderRadius: 8,
            color: "#638552",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
              padding: "10%",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            {loading ? (
              <div>Cargando...</div>
            ) : items.length === 0 ? (
              <div>No hay alimentos por caducar</div>
            ) : (
              items.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Checkbox
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                    style={{
                      fontFamily: "Alice, serif",
                      color: "#40632F",
                    }}
                  >
                    {item.name} - {item.dias}
                  </Checkbox>
                </div>
              ))
            )}
          </div>
        </Card>

        <Drawer
          title="Todos los productos por caducar"
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerOpen}
          width={300}
        >
          {items.length === 0 ? (
            <div>No hay alimentos por caducar</div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                >
                  {item.name} - {item.dias}
                </Checkbox>
              </div>
            ))
          )}
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default PorCaducar;
