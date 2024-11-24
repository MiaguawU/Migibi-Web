import React, { useState } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider } from "antd";
import btAg from '../../Img/btAgregar.png';
import '../Estilos/ing.css'; // Importa el archivo CSS

interface Item {
  name: string;
  isChecked: boolean;
}

const PorCaducar: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { name: "Manzanas / 2 días", isChecked: true },
    { name: "Pepinos", isChecked: true },
    { name: "Arroz", isChecked: true },
    { name: "Pollo", isChecked: true },
    { name: "Pasta", isChecked: true },
    { name: "Pepinos", isChecked: true },
    { name: "Arroz", isChecked: true },
    { name: "Pollo", isChecked: true },
    { name: "Pasta", isChecked: true },
    { name: "Pepinos", isChecked: true },
    { name: "Arroz", isChecked: true },
    { name: "Pollo", isChecked: true },
    { name: "Pasta", isChecked: true },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
          title={<span className="card-title">Ingredientes</span>}
          extra={<Button type="link" onClick={toggleDrawer} className="card-button-link">Ver más</Button>}
          className="card-container"
          bodyStyle={{ padding: "16px" }}
        >
          <div className="card-checkbox-container">
            {items.slice(0, 5).map((item, index) => (
              <div key={index} className="card-checkbox">
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                  className="card-checkbox-text"
                >
                  {item.name}
                </Checkbox>
              </div>
            ))}
            <Button className="btAg"><img className="img" src={btAg} alt="Agregar" /></Button>
          </div>
        </Card>

        <Drawer
          title="Ingredientes"
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerOpen}
          width={300}
        >
          {items.map((item, index) => (
            <div key={index} className="drawer-checkbox">
              <Checkbox
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(index)}
                className="drawer-checkbox-text"
              >
                {item.name}
              </Checkbox>
            </div>
          ))}
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default PorCaducar;
