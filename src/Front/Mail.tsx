import React from "react";
import { MailOutlined } from "@ant-design/icons";
import { notification } from "antd";

const Mail: React.FC = () => {
  const handleClick = () => {
    notification.info({
      message: "Contacto por correo",
      description: "El correo para contactarnos es: cincode.official@gmail.com",
      placement: "topRight",
    });
  };

  return (
    <MailOutlined
      onClick={handleClick}
      style={{ color: "black", marginRight: "10px", fontSize: "20px", cursor: "pointer" }}
    />
  );
};

export default Mail;
