import React, { useState, useEffect } from 'react';
import { Table, Button, message, Tag, Popconfirm } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { formatoSQL } from './Metodos/FormatoSQL'; // Asegúrate de que este archivo exista y sea necesario
import './Estilos/Catalogos.css';
import axios from 'axios';
import PUERTO from "../config"; 
import UnidadModal from "./Componentes/Admin/Ag_EdUnidad";
import ConsumoModal from "./Componentes/Admin/Ag_EdTConsumo";
import TAlimentoModal from "./Componentes/Admin/Ag_EdTAlimento";

const Catalogos: React.FC = () => {
  const [unidades, setUnidades] = useState([]);
  const [tiposConsumo, setTiposConsumo] = useState([]);
  const [tiposAlimento, setTiposAlimento] = useState([]);
  const [isModalUnidad, setIsModalUnidad] = useState(false);
  const [isModalCons, setIsModalCons] = useState(false);
  const [isModalAli, setIsModalAli] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idUnidad, setIdUnidad] = useState<number | null>(null);
  const [idAli, setIdAli] = useState<number | null>(null);
  const [idCons, setIdCons] = useState<number | null>(null);
  const [idRol, setIdRol] = useState<number | undefined>(undefined);

  const rowSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const columnsUnidades: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Unidad_Medida', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Unidad_Medida', key: 'Unidad_Medida' },
    {title: 'Abreviacion', dataIndex: 'Abreviatura', key: 'Abreviatura'},
    {
    title: 'Activo',
    dataIndex: 'Activo',
    key: 'Activo',
    render: (activo: number) => (
      activo === 1 ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>
    ),
    filters: [{ text: 'Activo', value: 1 }, { text: 'Inactivo', value: 0 }],
    onFilter: (value, record) => record.Activo === value,
    },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    {
      title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(),
    },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
    title: 'Acciones',
    render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Popconfirm
            title={`¿Estás seguro de eliminar a "${record.Unidad_Medida}"?`}
            onConfirm={() => deleteUnidad(record.Id_Unidad_Medida)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>
            Eliminar
          </Button>
          </Popconfirm>
          <Button color="primary" variant="outlined" onClick={() => editUnidad(record.Id_Unidad_Medida)}>
            Editar
          </Button>
          <Button
            color="purple" 
            variant="outlined" 
            onClick={() => activarUnidad(record.Id_Unidad_Medida)} 
            disabled={record.Activo === 1} 
          >
            Activar
          </Button>
        </div>
      </>
    ),
  },
  ];

  const columnsTiposConsumo: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Tipo_Consumo', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Tipo_Consumo', key: 'Unidad_Medida' },
    {
    title: 'Activo',
    dataIndex: 'Activo',
    key: 'Activo',
    render: (activo: number) => (
      activo === 1 ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>
    ),
    filters: [{ text: 'Activo', value: 1 }, { text: 'Inactivo', value: 0 }],
    onFilter: (value, record) => record.Activo === value,
    },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    {
      title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(),
    },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
    title: 'Acciones',
    render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Popconfirm
            title={`¿Estás seguro de eliminar a "${record.Tipo_Consumo}"?`}
            onConfirm={() => deleteCons(record.Id_Tipo_Consumo)}
            okText="Sí"
            cancelText="No"
          >
          <Button danger>
            Eliminar
          </Button>
          </Popconfirm>
            <Button color="primary" variant="outlined" onClick={() => editCons(record.Id_Tipo_Consumo)}>
            Editar
          </Button>
          <Button
            color="purple" 
            variant="outlined" 
            onClick={() => activarCons(record.Id_Tipo_Consumo)} 
            disabled={record.Activo === 1} 
          >
            Activar
          </Button>
        </div>
      </>
    ),
  },
  ];

  const columnsTiposAlimento: TableColumnsType<any> = [
    { title: 'ID', dataIndex: 'Id_Tipo_Alimento', key: 'Id_Unidad_Medida' },
    { title: 'Nombre', dataIndex: 'Tipo_Alimento', key: 'Unidad_Medida' },
    {
    title: 'Activo',
    dataIndex: 'Activo',
    key: 'Activo',
    render: (activo: number) => (
      activo === 1 ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>
    ),
    filters: [{ text: 'Activo', value: 1 }, { text: 'Inactivo', value: 0 }],
    onFilter: (value, record) => record.Activo === value,
    },
    { title: 'ID Alta', dataIndex: 'Id_Usuario_Alta', key: 'Id_Usuario_Alta' },
    {
      title: 'Fecha Alta', dataIndex: 'Fecha_Alta', key: 'Fecha_Alta',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(),
    },
    { title: 'ID Modif', dataIndex: 'Id_Usuario_Modif', key: 'Id_Usuario_Modif' },
    { title: 'Fecha Modif', dataIndex: 'Fecha_Modif', key: 'Fecha_Modif' },
    { title: 'ID Baja', dataIndex: 'Id_Usuario_Baja', key: 'Id_Usuario_Baja' },
    { title: 'Fecha Baja', dataIndex: 'Fecha_Baja', key: 'Fecha_Baja' },
    {
    title: 'Acciones',
    render: (text, record: any) => (
      <>
        <div className='botones-div'>
          <Popconfirm
            title={`¿Estás seguro de eliminar a "${record.Tipo_Alimento}"?`}
            onConfirm={() => deleteAli(record.Id_Tipo_Alimento)}
            okText="Sí"
            cancelText="No"
          >
          <Button danger >
            Eliminar
          </Button>
          </Popconfirm>
          <Button color="primary" variant="outlined" onClick={() => editAli(record.Id_Tipo_Alimento)}>
            Editar
          </Button>
          <Button
            color="purple" 
            variant="outlined" 
            onClick={() => activarAli(record.Id_Tipo_Alimento)} 
            disabled={record.Activo === 1} 
          >
            Activar
          </Button>
        </div>
      </>
    ),
  },
  ];

  const activarUnidad = async (id: number) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        message.error("No hay un usuario logueado para realizar esta acción.");
        return;
    }
    const id_usuario_baja = parseInt(currentUser, 10);
    if (isNaN(id_usuario_baja)) {
        message.error("ID de usuario inválido para la baja.");
        return;
    }

    try {
        const response = await axios.put(`${PUERTO}/unidad/activar/${id}`, {
            // CORRECTED: Send id_usuario_baja directly in the payload
            id_usuario_baja: id_usuario_baja
        });
        message.success(response.data.message || `Unidad con ID ${id} activada correctamente.`); // Changed message to 'Unidad'
        // Assuming fetchTiposConsumo() is meant to refresh the list of units
        // You might want to rename it for clarity, e.g., fetchUnidades()
        fetchUnidades();
    } catch (error: any) {
        console.error('Error al activar unidad:', error.response?.data || error.message); // Changed message to 'unidad'
        message.error(`Error al activar la unidad: ${error.response?.data?.error || error.message}`); // Changed message to 'unidad'
    }
};

  const activarCons = async (id: number) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        message.error("No hay un usuario logueado para realizar esta acción.");
        return;
    }
    const adminId = parseInt(currentUser, 10); // Use adminId for consistency with 'id_usuario'
    if (isNaN(adminId)) {
        message.error("ID de usuario inválido."); // More general message
        return;
    }

    try {
        const response = await axios.put(`${PUERTO}/tipoC/activar/${id}`, {
            // CORRECTED: Send as id_usuario to match backend schema's new name
            id_usuario: adminId
        });
        message.success(response.data.message || `Tipo de consumo con ID ${id} activado correctamente.`); // Specific message
        fetchTiposConsumo(); // This name is appropriate for fetching types of consumption
    } catch (error: any) {
        console.error('Error al activar tipo de consumo:', error.response?.data || error.message); // Specific message
        message.error(`Error al activar el tipo de consumo: ${error.response?.data?.error || error.message}`); // Specific message
    }
};

  const activarAli = async (id: number) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        message.error("No hay un usuario logueado para realizar esta acción.");
        return;
    }

    // CORRECTED: Use a more semantically appropriate name like adminId or userId
    const adminId = parseInt(currentUser, 10);
    if (isNaN(adminId)) {
        message.error("ID de usuario inválido."); // More general message
        return;
    }

    try {
        const response = await axios.put(`${PUERTO}/tipoA/activar/${id}`, {
            // This is already correctly sending 'id_usuario' as per previous fix
            id_usuario: adminId // Use adminId here
        });
        // CORRECTED: Update message to refer to "Tipo de Alimento"
        message.success(response.data.message || `Tipo de alimento con ID ${id} activado correctamente.`);
        fetchTiposAlimento(); // This function name is appropriate for fetching food types
    } catch (error: any) {
        // CORRECTED: Update error message to refer to "Tipo de Alimento"
        console.error('Error al activar tipo de alimento:', error.response?.data || error.message);
        message.error(`Error al activar el tipo de alimento: ${error.response?.data?.error || error.message}`);
    }
};

  const permisos = async () => {
    console.log("DEBUG: --- Inicia función 'permisos' ---");
    const currentUser = localStorage.getItem("currentUser");
    console.log("DEBUG: currentUser de localStorage:", currentUser);

    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      setIdRol(undefined);
      console.log("DEBUG: idRol establecido a:", undefined, " (no currentUser)");
      console.log("DEBUG: --- Termina función 'permisos' ---");
      return;
    }

    const userId = parseInt(currentUser, 10);
    console.log("DEBUG: userId parseado:", userId);

    if (isNaN(userId)) {
      message.error("ID de usuario inválido.");
      setIdRol(undefined);
      console.log("DEBUG: idRol establecido a:", undefined, " (userId inválido)");
      console.log("DEBUG: --- Termina función 'permisos' ---");
      return;
    }

    try {
      console.log(`DEBUG: Haciendo petición a: ${PUERTO}/usuarios/${userId}`);
      const response = await axios.get(`${PUERTO}/usuarios/${userId}`);
      console.log("DEBUG: Respuesta de la API recibida:", response.data);

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        const retrievedIdRol = parseInt(response.data[0]?.Id_Rol, 10);
        console.log("DEBUG: Rol extraído de la API (retrievedIdRol):", retrievedIdRol);

        if (isNaN(retrievedIdRol)) {
          message.warning("Id_Rol recibido de la API no es un número válido.");
          setIdRol(undefined);
          console.log("DEBUG: idRol establecido a:", undefined, " (retrievedIdRol no es número)");
        } else {
          // Esta es la línea clave. setIdRol programa la actualización.
          setIdRol(retrievedIdRol);
          console.log("DEBUG: setIdRol llamado con valor:", retrievedIdRol);
          // ¡IMPORTANTE! Aquí idRol todavía tendrá el valor ANTERIOR a esta llamada.
          // El nuevo valor solo será visible en el siguiente render y en useEffects con dependencia.
          console.log("DEBUG: (Dentro de permisos) idRol *actualmente* en este ciclo de ejecución:", idRol);
        }
      } else {
        message.error('Formato de datos de rol inesperado o array vacío de la API.');
        setIdRol(undefined);
        console.log("DEBUG: idRol establecido a:", undefined, " (formato de API inesperado)");
      }
    } catch (error: any) {
      message.error('Error al cargar permisos: ' + (error.message || 'Error desconocido'));
      setIdRol(undefined);
      console.log("DEBUG: idRol establecido a:", undefined, " (error de API)");
    }
    console.log("DEBUG: --- Termina función 'permisos' ---");
  };

  const editUnidad = (id: number) => {
        setIdUnidad(id); // Pasar el ID del alimento a editar
        setIsModalUnidad(true);                      // Abrir el modal
    };

  const editCons = (id: number) => {
        setIdCons(id); // Pasar el ID del alimento a editar
        setIsModalCons(true);                      // Abrir el modal
    };
  
  const editAli = (id: number) => {
        setIdAli(id); // Pasar el ID del alimento a editar
        setIsModalAli(true);                      // Abrir el modal
    };

  const deleteUnidad = async (id: number) => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            message.error("No hay un usuario logueado para realizar esta acción.");
            return;
        }
        const id_usuario_baja = parseInt(currentUser, 10);
        if (isNaN(id_usuario_baja)) {
            message.error("ID de usuario inválido para la baja.");
            return;
        }

        try {
            const response = await axios.delete(`${PUERTO}/unidad/${id}`, {
                data: { id_usuario_baja: id_usuario_baja }
            });
            message.success(response.data.message || `Alimento con ID ${id} eliminado correctamente.`);
            fetchUnidades();
        } catch (error: any) {
            console.error('Error al eliminar alimento:', error.response?.data || error.message);
            message.error(`Error al eliminar el alimento: ${error.response?.data?.error || error.message}`);
        }
  };

  const deleteCons = async (id: number) => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            message.error("No hay un usuario logueado para realizar esta acción.");
            return;
        }
        const id_usuario_baja = parseInt(currentUser, 10);
        if (isNaN(id_usuario_baja)) {
            message.error("ID de usuario inválido para la baja.");
            return;
        }

        try {
            const response = await axios.delete(`${PUERTO}/tipoC/${id}`, {
                data: { id_usuario_baja: id_usuario_baja }
            });
            message.success(response.data.message || `Alimento con ID ${id} eliminado correctamente.`);
            fetchTiposConsumo();
        } catch (error: any) {
            console.error('Error al eliminar alimento:', error.response?.data || error.message);
            message.error(`Error al eliminar el alimento: ${error.response?.data?.error || error.message}`);
        }
  };

  const deleteAli = async (id: number) => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            message.error("No hay un usuario logueado para realizar esta acción.");
            return;
        }
        const id_usuario_baja = parseInt(currentUser, 10);
        if (isNaN(id_usuario_baja)) {
            message.error("ID de usuario inválido para la baja.");
            return;
        }

        try {
            const response = await axios.delete(`${PUERTO}/tipoA/${id}`, {
                data: { id_usuario_baja: id_usuario_baja }
            });
            message.success(response.data.message || `Alimento con ID ${id} eliminado correctamente.`);
            fetchTiposAlimento();
        } catch (error: any) {
            console.error('Error al eliminar alimento:', error.response?.data || error.message);
            message.error(`Error al eliminar el alimento: ${error.response?.data?.error || error.message}`);
        }
  };

  const fetchUnidades = async () => {
    // Aquí, idRol ya debería tener el valor actualizado por el useEffect [idRol]
    console.log("DEBUG: Inicia fetchUnidades. idRol en este momento:", idRol);
    if (idRol === undefined) {
      console.log("DEBUG: fetchUnidades: idRol es undefined, no se cargan unidades.");
      return;
    }
    if (idRol !== 2) {
      message.warning("No tienes los permisos para ver las unidades.");
      return;
    }
    try {
      console.log("DEBUG: Cargando unidades desde API...");
      const { data } = await axios.get(`${PUERTO}/unidad/`);
      setUnidades(data);
      console.log("DEBUG: Unidades cargadas exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar unidades: ' + (error.message || 'Error desconocido'));
    }
  };

  const fetchTiposConsumo = async () => {
    console.log("DEBUG: Inicia fetchTiposConsumo. idRol en este momento:", idRol);
    if (idRol === undefined) {
      console.log("DEBUG: fetchTiposConsumo: idRol es undefined, no se cargan tipos de consumo.");
      return;
    }
    if (idRol !== 2) {
      message.warning("No tienes los permisos para ver los tipos de consumo.");
      return;
    }
    try {
      console.log("DEBUG: Cargando tipos de consumo desde API...");
      const { data } = await axios.get(`${PUERTO}/tipoC/cat`);
      setTiposConsumo(data);
      console.log("DEBUG: Tipos de consumo cargados exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar tipos de consumo: ' + (error.message || 'Error desconocido'));
    }
  };

  const fetchTiposAlimento = async () => {
    console.log("DEBUG: Inicia fetchTiposAlimento. idRol en este momento:", idRol);
    if (idRol === undefined) {
      console.log("DEBUG: fetchTiposAlimento: idRol es undefined, no se cargan tipos de alimento.");
      return;
    }
    if (idRol !== 2) {
      message.warning("No tienes los permisos para ver los tipos de alimento.");
      return;
    }
    try {
      console.log("DEBUG: Cargando tipos de alimento desde API...");
      const { data } = await axios.get(`${PUERTO}/tipoA/cat`);
      setTiposAlimento(data);
      console.log("DEBUG: Tipos de alimento cargados exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar tipos de alimento: ' + (error.message || 'Error desconocido'));
    }
  };

  // --- useEffect para cargar permisos (se ejecuta una vez al montar) ---
  useEffect(() => {
    console.log("DEBUG: --- Primer useEffect [] activado (al montar componente) ---");
    console.log("DEBUG: idRol inicial en el render antes de permisos:", idRol); // Mostrará undefined
    permisos();
  }, []);

  // --- useEffect para reaccionar a cambios en idRol (ejecuta las cargas de tablas) ---
  useEffect(() => {
    console.log("DEBUG: --- Segundo useEffect [idRol] activado ---");
    console.log("DEBUG: idRol actualizado a:", idRol); // ¡ESTA ES LA LÍNEA CLAVE PARA VER EL VALOR ACTUALIZADO!

    if (idRol !== undefined) {
      console.log("DEBUG: idRol definido, llamando a funciones de fetch...");
      fetchUnidades();
      fetchTiposConsumo();
      fetchTiposAlimento();
    } else {
      console.log("DEBUG: idRol es undefined, esperando que se carguen los permisos.");
    }
  }, [idRol]); // Este efecto se ejecuta cada vez que 'idRol' cambia.

  // Eliminar producto (sin cambios)
  const deleteProduct = async (id: number) => {
    console.log(`DEBUG: Solicitud de eliminación para ID: ${id}`);
    message.success(`Producto ${id} eliminado (simulado)`);
  };

  return (
    <div className='todo'>
      <h2>Panel de Catálogos</h2>
      <div className='botones-div'>
        <Button type="primary" onClick={() => setIsModalUnidad(true)}>
          Agregar Unidad
        </Button>
      </div>

      {idRol === 2 ? (
        <>
        <h2>Unidades de Medida</h2>
          <div className='tabla'>
            
            <Table
              dataSource={unidades}
              columns={columnsUnidades}
              rowKey="Id_Unidad_Medida" // Asegúrate de que este 'rowKey' sea correcto
              rowSelection={{ ...rowSelection, type: 'checkbox' }}
            />
          </div>
          <div className='botones-div'>
        <Button type="primary" onClick={() => setIsModalCons(true)}>
          Agregar Tipo Consumo
        </Button>
      </div>
      <h2>Tipos de Consumo</h2>
          <div className='tabla'>
            
            <Table
              dataSource={tiposConsumo}
              columns={columnsTiposConsumo}
              rowKey="Id_Tipo_Consumo" // Asegúrate de que este 'rowKey' sea correcto
              rowSelection={{ ...rowSelection, type: 'checkbox' }}
            />
          </div>
          <div className='botones-div'>
        <Button type="primary" onClick={() => setIsModalAli(true)}>
          Agregar tipo alimento
        </Button>
      </div>
      <h2>Tipos de Alimento</h2>
          <div className='tabla'>
            
            <Table
              dataSource={tiposAlimento}
              columns={columnsTiposAlimento}
              rowKey="Id_Tipo_Alimento" // Asegúrate de que este 'rowKey' sea correcto
              rowSelection={{ ...rowSelection, type: 'checkbox' }}
            />
          </div>
          <UnidadModal
            visible={isModalUnidad}
            onClose={() => {
              setIsModalUnidad(false);
              setIdUnidad(null);
              fetchUnidades(); 
            }}
            id_unidad={idUnidad}
          />
          <ConsumoModal
            visible={isModalCons}
            onClose={() => {
              setIsModalCons(false);
              setIdCons(null);
              fetchTiposConsumo(); 
            }}
            id_unidad={idCons}
          />
          <TAlimentoModal
            visible={isModalAli}
            onClose={() => {
              setIsModalAli(false);
              setIdAli(null);
              fetchTiposAlimento(); 
            }}
            id_unidad={idAli}
          />
        </>
      ) : (
        <p>
          {idRol === undefined
            ? 'Cargando permisos...'
            : 'No tienes acceso para ver estos catálogos.'}
        </p>
      )}
    </div>
  );
};

export default Catalogos;