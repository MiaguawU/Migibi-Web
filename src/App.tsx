import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Drawer } from 'antd';
import type { MenuProps } from 'antd';
import './Front/Estilos/Nav.css';
import Modal from './Front/Modal';
import btInicio from './Img/btInicio.png';
import btPerfil from './Img/btPerfil.png';
import Inicio from './Front/Inicio';
import Perfil from './Front/Perfil';
import Caducar from './Front/Componentes/PorCaducar';
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
import MainLayout from './Front/MainLayout';
import Prueba from './Front/PruebaCam';
import AuthForm from './Front/Componentes/AuthForm';
import IngRecetaEditar from './Front/Componentes/IngredientesRecetaEditar';
import ProcRecetaEditar from './Front/Componentes/ProcedimientoEditar';
import InstruccionModal from './Front/Componentes/InstruccionModal';
import Ingrediente from './Front/Componentes/IngredienteModal';
import { useSession } from "./Front/hook/useSession";

type ItemType = Required<MenuProps>['items'][number];

const mainItems: ItemType[] = [
  { label: <Link to="/"><img src={btInicio} alt="Inicio" className="img-inicio" /></Link>, key: 'inicio' },
  { label: <Link to="/conocenos" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Conócenos</Link>, key: 'conocenos' },
  { label: <Link to="/hoy" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Hoy</Link>, key: 'hoy' },
  { label: <Link to="/plan" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Plan</Link>, key: 'plan' },
  { label: <Link to="/recetas" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Recetas</Link>, key: 'recetas' },
  { label: <Link to="/refri" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Refri</Link>, key: 'refri' },
  { label: <Link to="/modal" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Modal</Link>, key: 'modal' },
];

const profileItem: ItemType[] = [
  { label: <Link to="/perfil"><img src={btPerfil} alt="Perfil" className="img-perfil" /></Link>, key: 'perfil' },
];

const accederItem: ItemType[] = [
  { label: <Link to="/acceder" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Acceder</Link>, key: 'acceder' },
];

function App() {
  const { session, setSession, clearSession } = useSession<{ userId: number; name: string }>();
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios") || "{}");
    const currentUser = localStorage.getItem("currentUser");

    setHasAccess(currentUser && usuariosLocal[currentUser] ? true : false);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const onLogin = (userData: any) => {
    localStorage.setItem("usuarios", JSON.stringify({ [userData.id]: userData }));
    localStorage.setItem("currentUser", userData.id);
    setHasAccess(true);
  };
  
  

  return (
    <MainLayout>
      <header>
        {isMobile ? (
          <div className="mobile-menu">
            <Button className="btA" onClick={() => setDrawerVisible(true)}>Menú</Button>
            <Drawer
              title="Opciones"
              placement="right"
              onClose={() => setDrawerVisible(false)}
              visible={isDrawerVisible}
            >
              <Menu mode="vertical" items={hasAccess ? [...mainItems, ...profileItem] : [...mainItems.slice(0, 3), ...accederItem]} />
            </Drawer>
          </div>
        ) : (
          <div className="custom-menu">
            <Menu
              mode="horizontal"
              items={hasAccess ? mainItems : mainItems.slice(0, 2)}
              className="menu-links"
            />
            <Menu
              mode="horizontal"
              items={hasAccess ? profileItem : accederItem}
              className="profile-link"
            />
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/contactanos" element={<Contactanos />} />
          <Route path="/hoy" element={<Plan2 />} />
          <Route path="/plan" element={<Plan1 />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/refri" element={<Refri />} />
          <Route path="/edReceta" element={<EDreceta />} />
          <Route path="/acceder" element={<AuthForm onLogin={onLogin} />} />
          <Route path="/verR" element={<VerR />} />
          <Route path="/modal" element={<Modal />} />
        </Routes>
      </main>
    </MainLayout>
  );
}

export default App;
