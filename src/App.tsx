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
import Conocenos from './Front/Conocenos';
import Contactanos from './Front/contactanos';
import Hoy from './Front/Hoy';
import Plan from './Front/Plan';
import Recetas from './Front/Recetas';
import Refri from './Front/Refri';
import EDreceta from './Front/EDreceta';
import VerR from './Front/VerReceta';
import MainLayout from './Front/MainLayout';
import AuthForm from './Front/Componentes/AuthForm';
import { useSession } from "./Front/hook/useSession";
import RecetaVIS from "./Front/RecetaVis";
import Usuarios from './Front/Usuarios';
import Cat_Alimentos from './Front/Cat_Alimentos';
import Catalogos from './Front/Catalogos';
import CambiarContrasenia from './Front/CambiarContrasenia';
import Terminos from './Front/Términos_Condiciones';
import AvisoPriv from './Front/AvisoPriv';


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

const adminItems: ItemType[] = [
  { label: <Link to="/"><img src={btInicio} alt="Inicio" className="img-inicio" /></Link>, key: 'inicio' },
  { label: <Link to="/conocenos" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Conócenos</Link>, key: 'conocenos' },
  { label: <Link to="/recetas" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Recetas</Link>, key: 'recetas' },
  { label: <Link to="/usuarios" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Usuarios</Link>, key: 'usuarios' },
  { label: <Link to="/cat_alimentos" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Alimentos</Link>, key: 'alimentos' },
  { label: <Link to="/catalogos" style={{ fontFamily: 'Jomhuria', fontSize: 30 }}>Catálogos</Link>, key: 'catalogos' },
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
  const [isAdmin, setisAdmin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Forzar re-render después de 100ms
    setTimeout(() => setMenuKey(prev => prev + 1), 100);
  }, []);

  useEffect(() => {
    const usuariosLocal = JSON.parse(localStorage.getItem("usuarios") || "{}");
    const currentUser = localStorage.getItem("currentUser");
    const idUsuario = Number(currentUser);
    const acceso = currentUser && usuariosLocal[currentUser] ? true : false;
    setHasAccess(acceso);
    setisAdmin(idUsuario === 2 && acceso);
  }, []);

  const onLogin = (userData: any) => {
    localStorage.setItem("usuarios", JSON.stringify({ [userData.id]: userData }));
    localStorage.setItem("currentUser", userData.id);
    setHasAccess(true);
  };
  
  const getMainItems = (isAdmin: boolean, hasAccess: boolean) => {
    if (hasAccess) {
      return isAdmin ? adminItems : mainItems;
    }
    return mainItems.slice(0, 2);
  };
  
  const getProfileItems = (hasAccess: boolean) => {
    return hasAccess ? profileItem : accederItem;
  };

  return (
    <MainLayout>
      <header>
        {!isMobile ? (
          <div className="custom-menu">
            <Menu
              key={menuKey}
              mode="horizontal"
              items={getMainItems(isAdmin, hasAccess)}
              className="menu-links"
            />
            <Menu
              mode="horizontal"
              items={getProfileItems(hasAccess)}
              className="profile-link"
            />
          </div>
        ) : (
          <div className="mobile-menu">
            <Button className="btA" onClick={() => setDrawerVisible(true)}>Menú</Button>
            <Drawer
              title="Opciones"
              placement="right"
              onClose={() => setDrawerVisible(false)}
              visible={isDrawerVisible}
            >
              <Menu mode="vertical" items={[
              ...getMainItems(isAdmin, hasAccess),
              ...getProfileItems(hasAccess)
              ]} />
            </Drawer>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/contactanos" element={<Contactanos />} />
          <Route path="/hoy" element={<Hoy />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/refri" element={<Refri />} />
          <Route path="/edReceta" element={<EDreceta />} />
          <Route path="/acceder" element={<AuthForm onLogin={onLogin} />} />
          <Route path="/verR" element={<VerR />} />
          <Route path="/modal" element={<Modal />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/cat_alimentos" element={<Cat_Alimentos />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route path="/recetaVis" element={<RecetaVIS />} />
          <Route path="/cambiarContrasenia" element={<CambiarContrasenia />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/aviso" element={<AvisoPriv />} />


        </Routes>
      </main>
    </MainLayout>
  );
}

export default App;