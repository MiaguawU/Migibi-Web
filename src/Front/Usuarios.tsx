import React, { useState, useEffect } from 'react';
import { ConfigProvider ,Table, Button, Space, Input, Popconfirm, message, Select, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import PUERTO from "../config";
import axios from 'axios';
import EditUserModal from './Componentes/Admin/EdUsuario';
import AddUserModal from './Componentes/Admin/AgUsuario';
import { customColors } from './Estilos/colores';

const { Option } = Select;

// --- User Interface ---
interface User {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Contrasena: string; // En una app real, nunca se expone directamente
  foto_perfil?: string; // Campo opcional
  Cohabitantes: number;
  Email?: string; // Campo opcional
  Es_Gmail: boolean;
  Id_Rol: number;
  Activo: number;
}

interface Rol {
  Id_Rol: number;
  Rol: string; // El nombre del rol, e.g., "Administrador", "Usuario Normal"
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);// Estado para almacenar los usuarios
  const [loading, setLoading] = useState<boolean>(true);// Estado para indicar si los datos están cargando
  const [isAddModalVis, setIsAddModalVis] = useState(false);// Estado para controlar la visibilidad del modal de agregar usuario
  const [edUser, setEdUser] = useState<number | null>(null);// Estado para almacenar el ID del usuario a editar
  const [Rols, setRols] = useState<Rol[]>([]);// Estado para almacenar la lista de roles

  // --- Obtener roles desde el backend ---
  const obtenerRoles = async () => {
    try {
      const { data } = await axios.get<Rol[]>(`${PUERTO}/rol`);
      setRols(data);
      console.log("DEBUG: Roles cargados exitosamente.");
    } catch (error: any) {
      message.error('Error al cargar roles: ' + (error.message || 'Error desconocido'));
    }
  };

  // --- Obtener usuarios desde el backend ---
  const fetchUsers = async () => {
    setLoading(true);
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      setLoading(false); // Asegúrate de detener el loading incluso si no hay usuario
      return;
    }

    const userId = parseInt(currentUser, 10);
    console.log("DEBUG: userId parseado:", userId);

    if (isNaN(userId)) {
      message.error("ID de usuario inválido.");
      setLoading(false); // Asegúrate de detener el loading
      return;
    }
    try {
      const { data } = await axios.get<User[]>(`${PUERTO}/us_adm/${userId}`);
      setUsers(data);
      message.success('Usuarios cargados correctamente.');
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      message.error('Fallo al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect para cargar los usuarios y roles al montar el componente ---
  useEffect(() => {
    fetchUsers();
    obtenerRoles(); // Cargar los roles al iniciar el componente
  }, []);

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
        const url = `${PUERTO}/activar/${id}`;
        const dataToSend = {
            id_usuario: adminId
        };

        // Log the data being sent
        console.log("Enviando solicitud para activar usuario:");
        console.log("URL:", url);
        console.log("Datos a enviar:", dataToSend);

        const response = await axios.put(url, dataToSend);
        message.success(response.data.message || `usuario con ID ${id} activado correctamente.`); // Specific message
        fetchUsers(); // This name is appropriate for fetching types of consumption
    } catch (error: any) {
        console.error('Error al activar usuario:', error.response?.data || error.message); // Specific message
        message.error(`Error al activar usuario: ${error.response?.data?.error || error.message}`); // Specific message
    }
};

  // --- Función para eliminar un usuario ---
  const eliminarUser = async (id: number) => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      message.warning("No hay un usuario logueado actualmente.");
      return;
    }

    const userId = parseInt(currentUser, 10);
    console.log("DEBUG: userId parseado:", userId);

    if (isNaN(userId)) {
      message.error("ID de usuario inválido.");
      return;
    }
    try {
      const response = await axios.delete(`${PUERTO}/us_adm/${id}/${userId}`);

      if (response.status === 200) {
        message.success(`Usuario eliminado exitosamente.`);
        // Llama a la función para recargar la lista de usuarios en la tabla
        await fetchUsers();
      } else {
        // Manejar otros códigos de estado si es necesario
        message.error(`No se pudo eliminar el usuario. Estado: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      message.error("Ocurrió un error al intentar eliminar el usuario.");
    }
  };

  // --- Columnas de la Tabla ---
  const columns: TableColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'Id_Usuario',
      key: 'Id_Usuario',
      sorter: (a, b) => a.Id_Usuario - b.Id_Usuario,
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre_Usuario',
      key: 'Nombre_Usuario',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar nombre de usuario"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record.Nombre_Usuario.toLowerCase().includes((value as string).toLowerCase()),
      sorter: (a, b) => a.Nombre_Usuario.localeCompare(b.Nombre_Usuario),
      width: 200,
    },
    {
      title: 'Foto de perfil',
      dataIndex: 'foto_perfil',
      key: 'foto_perfil',
      render: (fotoUrl: string | undefined) => {
        if (!fotoUrl) {
          // Si no hay URL de foto o es nula/vacía, muestra un placeholder
          return (
            <img
              src="https://placehold.co/40x40/cccccc/000000?text=N/A" // Placeholder de texto
              alt="No disponible"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          );
        }

        let fullImageUrl = fotoUrl;

        // Verifica si la URL ya es absoluta (empieza con 'http' o 'https')
        if (!fotoUrl.startsWith('http://') && !fotoUrl.startsWith('https://')) {
          let baseUrl = PUERTO;
          let path = fotoUrl;

          // Asegura que baseUrl no termine con '/'
          if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
          }

          // Asegura que path comience con '/'
          if (!path.startsWith('/')) {
            path = '/' + path;
          }

          // Combina la URL base con la ruta de la imagen
          fullImageUrl = `${baseUrl}${path}`;
        }

        return (
          <img
            src={fullImageUrl}
            alt="Perfil"
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { // Manejo de error si la imagen no carga
              e.currentTarget.onerror = null; // Evita bucle infinito
              e.currentTarget.src = 'https://placehold.co/40x40/cccccc/000000?text=IMG'; // Placeholder de fallback
            }}
          />
        );
      },
      width: 120, // Ajustado para el ícono/imagen
    },
    {
      title: 'Cohabitantes',
      dataIndex: 'Cohabitantes',
      key: 'Cohabitantes',
      sorter: (a, b) => a.Cohabitantes - b.Cohabitantes,
      width: 120,
    },
    {
      title: 'Correo',
      dataIndex: 'Email',
      key: 'Email',
      width: 200,
    },
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
    {
      title: 'Rol',
      dataIndex: 'Id_Rol',
      key: 'Id_Rol',
      render: (idRol: number) => {
        // Busca el nombre del rol en el estado 'Rols'
        const rolEncontrado = Rols.find(rol => rol.Id_Rol === idRol);
        return rolEncontrado ? rolEncontrado.Rol : 'Desconocido';
      },
      filters: Rols.map(rol => ({
        text: rol.Rol,
        value: rol.Id_Rol,
      })),
      onFilter: (value, record) => record.Id_Rol === value,
      sorter: (a, b) => {
        const rolA = Rols.find(rol => rol.Id_Rol === a.Id_Rol)?.Rol || '';
        const rolB = Rols.find(rol => rol.Id_Rol === b.Id_Rol)?.Rol || '';
        return rolA.localeCompare(rolB);
      },
      width: 150,
    },
    {
      title: 'Es Gmail',
      dataIndex: 'Es_Gmail',
      key: 'Es_Gmail',
      render: (esGmail: boolean) => (esGmail ? 'Sí' : 'No'),
      filters: [
        { text: 'Sí', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.Es_Gmail === value,
      width: 100,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record: User) => (
        <Space size="middle">
        <Popconfirm
            title={`¿Estás seguro de eliminar al usuario "${record.Nombre_Usuario}"?`}
            onConfirm={() => eliminarUser(record.Id_Usuario)}
            okText="Sí"
            cancelText="No"
          >
          <Button danger>
            Eliminar
          </Button>
          </Popconfirm>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: customColors.colorFuerteCalido,
                colorPrimaryHover: customColors.colorPrimario
              }
            }}  
          >
            <Button color={'primary'} variant="outlined" onClick={() => setEdUser(record.Id_Usuario)}>
            Editar
          </Button>
          </ConfigProvider>
          <Button
            color="purple" 
            variant="outlined" 
            onClick={() => activarCons(record.Id_Usuario)} 
            disabled={record.Activo === 1} 
          >
            Activar
          </Button>
        </Space>
      ),
      width: 180,
      fixed: 'right',
    },
  ];

  return (
    // Contenedor principal con estilos para espaciado y ancho máximo
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '20px auto' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddModalVis(true)}
        style={{ marginBottom: '20px' }} // Margen inferior para separar del botón/nav
      >
        Agregar Usuario
      </Button>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="Id_Usuario"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }} // Habilita el scroll horizontal si la tabla es muy ancha
      />
      <EditUserModal
        visible={edUser != null}
        onClose={() => {
          setEdUser(null)
          fetchUsers();
        }}
        id_user={edUser}
      />
      <AddUserModal
        visible={isAddModalVis}
        onClose={() => 
        {
          setIsAddModalVis(false)
          fetchUsers();
        }
        }
      />
    </div>


  );
};

export default UsersTable;