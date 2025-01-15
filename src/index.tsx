// Importar dependencias
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import ReactDOM from "react-dom";
import './index.css';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import "antd/dist/reset.css"; 
import { ConfigProvider } from 'antd';

// Definición de la interfaz para los datos del usuario
interface UserData {
  id?: string;
  username?: string;
  email?: string;
  foto_perfil?: string;
  Cohabitantes?: string;
  message?: string;
}

// Función para obtener y procesar los parámetros de la URL
const getUserDataFromURL = (): UserData => {
  const queryParams = new URLSearchParams(window.location.search);
  const userData: UserData = {};

  queryParams.forEach((value, key) => {
    userData[key as keyof UserData] = decodeURIComponent(value);
  });

  return userData;
};

// Función para enviar datos al servidor y gestionar el almacenamiento local
const processUserData = async (userData: UserData) => {
  try {
    // Enviar los datos al servidor
    const response = await axios.post("http://localhost:5000/save", userData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Datos enviados al servidor:", response.data);

    // Guardar los datos en localStorage si hay un ID proporcionado
    const { id, username, email, foto_perfil, Cohabitantes } = userData;
    if (id) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");
      usuarios[id] = { username, email, foto_perfil, Cohabitantes };

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("currentUser", id);

      console.log("Datos guardados en localStorage.");
    } else {
      console.warn("ID de usuario no proporcionado. No se guardaron los datos.");
    }
  } catch (error) {
    console.error("Error al enviar los datos al servidor:", error);
  }
};

// Obtener datos del usuario desde la URL y procesarlos si existen
const userData = getUserDataFromURL();
if (Object.keys(userData).length > 0) {
  processUserData(userData);
}

// Configuración del punto de entrada de React
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

// Reporte de métricas de rendimiento
reportWebVitals();
