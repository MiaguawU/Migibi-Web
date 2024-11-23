import React from 'react';
import logo from './logo.svg';
import './App.css';
import Inicio from './Front/Inicio';
import Perfil from './Front/Perfil';
import Refri from './Front/Refri';
import Acceder from './Front/Acceder';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
            <div>
                <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#282c34', color: 'white' }}>
                  
                    <nav style={{ marginTop: '10px' }}>
                        <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Inicio</Link>
                        <Link to="/perfil" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Perfil</Link>
                        <Link to="/refri" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Refri</Link>
                        <Link to="/acceder" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Acceder</Link>
                    </nav>
                </header>
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/refri" element={<Refri />} />
                        <Route path="/acceder" element={<Acceder />} />
                    </Routes>
                </main>
            </div>
        </Router>
  );
}

export default App;
