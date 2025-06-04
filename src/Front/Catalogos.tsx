import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { formatoSQL } from './Metodos/FormatoSQL';
import './Estilos/Catalogos.css';
import axios from 'axios';
import PUERTO from "../config";

const Catalogos: React.FC = () => {
  const [unidades, setUnidades] = useState([]); // Lista de productos
  const [tiposConsumo, setTiposConsumo] = useState([]); // Lista de productos
  const [tiposAlimento, setTiposAlimento] = useState([]); // Lista de productos
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  
  const columnsUnidades: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Unidad_Medida', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Unidad_Medida', key: 'Unidad_Medida' },
    { title: 'Activo', dataIndex: 'Activo', key: 'Activo', 
      filters: [{ text: 'Activo', value: 1, }, { text: 'Inactivo', value: 0,},],
      onFilter: (value, record) => record.Activo === value, },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    { title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta', 
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(), },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
      title: 'Acciones',
      render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Button danger onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Eliminar </Button>
          <Button onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Editar </Button>
        </div>
      </>
      ),
    },
  ];

  const columnsTiposConsumo: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Tipo_Consumo', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Tipo_Consumo', key: 'Unidad_Medida' },
    { title: 'Activo', dataIndex: 'Activo', key: 'Activo', 
      filters: [{ text: 'Activo', value: 1, }, { text: 'Inactivo', value: 0,},],
      onFilter: (value, record) => record.Activo === value, },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    { title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta', 
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(), },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
      title: 'Acciones',
      render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Button danger onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Eliminar </Button>
          <Button onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Editar </Button>
        </div>
      </>
      ),
    },
  ];

  const columnsTiposAlimento: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Tipo_Alimento', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Tipo_Alimento', key: 'Unidad_Medida' },
    { title: 'Activo', dataIndex: 'Activo', key: 'Activo', 
      filters: [{ text: 'Activo', value: 1, }, { text: 'Inactivo', value: 0,},],
      onFilter: (value, record) => record.Activo === value, },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    { title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta', 
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(), },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
      title: 'Acciones',
      render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Button danger onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Eliminar </Button>
          <Button onClick={() => deleteProduct(record.Id_Unidad_Medida)}> Editar </Button>
        </div>
      </>
      ),
    },
  ];

  // Obtener productos desde la API
  const fetchUnidades = async () => {
    try {
      const { data } = await axios.get(`${PUERTO}/unidad/`);
      setUnidades(data);
    } catch (error) {
      message.error('Error al cargar productos');
    }
  };

  const fetchTiposConsumo = async () => {
    try {
      const { data } = await axios.get(`${PUERTO}/tipoC/`);
      setTiposConsumo(data);
    } catch (error) {
      message.error('Error al cargar productos');
    }
  }

  const fetchTiposAlimento = async () => {
    try {
      const { data } = await axios.get(`${PUERTO}/tipoA/`);
      setTiposAlimento(data);
    } catch (error) {
      message.error('Error al cargar productos');
    }
  }

  useEffect(() => {
    fetchUnidades();
    fetchTiposConsumo();
    fetchTiposAlimento();
  }, []);
  
  // Eliminar producto
  const deleteProduct = async (id: number) => {
    console.log(id);
  };

  return (
    <div className='todo'>
      <div className='botones-div'>
        {/* Botón para abrir el modal */}
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Editar Producto
        </Button>
      </div>
      {/* Tabla de productos */}
      <div className='tabla'>
        <Table
          dataSource={unidades}
          columns={ columnsUnidades }
          rowKey="id"
        />
      </div>

      <div className='tabla'>
        <Table
          dataSource={tiposConsumo}
          columns={ columnsTiposConsumo }
          rowKey="id"
        />
      </div>

      <div className='tabla'>
        <Table
          dataSource={tiposAlimento}
          columns={ columnsTiposAlimento }
          rowKey="id"
        />
      </div>
    </div>

    
  );
};

export default Catalogos;