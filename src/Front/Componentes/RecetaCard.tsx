import React from "react";
import type { PopconfirmProps } from 'antd';
import { Card, Button, Tooltip, Popconfirm, ConfigProvider } from "antd";
import { EditOutlined, DeleteOutlined, ShareAltOutlined, ClockCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";

interface RecipeCardProps {
  id: number;
  title: string;
  portions: string;
  calories: string;
  time: string;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}

const cancel: PopconfirmProps['onCancel'] = (e) => {
};

const RecipeCard: React.FC<RecipeCardProps> = ({ id ,title, portions, calories, time, image, onEdit, onDelete }) => {
  return (
    <ConfigProvider>
    <Card
        hoverable
        style={{
            border: '1px solid #3E7E1E',
            borderRadius: '10px',
            overflow: 'hidden', // Asegura que el contenido (imagen) respete el borderRadius
        }}
      actions={[
        <Tooltip title="Editar">
          <Button type="text" icon={<EditOutlined style={{color: "#86A071"}}/>} onClick={onEdit} />
        </Tooltip>,
        <Tooltip title="Eliminar">
          <Popconfirm
            title="Borrar la receta"
            description="¿Está seguro de borrar la receta de su plan?"
            onConfirm={onDelete}
            onCancel={cancel}
            okText="Sí"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Tooltip>,
      ]}
    >
    <div
        style={{
        border: '1px solid #3E7E1E',
        borderRadius: '10px',
        overflow: 'hidden', // Asegura que la imagen no se salga de los bordes
        alignContent: 'center',
        display: 'flex'
        }}
    >
        <img
        alt={title}
        src={image}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
        />
    </div>

    <div
        style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px',
        }}
    >
        <div
        style={{
        display: 'flex',
        flexDirection: 'column',
        }}
        >
            <span style={{fontSize: 35, color: '#86A071', fontFamily: 'Jomhuria, sans-serif'}}>
                {title}
                {` / Porciones: ${portions}`}
            </span>
            <span style={{fontSize: 2, color: '#86A071', fontFamily: 'Jomhuria, sans-serif'}}>
                {`Porciones: ${portions}`}
            </span>
        </div>
        <div style={{ fontFamily: 'Jomhuria, sans-serif', fontSize: "20px", color: "#86A071" }}>
          <span style={{ marginRight: "10px" }}>
            <ThunderboltOutlined /> {calories}
          </span>
          <span>
            <ClockCircleOutlined /> {time}
          </span>
            
            {
              //<Tooltip title="Compartir">
              //<Button type="text" icon={<ShareAltOutlined style={{color: "#86A071"}}/>} />
              //</Tooltip>
            }
        </div>
       </div>
    </Card>
    </ConfigProvider>
  );
};

export default RecipeCard;
