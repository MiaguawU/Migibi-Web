import { Link, useNavigate } from 'react-router-dom'; 
import './Estilos/Recetas.css';
import { Input, Button, Select, Space, Tooltip } from 'antd'; // Ant Design
import btEditar from '../Img/btEditar.png';
import def from '../Img/defRec.png';
import btEl from '../Img/btEliminar.png';
import cal from '../Img/imgCal.png';
import tiempo from '../Img/imgTiempo.png';
import btCom from '../Img/btCompartir.png';
import type { SelectProps } from 'antd';
import React, { useState } from 'react';

interface ItemProps {
  label: string;
  value: string;
}

const { Search } = Input;
const options: ItemProps[] = [];

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({
    label: `Long Label: ${value}`,
    value,
  });
}

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options,
  placeholder: 'Select Item...',
  maxTagCount: 'responsive',
};

export default function Recetas() {

  const navigate = useNavigate();
  const onSearch = (value: string) => {
    console.log("Buscando:", value);
    // Lógica para búsqueda
  };

  const [value, setValue] = useState(['a10', 'c12', 'h17', 'j19', 'k20']);

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  };

  const IReditar = () =>{
    navigate('/edReceta');
  };
  const IRver = () =>{
    navigate('/verR');
  };

  
  return (
    <div className="recetas-container">
      <div className="header" >
      <Space direction="vertical" style={{ width: '100%' }} className='buscar'>
      <Select {...sharedProps} {...selectProps}  />
      
    </Space>
        <Button className="btA" onClick={IRver}>Agregar</Button>
      </div>
      <div className="cont">
        <div className="card">
          <img src={def} className="img-rec" alt="Imagen de receta por defecto" />
          <div className="fila1">
            <div className='porciones'>
              <h3>Receta</h3>
              <h3 >/Porciones</h3>
              <Link to="/edReceta" className='btD'>
                <img src={btEditar} alt="Editar receta" className="edit" />
              </Link>
            </div>
            <Button className='btE'>
              <img src={btEl} alt="Eliminar receta" className="edit" />
            </Button>
          </div>
          <div className="fila2">
            <img src={cal} alt="Calorías" className='img' />
            <p className='txA' >Calorías</p>
            <img src={tiempo} alt="Tiempo" className='img2'/>
            <p className='txA'>Tiempo</p>
            <Button className='btC'>
              <img src={btCom} alt="Compartir receta" className="edit" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
