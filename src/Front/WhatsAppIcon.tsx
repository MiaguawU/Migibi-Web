import React from "react";
import { WhatsAppOutlined } from "@ant-design/icons";
import { notification } from "antd";

const WhatsAppIcon: React.FC = () => {
  const handleClick = () => {
    notification.info({
      message: "Contacto por WhatsApp",
      description: "El número para contactarnos es: +52 1 55 2268 9442",
      placement: "topRight",
    });
  };

  return (
    <WhatsAppOutlined
      onClick={handleClick}
      style={{
        color: "black",
        marginRight: "10px",
        fontSize: "20px",
        cursor: "pointer",
      }}
    />
  );
};

export default WhatsAppIcon;
