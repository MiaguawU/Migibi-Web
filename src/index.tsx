import React from 'react';
import ReactDOMClient from 'react-dom/client';
import ReactDOM from "react-dom";
import './index.css';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import "antd/dist/reset.css"; 
import { ConfigProvider } from 'antd';

// Interfaz para los datos del usuario
interface UserData {
  id?: string;
  username?: string;
  email?: string;
  foto_perfil?: string;
  Cohabitantes?: string;
  message?: string;
}

// Extraer parámetros de la URL
const queryParams = new URLSearchParams(window.location.search);
const userData: UserData = {};

// Convertir parámetros de URL a un objeto tipado
queryParams.forEach((value, key) => {
  userData[key as keyof UserData] = decodeURIComponent(value);
});

// Procesar los datos de la URL
if (Object.keys(userData).length > 0) {
  (async () => {
    try {
      // Enviar los datos al servidor
      const response = await axios.post("http://localhost:5000/save", userData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Datos enviados al servidor:", response.data);

      // Guardar los datos en localStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{ }");
      const { id, username, email, foto_perfil, Cohabitantes } = userData;
      

      if (id) {
        usuarios[id] = { username, email, foto_perfil, Cohabitantes };
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("currentUser", id);
        console.log("Datos guardados en  localStorage.");
      } else {
        console.warn("ID de usuario no proporcionado. No se guardaron los datos.");
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
    }
  })();
}

const root = ReactDOMClient.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

reportWebVitals();
