import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider, message } from "antd";
import axios from 'axios';
import PUERTO from '../../config';

interface Item {
  name: string;
  dias: string;
  isChecked: boolean;
}

const PorCaducar: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Función para obtener alimentos
  const datosAlimento = async () => {
    try {
      const response = await axios.get(`${PUERTO}/caducar`);

      // Validar si las claves esperadas están presentes
      const Perecedero = response.data;
      if (Array.isArray(Perecedero)) {
        // Mapear alimentos perecederos
        const perecederos = Perecedero.map((alimento) => {
          const fechaCaducidad = alimento.Fecha_Caducidad
            ? new Date(alimento.Fecha_Caducidad)
            : null;

          const diasRestantes = fechaCaducidad
            ? Math.max(
                0,
                Math.ceil(
                  (fechaCaducidad.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 'No definida';

          return {
            name: alimento.Nombre || 'Alimento desconocido',
            dias: diasRestantes === 'No definida' ? 'Fecha no disponible' : `${diasRestantes} días`,
            isChecked: false,
          };
        });

        // Actualizar estados
        setItems(perecederos);
        message.success("Alimentos obtenidos exitosamente");
      } else {
        throw new Error("Formato de datos inválido");
      }
    } catch (error) {
      console.error("Error al obtener alimentos", error);
      message.error("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false); // Al finalizar la carga, se puede mostrar el contenido
    }
  };

  // Ejecutar la función al montar el componente
  useEffect(() => {
    datosAlimento();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCheckboxChange = (index: number) => {
    const newItems = [...items];
    newItems[index].isChecked = !newItems[index].isChecked;
    setItems(newItems);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#638552',
          },
        }}
      >
        <Card
          title="Por caducar"
          extra={<Button type="link" onClick={toggleDrawer} style={{ color: '#3E7E1E' }}>Ver más</Button>}
          style={{ width: 'auto', backgroundColor: "#CEDFAC", borderRadius: 8, color: '#638552' }}
          bodyStyle={{ padding: "16px" }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column',
            width: '80%', padding: '10%', backgroundColor: 'white', borderRadius: '20px'
          }}>
            {items.slice(0, 5).map((item, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                  style={{ fontFamily: "Alice, serif", color: '#40632F' }}
                >
                  {item.name} - {item.dias}
                </Checkbox>
              </div>
            ))}
          </div>
        </Card>

        <Drawer
          title="Todos los productos por caducar"
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerOpen}
          width={300}
        >
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <Checkbox
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(index)}
              >
                {item.name} - {item.dias}
              </Checkbox>
            </div>
          ))}
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default PorCaducar;
