import React, { useState } from "react";
import { Modal, Form, Input, Button, InputNumber, ConfigProvider, message } from "antd";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd"; // ✅ Importación corregida

import PUERTO from "../../config";

const { TextArea } = Input;

interface Instruction {
  id: string;
  content: string;
  orden: number;
  name: string;
}

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  recetaId: number;
  instructions: Instruction[];
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
}

const InsModal: React.FC<FormModalProps> = ({ visible, onClose, recetaId, instructions, setInstructions }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { orden: number; instruccion: string }) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    const data = {
      orden: values.orden,
      instruccion: values.instruccion,
      Id_Usuario_Alta: Number(currentUser),
    };

    try {
      const response = await axios.post(`${PUERTO}/proED/${recetaId}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success("Instrucción agregada correctamente.");
        form.resetFields();

        const newInstruction: Instruction = {
          id: crypto.randomUUID(),
          content: values.instruccion,
          orden: values.orden,
          name: values.instruccion, // Asegurar que coincida con la estructura de Instruction
        };

        setInstructions([...instructions, newInstruction]);

        onClose();
      } else {
        message.error("Error al agregar la instrucción.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      message.error("Error al procesar la solicitud. Intenta de nuevo.");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(instructions);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setInstructions(reorderedItems);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3E7E1E",
          borderRadius: 10,
          colorBgContainer: "#CAE2B5",
        },
      }}
    >
      <Modal title="Agregar Instrucción" open={visible} onCancel={onClose} footer={null}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="orden" label="Orden" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item name="instruccion" label="Instrucción" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar
            </Button>
          </Form.Item>
        </Form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="instructions">
            {(provided: DroppableProvided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {instructions.map((item: Instruction, index: number) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "10px",
                          margin: "5px 0",
                          backgroundColor: "#f0f0f0",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.orden}. {item.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Modal>
    </ConfigProvider>
  );
};

export default InsModal;
