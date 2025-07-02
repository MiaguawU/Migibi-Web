import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Input, ConfigProvider, Button, Card, Typography, message } from "antd";
import { MailFilled } from '@ant-design/icons';
import { customColors } from '../Front/Estilos/colores';
import "./perfil.css";
import PUERTO from "../config";
import axios from "axios";

const { Title } = Typography;

const VerificarCorreo: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

    const correctEmailFormat = (email: string): string => {
        // Elimina espacios en blanco, corrige errores menores como "@gmial.com" → "@gmail.com"
        return email
            .trim()
            .replace(/\s+/g, '') // Elimina espacios
            .replace(/@gmai\.com$/, '@gmail.com') // Corrige errores comunes
            .toLowerCase(); // Normaliza a minúsculas
    };

    const validateEmailFormat = (email: string): boolean => {
        // Expresión regular para validar correos de Gmail correctamente formateados
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    const handleSubmit = async () => { // Make handleSubmit async
        const formattedEmail = correctEmailFormat(email); // Use the formatted email

        if (!validateEmailFormat(formattedEmail)) {
            return message.error("Ingrese un correo de Gmail válido.");
        }

        const data = { email: formattedEmail }; // Send the formatted email
        console.log("📤 Enviando solicitud de recuperación de contraseña al servidor:", data);

        try {
            // **CHANGE THIS LINE: Point to your backend's password recovery endpoint**
            // Based on your previous backend code, this should be /password (or similar if you named it differently for the "request reset" part)
            const response = await axios.post(`${PUERTO}/password`, data, { headers: { "Content-Type": "application/json" } });
            console.log("✅ Respuesta del servidor:", response.data);

            // You might want to remove this if not strictly needed for this flow
            // localStorage.setItem("user", JSON.stringify(response.data)); 
            
            message.success("Si el correo electrónico está registrado, se ha enviado un enlace de recuperación.");
            // Optionally navigate after success, but a generic message is often better for security
            // setTimeout(() => navigate("/login"), 3000); 

        } catch (error) {
            console.error("❌ Error al solicitar recuperación de contraseña:", error);

            if (axios.isAxiosError(error)) {
                // For security, it's often better to give a generic message even on error
                // to prevent leaking information about registered emails.
                const errorMsg = error.response?.data?.message || "Hubo un problema al procesar su solicitud. Por favor, intente de nuevo.";
                message.error(errorMsg);
            } else {
                message.error("Error inesperado al solicitar recuperación de contraseña.");
            }
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 10,
                    colorBgContainer: 'white',
                    colorBorderSecondary: 'white',
                },
                components: {
                    Input: {
                        borderRadius: 15,
                        controlHeight: 42,
                        lineWidth: 2,
                        activeBorderColor: '#6fb804',
                        hoverBorderColor: '#84d706',
                        activeShadow: '0 0 0 2px rgba(150, 245, 12, 0.22)',
                        colorBorder: '#b8f845',
                        colorPrimaryActive: '#96f20a',
                        colorPrimaryHover: '#96f20a',
                    },
                    Button: {
                        borderRadius: 15,
                        controlHeight: 42,
                        lineWidth: 2,
                        colorBorder: customColors.colorFrio3,
                    }
                },
            }}
        >
            <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <Card
                    style={{
                        width: '80vw',
                        maxWidth: '500px',
                        backgroundColor: "white",
                        padding: "16px",
                    }}
                    bodyStyle={{ padding: "16px", display: 'flex', gap: '12px', flexDirection: 'column' }}
                >
                    <Title level={3} style={{ textAlign: "center", color: customColors.colorFrio3 }}>
                        Verificar Correo
                    </Title>
                    <Title level={5} style={{ textAlign: "center", color: customColors.colorFuerteCalido, fontWeight: 'light' }}>
                        Le enviaremos un correo para verificar su identidad.
                    </Title>
                    <Input
                        placeholder={"Correo Electrónico"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        prefix={<MailFilled style={{ fontSize: '20px', color: customColors.colorPrimarioClaro, fontWeight: 'bolder' }} />}
                    />
                    <Button
                        type="primary" className='poppins-semibold'
                        onClick={handleSubmit}
                    >
                        Enviar correo
                    </Button>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default VerificarCorreo;