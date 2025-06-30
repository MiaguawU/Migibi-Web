import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Popconfirm, message, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import PUERTO from "../config";
import axios from 'axios';
import AlimentoModal from './Componentes/Admin/Ag_Ed_Alimento'

interface Alimento {
    Id_Alimento: number;
    Id_Tipo_Alimento: number;
    Alimento: string;
    Activo: number;
    Id_Usuario_Alta: number;
    Fecha_Alta: string; // Asumimos que viene como string y la formateamos
    Id_Usuario_Modif?: number | null; // Puede ser opcional y null
    Fecha_Modif?: string | null; // Puede ser opcional y null
    Id_Usuario_Baja?: number | null; // Puede ser opcional y null
    Fecha_Baja?: string | null; // Puede ser opcional y null
    Es_Perecedero: boolean;
}

interface cat_tipo_al {
  Id_Tipo_Alimento: number;
  Tipo_Alimento: string;
}

const AlimentosTable: React.FC = () => {
    const [alimentos, setAlimentos] = useState<Alimento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedAlimentoId, setSelectedAlimentoId] = useState<number | null>(null);
    const [tipo, setTipo] = useState<cat_tipo_al[]>([]);
    
      const obtenerTipo = async () => {
        try {
          const { data } = await axios.get(`${PUERTO}/tipoA`);
          setTipo(data);
          console.log("DEBUG: Tipos de consumo cargados exitosamente.");
        } catch (error: any) {
          message.error('Error al cargar tipos de consumo: ' + (error.message || 'Error desconocido'));
        }
      }

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
        const url = `${PUERTO}/cat_ali/activar/${id}`;
        const dataToSend = {
            id_usuario_baja: adminId
        };

        console.log("Enviando solicitud para activar usuario:");
        console.log("URL:", url);
        console.log("Datos a enviar:", dataToSend);

        const response = await axios.put(url, dataToSend);
        message.success(response.data.message || `usuario con ID ${id} activado correctamente.`); // Specific message
        fetchAlimentos(); 
    } catch (error: any) {
        console.error('Error al activar usuario:', error.response?.data || error.message); // Specific message
        message.error(`Error al activar usuario: ${error.response?.data?.error || error.message}`); // Specific message
    }
};

    // Función para formatear fechas
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) {
            return 'N/A';
        }
        // Intentar crear una fecha. Si es inválida, retornar N/A.
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    const fetchAlimentos = async () => {
        setLoading(true);
        const currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
            message.warning("No hay un usuario logueado actualmente.");
            setLoading(false);
            return;
        }

        const userId = parseInt(currentUser, 10);
        console.log("DEBUG: userId parseado:", userId);

        if (isNaN(userId)) {
            message.error("ID de usuario inválido.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get<Alimento[]>(`${PUERTO}/cat_ali/${userId}`);
            const data = response.data;

            if (Array.isArray(data)) {
                setAlimentos(data);
                message.success('Alimentos cargados correctamente.');
            } else {
                console.warn("API response for alimentos was not an array:", data);
                setAlimentos([]);
                message.warning('La respuesta del servidor no fue un formato esperado. Mostrando sin datos.');
            }
        } catch (error: any) {
            console.error('Error al cargar alimentos:', error.response?.data || error.message);
            message.error(`Error al cargar los alimentos: ${error.response?.data?.error || error.message}`);
            setAlimentos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerTipo();
        fetchAlimentos();
    }, []);

    const handleAddAlimento = () => {
        setSelectedAlimentoId(null); // Para indicar que es un nuevo alimento
        setIsModalVisible(true);     // Abrir el modal
    };

    const handleEdit = (alimento: Alimento) => {
        setSelectedAlimentoId(alimento.Id_Alimento); // Pasar el ID del alimento a editar
        setIsModalVisible(true);                      // Abrir el modal
    };

    const handleDelete = async (id_alimento_eliminar: number) => {
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
            const response = await axios.delete(`${PUERTO}/cat_ali/${id_alimento_eliminar}`, {
                data: { id_usuario_baja: id_usuario_baja }
            });
            message.success(response.data.message || `Alimento con ID ${id_alimento_eliminar} eliminado correctamente.`);
            fetchAlimentos();
        } catch (error: any) {
            console.error('Error al eliminar alimento:', error.response?.data || error.message);
            message.error(`Error al eliminar el alimento: ${error.response?.data?.error || error.message}`);
        }
    };

    const columns: TableColumnsType<Alimento> = [
        { title: 'ID', dataIndex: 'Id_Alimento', key: 'Id_Alimento', sorter: (a, b) => a.Id_Alimento - b.Id_Alimento, width: 80 },
        {
            title: 'Tipo',
            dataIndex: 'Id_Tipo_Alimento',
            key: 'Id_Tipo_Alimento',
            render: (idTipo: number) => {
                // Find the type name from the 'tipo' state
                const tipoEncontrado = tipo.find(t => t.Id_Tipo_Alimento === idTipo);
                return tipoEncontrado ? tipoEncontrado.Tipo_Alimento : `Desconocido (${idTipo})`;
            },
            filters: tipo.map(t => ({ text: t.Tipo_Alimento, value: t.Id_Tipo_Alimento })), // Dynamic filters
            onFilter: (value, record) => record.Id_Tipo_Alimento === value,
            sorter: (a, b) => {
                // Optional: Sort by type name instead of ID if desired
                const tipoA = tipo.find(t => t.Id_Tipo_Alimento === a.Id_Tipo_Alimento)?.Tipo_Alimento || '';
                const tipoB = tipo.find(t => t.Id_Tipo_Alimento === b.Id_Tipo_Alimento)?.Tipo_Alimento || '';
                return tipoA.localeCompare(tipoB);
            },
            width: 120
        },
        {
            title: 'Nombre del Alimento',
            dataIndex: 'Alimento',
            key: 'Alimento',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar alimento"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Buscar</Button>
                        <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>Reset</Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.Alimento.toLowerCase().includes((value as string).toLowerCase()),
            sorter: (a, b) => a.Alimento.localeCompare(b.Alimento),
            width: 200
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
            title: 'Es Perecedero',
            dataIndex: 'Es_Perecedero',
            key: 'Es_Perecedero',
            render: (esPerecedero: boolean) => (esPerecedero ? 'Sí' : 'No'),
            filters: [{ text: 'Sí', value: true }, { text: 'No', value: false }],
            onFilter: (value, record) => record.Es_Perecedero === value,
            width: 130
        },
        {
            title: 'Usuario Alta',
            dataIndex: 'Id_Usuario_Alta',
            key: 'Id_Usuario_Alta',
            sorter: (a, b) => a.Id_Usuario_Alta - b.Id_Usuario_Alta,
            width: 120
        },
        {
            title: 'Fecha Alta',
            dataIndex: 'Fecha_Alta',
            key: 'Fecha_Alta',
            render: formatDate, // Usar la función auxiliar para formatear
            sorter: (a, b) => new Date(a.Fecha_Alta).getTime() - new Date(b.Fecha_Alta).getTime(),
            width: 120
        },
        {
            title: 'Usuario Modificación',
            dataIndex: 'Id_Usuario_Modif',
            key: 'Id_Usuario_Modif',
            render: (idUsuario: number | null | undefined) => idUsuario ?? 'N/A', // Muestra N/A si es null/undefined
            sorter: (a, b) => (a.Id_Usuario_Modif || 0) - (b.Id_Usuario_Modif || 0), // Manejar nulls en sorter
            width: 150
        },
        {
            title: 'Fecha Modificación',
            dataIndex: 'Fecha_Modif',
            key: 'Fecha_Modif',
            render: formatDate, // Usar la función auxiliar para formatear
            sorter: (a, b) => {
                const dateA = a.Fecha_Modif ? new Date(a.Fecha_Modif).getTime() : 0;
                const dateB = b.Fecha_Modif ? new Date(b.Fecha_Modif).getTime() : 0;
                return dateA - dateB;
            },
            width: 150
        },
        {
            title: 'Usuario Baja',
            dataIndex: 'Id_Usuario_Baja',
            key: 'Id_Usuario_Baja',
            render: (idUsuario: number | null | undefined) => idUsuario ?? 'N/A', // Muestra N/A si es null/undefined
            sorter: (a, b) => (a.Id_Usuario_Baja || 0) - (b.Id_Usuario_Baja || 0), // Manejar nulls en sorter
            width: 120
        },
        {
            title: 'Fecha Baja',
            dataIndex: 'Fecha_Baja',
            key: 'Fecha_Baja',
            render: formatDate, // Usar la función auxiliar para formatear
            sorter: (a, b) => {
                const dateA = a.Fecha_Baja ? new Date(a.Fecha_Baja).getTime() : 0;
                const dateB = b.Fecha_Baja ? new Date(b.Fecha_Baja).getTime() : 0;
                return dateA - dateB;
            },
            width: 120
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (text, record: Alimento) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)} color="primary" variant="outlined" >Editar</Button>
                    <Popconfirm title={`¿Estás seguro de eliminar "${record.Alimento}"?`} onConfirm={() => handleDelete(record.Id_Alimento)} okText="Sí" cancelText="No">
                        <Button danger>Eliminar</Button>
                    </Popconfirm>
                    <Button
                        color="purple" 
                        variant="outlined" 
                        onClick={() => activarCons(record.Id_Alimento)} 
                        disabled={record.Activo === 1} 
                      >
                        Activar
                    </Button>        
                </Space>
            ),
            width: 180,
            fixed: 'right'
        },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '20px auto' }}> {/* Aumentado maxWidth */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddAlimento}
                style={{ marginBottom: '20px' }}
            >
                Agregar Alimento
            </Button>

            <Table
                columns={columns}
                dataSource={alimentos}
                rowKey="Id_Alimento"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }} // Habilita el scroll horizontal si la tabla es muy ancha
            />
            <AlimentoModal
                visible={isModalVisible}
                // onClose ahora solo cierra el modal y limpia el ID seleccionado
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedAlimentoId(null);
                    fetchAlimentos(); 
                }}
                id_alimento={selectedAlimentoId}
                // ¡Aquí es donde pasamos la prop onSuccess requerida!
                // Esta función se llamará desde AlimentoModal cuando la operación de guardar sea exitosa.
                
            />
        </div>
    );
};

export default AlimentosTable;
