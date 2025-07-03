import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message, List } from "antd";
import IngModal from "./IngredienteModal";
import EditarIngredienteModal from "./EditarIngredienteModal";
import {EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { customColors } from "../Estilos/colores";
import { toFraction } from "../Metodos/FormatoCantidad";
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
}

const IngredientesRecetaEditar: React.FC<IngredientesProps> = ({ recetaId, onSubmit, onReset }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ingredienteEditando, setIngredienteEditando] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [tempDeleted, setTempDeleted] = useState<Item[]>([]);

  const id_receta = recetaId;

  // Función para obtener los ingredientes de la receta
  const datosAlimento = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
              message.warning("No hay un usuario logueado actualmente.");
              setLoading(false);
              return;
            }
                          
            const userId = parseInt(currentUser, 10); // Asegurarse de convertir a número
            if (isNaN(userId)) {
              message.error("ID de usuario inválido.");
              setLoading(false);
              return;
            }
      const response = await axios.get(`${PUERTO}/ingED/${recetaId}/${userId}`);
      const ingredientes = response.data
        .filter((ingrediente: any) => ingrediente.Activo > 0) // Filtro dinámico
        .map((ingrediente: any) => ({
          id: ingrediente.id,
          name: ingrediente.Nombre || "Alimento desconocido",
          isChecked: false,
          cantidad: ingrediente.Cantidad,
          unidad: ingrediente.Unidad,
        }));
      setItems(ingredientes);
      setTempDeleted([]); // Reinicia los ingredientes eliminados temporalmente
    } catch (error: any) {
          console.error("Error al actualizar receta:", error);
        
          // Verifica si hay una respuesta del servidor
          if (error.response) {
            const { status, data } = error.response;
        
            if (data?.error) {
              // Mostrar mensaje enviado por el servidor
              console.log(data.error);
            } else {
              // Si no hay mensaje específico, mostrar código de error
              console.log(`Error del servidor: ${status}`);
            }
          } else {
            // Error sin respuesta del servidor (por ejemplo, red desconectada)
            console.log("Error de red o el servidor no respondió.");
          }
        } finally {
      setLoading(false);
    }
  };

  const [refreshTrigger, setRefreshTrigger] = useState(false);
  
    // Cargar ingredientes al inicio y tras un reset
    useEffect(() => {
      datosAlimento(); // Vuelve a cargar los datos cuando cambie refreshTrigger
    }, [refreshTrigger]);

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

  const handleEditClick = () => {
    const ingrediente = items.find(item => item.id === selectedId);
    if (ingrediente) {
      setIngredienteEditando(ingrediente);
      setIsEditModalOpen(true);
    }
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
          },
        }}
      >
        <Card
          title={<span>Ingredientes</span>}
          extra={
            <Button type="link" onClick={toggleDrawer}>
              Ver más
            </Button>
          }
          className="card-container"
          bodyStyle={{ padding: "0px" }}
        >
          {loading ? (
            <p>Cargando ingredientes...</p>
          ) : (
            <div>
            <List
              itemLayout="horizontal"
              dataSource={items}
              className="card-checkbox-container"
              style={{
                maxHeight: 300, // Ajusta la altura máxima deseada
                overflowY: 'auto',
              }}
              renderItem={(item: Item, index) => (
                <List.Item className="card-checkbox" key={index}>
                  <Checkbox
                    checked={item.id === selectedId}
                    onChange={() => setSelectedId(item.id === selectedId ? null : item.id)}
                    className="card-checkbox-text"
                  >
                    {item.name} {toFraction(item.cantidad)} {item.unidad}
                  </Checkbox>
                  <Button danger onClick={() => handleDelete(index)}>
                    Eliminar
                  </Button>

                </List.Item>
              )}
            />
            <Button className="btAg" onClick={() => setIsModalOpen(true)}>
              <PlusCircleOutlined style={{fontSize: 'xx-large', color: customColors.colorFrio2}} />
            </Button>
            <Button
              className="btEd"
              disabled={selectedId === null}
              onClick={() => handleEditClick() }
            >
              <EditOutlined style={{ fontSize: 'xx-large', color: customColors.colorFrio2 }} />
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
        onSubmit={(newItem) => {
          setItems((prev) => [...prev, newItem]); // Agregar directamente el nuevo ingrediente
          setIsModalOpen(false);
        }}
      />
      {/* Modal para editar ingrediente */}
      <EditarIngredienteModal
        visible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIngredienteEditando(null);
        }}
        recetaId={recetaId}
        ingrediente={ingredienteEditando}
        onSubmit={(ingredienteActualizado) => {
          setItems(prev =>
            prev.map(item =>
              item.id === ingredienteActualizado.id ? ingredienteActualizado : item
            )
          );
          setIsEditModalOpen(false);
          setIngredienteEditando(null);
        }}
      />

    </>
  );
};

export default IngredientesRecetaEditar;