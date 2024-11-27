import React, { useState } from 'react';
import './Notificacion.css'; // Estilo personalizado

const PruebaCam = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false);
  const [mostrarFormularioEmail, setMostrarFormularioEmail] = useState(false); // Estado para el tercer formulario (email)
  const [plan, setPlan] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState(''); // Estado para el email
  const [mostrarNotificacionExito, setMostrarNotificacionExito] = useState(false);
  const [mostrarNotificacionError, setMostrarNotificacionError] = useState(false);
  const [mostrarNotificacionUsuario, setMostrarNotificacionUsuario] = useState(false);
  const [mostrarNotificacionEmail, setMostrarNotificacionEmail] = useState(false); // Estado para la nueva notificación de email

  // Función para alternar la visibilidad del formulario del plan
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  // Función para alternar la visibilidad del formulario del usuario
  const toggleFormularioUsuario = () => {
    setMostrarFormularioUsuario(!mostrarFormularioUsuario);
  };

  // Función para alternar la visibilidad del formulario de email
  const toggleFormularioEmail = () => {
    setMostrarFormularioEmail(!mostrarFormularioEmail);
  };

  // Manejo de agregar plan
  const handleAgregarPlan = () => {
    if (plan.trim() === '') {
      setMostrarNotificacionError(true);
      setTimeout(() => {
        setMostrarNotificacionError(false);
      }, 3000);
      return;
    }

    setMostrarNotificacionExito(true);
    setTimeout(() => {
      setMostrarNotificacionExito(false);
    }, 3000);

    setPlan('');
    setMostrarFormulario(false);
  };

  // Manejo de agregar usuario
  const handleAgregarUsuario = () => {
    if (usuario.trim() === '') {
      alert('Por favor, ingresa un nombre de usuario.');
      return;
    }

    setMostrarNotificacionUsuario(true);
    setTimeout(() => {
      setMostrarNotificacionUsuario(false);
    }, 3000);

    setUsuario('');
    setMostrarFormularioUsuario(false);
  };

  // Manejo de agregar email
  const handleAgregarEmail = () => {
    if (email.trim() === '') {
      alert('Por favor, ingresa un email.');
      return;
    }

    setMostrarNotificacionEmail(true);
    setTimeout(() => {
      setMostrarNotificacionEmail(false);
    }, 3000);

    setEmail('');
    setMostrarFormularioEmail(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Conócenos</h1>
      <p>Bienvenido a nuestra sección de "Conócenos". Aquí puedes aprender más sobre nosotros y nuestros productos.</p>

      <button onClick={toggleFormulario} style={{ margin: '10px 0' }}>
        {mostrarFormulario ? 'Cancelar' : 'Agregar Plan'}
      </button>

      {/* Primer formulario para el plan */}
      {mostrarFormulario && (
        <div style={{ marginTop: '20px' }}>
          <input
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Nombre del Plan"
            style={{
              width: '300px',
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <br />
          <button
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={handleAgregarPlan}
          >
            Agregar Plan
          </button>
        </div>
      )}

      <br />
      <button onClick={toggleFormularioUsuario} style={{ margin: '10px 0' }}>
        {mostrarFormularioUsuario ? 'Cancelar' : 'Agregar Usuario'}
      </button>

      {/* Segundo formulario para el nombre de usuario */}
      {mostrarFormularioUsuario && (
        <div style={{ marginTop: '20px' }}>
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Nombre de Usuario"
            style={{
              width: '300px',
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <br />
          <button
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={handleAgregarUsuario}
          >
            Agregar Usuario
          </button>
        </div>
      )}

      <br />
      <button onClick={toggleFormularioEmail} style={{ margin: '10px 0' }}>
        {mostrarFormularioEmail ? 'Cancelar' : 'Agregar Email'}
      </button>

      {/* Tercer formulario para el email */}
      {mostrarFormularioEmail && (
        <div style={{ marginTop: '20px' }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: '300px',
              marginBottom: '10px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <br />
          <button
            style={{
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={handleAgregarEmail}
          >
            Agregar Email
          </button>
        </div>
      )}

      {/* Notificación de éxito (Plan) */}
      {mostrarNotificacionExito && (
        <div className="notificacion-con-imagen">
         
        </div>
      )}

      {/* Notificación de error (Plan vacío) */}
      {mostrarNotificacionError && (
        <div className="notificacion-con-imagen2">
         
        </div>
      )}

      {/* Notificación de éxito (Usuario) */}
      {mostrarNotificacionUsuario && (
        <div className="notificacion-con-imagen3">
          
        </div>
      )}

      {/* Notificación de éxito (Email) */}
      {mostrarNotificacionEmail && (
        <div className="notificacion-con-imagen4">
          
        </div>
      )}
    </div>
  );
};

export default PruebaCam;
