
import React from 'react';

import PorCaducar from './Componentes/PorCaducar';
import { AutoComplete, Input, Flex, Button, ConfigProvider, Row, Col, Card, Space, Tooltip, } from 'antd';
import { CameraOutlined, WarningOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function Inicio() {
    const options = [
        { value: 'Burns Bay Road' },
        { value: 'Downing Street' },
        { value: 'Wall Street' },
      ];
      const { Meta } = Card;

      interface CardData {
        ingrediente: string;
        cantidad: number;
        abreviatura: string;
        image: string;
      }
      
      const cardsData: CardData[] = [
        { ingrediente: 'Fresas', cantidad: 10, abreviatura: "kg", image: 'https://via.placeholder.com/300' },
        { ingrediente: 'Enjitomatado de cereza', cantidad: 15, abreviatura: "kg", image: 'https://via.placeholder.com/300' },
        { ingrediente: 'Plátanos', cantidad: 20, abreviatura: "kg", image: 'https://via.placeholder.com/300' },
        { ingrediente: 'Uvas', cantidad: 8, abreviatura: "kg", image: 'https://via.placeholder.com/300' },
      ];

    return (
      <>
      <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#00b96b',
                    borderRadius: 10,
                    

                    // Alias Token
                    colorBgContainer: '#CAE2B5',
                },
                components: {
                    Select: {
                        optionActiveBg: '#CAE2B5',
                        algorithm: true
                    }
                }
            }}
        >
      <div style= {{ width: '80vw', alignContent: 'center', marginLeft: '10vw', marginRight: '10vw'}}>
        <Flex align='center' justify= 'space-evenly'>
            
            <div >
                <AutoComplete
                    style={{ width: "50vw", backgroundColor: 'blue' }}
                    options={options}
                    placeholder=""
                    filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    >
                    <Input.Search size="large" placeholder="Buscar un ingrediente" style={{backgroundColor: 'white'}}/>
                </AutoComplete>
            </div>
            
            <div>
                <CameraOutlined style={{fontSize: 30, color: '#3E7E1E', backgroundColor: '#EEF6DD'}}/>
            </div>
            <div>
                <Button style={{color: "#3E7E1E", backgroundColor: "#CAE2B5"}}>Agregar</Button>
            </div>
          </Flex>
        </div>
        
        <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap:'16px', padding:'16px'}}>
                <PorCaducar/>
                {cardsData.map((card, index) => (
                    <Card
                    hoverable
                    style={{
                        border: '1px solid #3E7E1E',
                        borderRadius: '10px',
                        overflow: 'hidden', // Asegura que el contenido (imagen) respete el borderRadius
                    }}
                    >
                    <div
                        style={{
                        border: '1px solid #3E7E1E',
                        borderRadius: '10px',
                        overflow: 'hidden', // Asegura que la imagen no se salga de los bordes
                        alignContent: 'center',
                        display: 'flex'
                        }}
                    >
                        <img
                        alt={card.ingrediente}
                        src={card.image}
                        style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '10px',
                        }}
                    >
                        <span style={{fontSize: 30, color: '#86A071', fontFamily: 'Jomhuria, sans-serif'}}>
                        {`${card.ingrediente}`}<br />{` ${card.cantidad} ${card.abreviatura}`}
                        </span>
                        <Space size="small">
                        <Tooltip title="Editar">
                            <EditOutlined style={{ color: '#6F895A', fontSize: 20}} />
                        </Tooltip>
                        <Tooltip title="Advertencia">
                            <WarningOutlined style={{ color: '#6F895A', fontSize: 20}} />
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <DeleteOutlined style={{ color: '#6F895A', fontSize: 20 }} />
                        </Tooltip>
                        </Space>
                    </div>
                    </Card>
                ))}
        </div>
        </ConfigProvider>
      </>
    );
}

/*
Documentación usada:
https://ant.design/components/auto-complete

import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import type { AutoCompleteProps } from 'antd';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [anotherOptions, setAnotherOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  const onChange = (data: string) => {
    setValue(data);
  };

  return (
    <>
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={(text) => setOptions(getPanelValue(text))}
        placeholder="input here"
      />
      <br />
      <br />
      <AutoComplete
        value={value}
        options={anotherOptions}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={(text) => setAnotherOptions(getPanelValue(text))}
        onChange={onChange}
        placeholder="control mode"
      />
    </>
  );
};

export default App;

*/
