import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import 'antd/dist/reset.css'; // Estilos base de Ant Design
import './Front/Estilos/Nav.css';
import btInicio from './Img/btInicio.png';
import btPerfil from './Img/btPerfil.png';
import Inicio from './Front/Inicio';
import Perfil from './Front/Perfil';
import Conocenos from './Front/Conocenos';
import Contactanos from './Front/contactanos';
import Hoy from './Front/Hoy';
import Plan1 from './Front/Plan1';
import Plan2 from './Front/Plan2';
import Recetas from './Front/Recetas';
import Refri from './Front/Refri';
import EDreceta from './Front/EDreceta';
import Acceder from './Front/Acceder';

// Menú principal de navegación
const mainItems: MenuProps['items'] = [
  { label: <Link to="/"><img src={btInicio} alt="Inicio" className="img-inicio" /></Link>, key: 'inicio' },
  { label: <Link to="/conocenos">Conócenos</Link>, key: 'conocenos' },
  { label: <Link to="/contactanos">Contáctanos</Link>, key: 'contactanos' },
  { label: <Link to="/hoy">Hoy</Link>, key: 'hoy' },
  { label: <Link to="/plan1">Plan</Link>, key: 'plan' },
  { label: <Link to="/recetas">Recetas</Link>, key: 'recetas' },
  { label: <Link to="/refri">Refri</Link>, key: 'refri' },
];

// Menú de perfil
const profileItem: MenuProps['items'] = [
  { label: <Link to="/perfil"><img src={btPerfil} alt="Perfil" className="img-perfil" /></Link>, key: 'perfil' },
];

// Componente principal
function App() {
  return (
    <Router>
      <div>
        <header>
          {/* Menú con Ant Design */}
          <div className="custom-menu">
            <Menu
              mode="horizontal"
              items={mainItems}
              className="menu-links"
            />
            <Menu
              mode="horizontal"
              items={profileItem}
              className="profile-link"
            />
          </div>
          {/* Menú manual con Link */}
          <nav style={{ marginTop: '10px' }}>
            <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/perfil" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Perfil</Link>
            <Link to="/refri" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Refri</Link>
            <Link to="/acceder" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Acceder</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/conocenos" element={<Conocenos />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/hoy" element={<Hoy />} />
            <Route path="/plan1" element={<Plan1 />} />
            <Route path="/plan2" element={<Plan2 />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route path="/refri" element={<Refri />} />
            <Route path="/edReceta" element={<EDreceta />} />
            <Route path="/acceder" element={<Acceder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
