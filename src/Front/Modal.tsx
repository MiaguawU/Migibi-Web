import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import ProductModal from './Componentes/ProductoRefriModal'; // Importa el modal separado
import InsModal from './Componentes/InstruccionModal';

const Products: React.FC = () => {
  const [products, setProducts] = useState([]); // Lista de productos
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

  // Obtener productos desde la API
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) {
      message.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('expirationDate', values.expirationDate.format('YYYY-MM-DD')); // Formatea la fecha
    formData.append('quantity', values.quantity);
    formData.append('unit', values.unit);
    formData.append('type', values.type);
    formData.append('imgsrc', values.imgsrc);
  };
  
  // Eliminar producto
  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      message.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      message.error('Error al eliminar producto');
    }
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Agregar Producto
      </Button>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Editar Producto
      </Button>

      {/* Tabla de productos */}
      <Table
        dataSource={products}
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Nombre', dataIndex: 'name', key: 'name' },
          { title: 'Cantidad', dataIndex: 'quantity', key: 'quantity' },
          { title: 'Unidad', dataIndex: 'unit', key: 'unit' },
          { title: 'Fecha de Caducidad', dataIndex: 'expirationDate', key: 'expirationDate' },
          {
            title: 'Acciones',
            render: (text, record: any) => (
              <Button danger onClick={() => deleteProduct(record.id)}>
                Eliminar
              </Button>
            ),
          },
        ]}
        rowKey="id"
      />
    </div>
  );
};

export default Products;
