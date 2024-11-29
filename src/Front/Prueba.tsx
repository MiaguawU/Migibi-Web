import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const UserInfo: React.FC = () => {
  // Obtener información del usuario desde localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card
        style={{
          width: '80vw',
          maxWidth: '500px',
          backgroundColor: "#E1EBCD",
          borderRadius: 10,
          padding: "16px",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Title level={4} style={{ textAlign: "center", color: "#669144" }}>
          Información de la Sesión
        </Title>
        {user ? (
  <>
    <Paragraph><strong>Nombre:</strong> {user.id}</Paragraph>
    <Paragraph><strong>Email:</strong> {user.email || "No especificado"}</Paragraph>
  </>
) : (
  <Paragraph style={{ textAlign: "center", color: "#FF4D4F" }}>
    No hay información de sesión disponible.
  </Paragraph>
)}

      </Card>
    </div>
  );
};

export default UserInfo;
