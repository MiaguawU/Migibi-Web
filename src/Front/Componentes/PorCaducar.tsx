import React, { useState } from "react";
import { Card, Checkbox, Button, Drawer, ConfigProvider } from "antd";

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
        title="Por caducar"
        extra={<Button type="link" onClick={toggleDrawer} style={{color:'#3E7E1E'}}>Ver más</Button>}
        style={{width: 'auto', backgroundColor: "#CEDFAC", borderRadius: 8, color:'#638552' }}
        bodyStyle={{ padding: "16px" }}
      >
        <div style={{display:'flex', flexDirection: 'column',
             width: '80%', padding: '10%', backgroundColor: 'white', borderRadius: '20px'}}>
            {items.slice(0, 5).map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <Checkbox
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(index)}
                style={{fontFamily:"Alice, serif", color:'#40632F'}}
                >
                {item.name}
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
