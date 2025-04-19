import React from "react";
import { useNavigate } from "react-router-dom";
import type { PopconfirmProps } from "antd";
import { Card, Button, Tooltip, Popconfirm, ConfigProvider } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

interface RecipeCardProps {
  id: number;
  title: string;
  portions: string;
  calories: string;
  time: string;
  image: string;
  editar: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  portions,
  calories,
  time,
  image,
  editar,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recetaVis?id=${id}`);
  };

  // Envolver onDelete para evitar propagación cuando se confirma
  const handleDeleteConfirm = (e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    onDelete();
  };
  

  return (
    <ConfigProvider>
      <Card
        hoverable
        style={{
          border: "1px solid #3E7E1E",
          borderRadius: "10px",
          overflow: "hidden",
        }}
        onClick={handleCardClick}
        actions={
          editar
            ? [
                <Tooltip title="Editar" key="edit">
                  <Button
                    type="text"
                    icon={<EditOutlined style={{ color: "#86A071" }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Eliminar" key="delete">
                  <Popconfirm
                    title="Borrar la receta"
                    description="¿Está seguro de borrar la receta de su plan?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>

                </Tooltip>,
              ]
            : []
        }
      >
        <div
          style={{
            border: "1px solid #3E7E1E",
            borderRadius: "10px",
            overflow: "hidden",
            alignContent: "center",
            display: "flex",
          }}
        >
          <img
            alt={title}
            src={image}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 35,
                color: "#86A071",
                fontFamily: "Jomhuria, sans-serif",
              }}
            >
              {title} / Porciones: {portions}
            </span>
          </div>
          <div
            style={{
              fontFamily: "Jomhuria, sans-serif",
              fontSize: "20px",
              color: "#86A071",
            }}
          >
            <span style={{ marginRight: "10px" }}>
              <ThunderboltOutlined /> {calories}
            </span>
            <span>
              <ClockCircleOutlined /> {time}
            </span>
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
};

export default RecipeCard;
