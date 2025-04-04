import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, ConfigProvider, message } from "antd";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import PUERTO from "../../config";
import btAg from "../../Img/btagregar.png";
import InsModal from "./InstruccionModal";

interface Item {
  id: number;
  name: string;
  isChecked: boolean;
  orden: number;
  Activo: number;
}

interface ProcedimientoProps {
  recetaId: number;
  onSubmit?: () => void;
  onReset?: () => void;
}

const ProcedimientoRecetaEditar: React.FC<ProcedimientoProps> = ({ recetaId, onSubmit, onReset }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enviarDatos, setenviarDatos] = useState(false);
  const [tempDeleted, setTempDeleted] = useState<Item[]>([]);
  const [tempAdded, setTempAdded] = useState<Item[]>([]);
  const [resetTrigger, setResetTrigger] = useState(false);

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
      console.log("Instrucciones obtenidas exitosamente.");
    } catch (error) {
      console.error("Error al obtener instrucciones:", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewInstruction = (newInstruction: Item) => {
    setItems((prevItems) => [...prevItems, newInstruction]); // Agregar la nueva instrucción a la lista
    setTempAdded((prev) => [...prev, newInstruction]); // Guardar en tempAdded para enviar luego
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
    if (resetTrigger) {
      datosInstrucciones(); // Recarga las instrucciones originales
      setResetTrigger(false); // Resetea el trigger para evitar loops
    }
  }, [resetTrigger]);
  
  useEffect(() => {
    if (enviarDatos) {
      subirCambios(); // Guarda los cambios en la base de datos
      setenviarDatos(false); // Resetea el estado después de enviar
    }
  }, [enviarDatos]);
  

  const handleDeleteInstruction = (index: number) => {
    const itemToDelete = items[index];
    if (!tempAdded.some((item) => item.id === itemToDelete.id)) {
      setTempDeleted((prev) => [...prev, itemToDelete]);
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejar el cambio en los checkboxes
  const handleCheckboxChange = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id) return;
  
    if (active.id !== over.id) {
      setItems((prevItems) => {
        const newOrder = arrayMove(
          prevItems,
          prevItems.findIndex(i => i.id === active.id),
          prevItems.findIndex(i => i.id === over.id)
        ).map((item, index) => ({ ...item, orden: index + 1 }));
  
        actualizarOrdenEnServidor(newOrder);
        return newOrder;
      });
    }
  };
  
  const actualizarOrdenEnServidor = async (nuevasInstrucciones: Item[]) => {
    try {
      const datosAEnviar = nuevasInstrucciones.map(({ id, orden }) => ({ id, orden }));
      await axios.put(`${PUERTO}/proED/${recetaId}/orden`, { instrucciones: datosAEnviar });
      console.log("Orden actualizado en el servidor.");
    } catch (error) {
      console.error("Error al actualizar orden en el servidor:", error);
      message.error("No se pudo actualizar el orden en el servidor.");
    }
  };
  
  

  const subirCambios = async () => {
    try {
      if (tempAdded.length > 0) {
        await axios.post(`${PUERTO}/proceso/${recetaId}/agregar`, tempAdded);
      }
      if (tempDeleted.length > 0) {
        const idsToDelete = tempDeleted.map((item) => item.id);
        await axios.put(`${PUERTO}/proED`, { ids: idsToDelete });
      }
      console.log("Cambios enviados correctamente.");
      setTempAdded([]);
      setTempDeleted([]);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      console.log("Error al guardar los cambios.");
    }
  };

  useEffect(() => {
    if (onSubmit) {
      setenviarDatos((prev) => !prev); 
      subirCambios();
    }
  }, [onSubmit]);


  

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#638552" } }}>
      <Card title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>Instrucciones</span>} style={{ borderRadius: "8px" }}>
        {loading ? (
          <p>Cargando instrucciones...</p>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div>
                {items.map((item, index) => (
                  <DraggableItem key={item.id} item={item} onToggleCheck={handleCheckboxChange} onDelete={() => handleDeleteInstruction(index)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

    </ConfigProvider>
  );
};

const DraggableItem: React.FC<{ item: Item; onToggleCheck: (id: number) => void; onDelete: () => void }> = ({
  item,
  onToggleCheck,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Checkbox checked={item.isChecked} onChange={() => onToggleCheck(item.id)} style={{ flex: 1 }}>
        {item.orden}. {item.name}
      </Checkbox>
    </div>
  );
};

export default ProcedimientoRecetaEditar;
