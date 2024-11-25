import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import 'antd/dist/reset.css';
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
import VerR from './Front/VerReceta';

type ItemType = Required<MenuProps>['items'][number];

const mainItems: ItemType[] = [
  { label: <Link to="/"><img src={btInicio} alt="Inicio" className="img-inicio" /></Link>, key: 'inicio' },
  { label: <Link to="/conocenos" style={{fontFamily: 'Jomhuria' , fontSize: 30}}>Conócenos</Link>, key: 'conocenos' },
  { label: <Link to="/hoy" style={{fontFamily: 'Jomhuria' , fontSize: 30}}>Hoy</Link>, key: 'hoy' },
  { label: <Link to="/plan1" style={{fontFamily: 'Jomhuria' , fontSize: 30}}>Plan</Link>, key: 'plan' },
  { label: <Link to="/recetas" style={{fontFamily: 'Jomhuria' , fontSize: 30}}>Recetas</Link>, key: 'recetas' },
  { label: <Link to="/refri" style={{fontFamily: 'Jomhuria' , fontSize: 30}}>Refri</Link>, key: 'refri' },
];

const profileItem: ItemType[] = [
  { label: <Link to="/perfil"><img src={btPerfil} alt="Perfil" className="img-perfil" /></Link>, key: 'perfil' },
];

function App() {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <Router>
      <div>
        <header>
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

          {/* Botón de menú en pantallas pequeñas */}
          <div className="mobile-menu">
            <Button className="btA" onClick={showDrawer}>Menú</Button>
            <Drawer
              title="Opciones"
              placement="right"
              onClose={closeDrawer}
              open={isDrawerVisible}
            >
              <Menu mode="vertical" items={[...mainItems, ...profileItem]} />
            </Drawer>
          </div>
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
            <Route path="/verR" element={<VerR />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
