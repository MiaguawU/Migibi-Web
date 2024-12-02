import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import Ingredientes from './Componentes/IngredientesRecetaEditar';
import type { UploadProps } from 'antd';
import type { InputNumberProps } from 'antd';
import { Button, Select, Input, Tooltip, Form, TimePicker, Upload, InputNumber } from "antd";
import def from '../Img/defRec.png';
import btEd from '../Img/btEditar.png';
import btCom from '../Img/btCompartir.png';
import './Estilos/EDrec.css';
import Proceso from './Componentes/ProcedimientoEditar';

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const props: UploadProps = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
  previewFile(file) {
    console.log('Your upload file:', file);
    // Your process logic. Here we just mock to the same file
    return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
      method: 'POST',
      body: file,
    })
      .then((res) => res.json())
      .then(({ thumbnail }) => thumbnail);
  },
};


const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumericInput = (props: NumericInputProps) => {
  const { value, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
  };

  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (
    'Input a number'
  );

  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Input a number"
        maxLength={16}
      />
    </Tooltip>
  );
};

const { TextArea } = Input;

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

export default function EDreceta() {
  const [form] = Form.useForm();
  const [value, setValue] = useState('');

  const onReset = () => {
    form.resetFields();
  };
  

    return (
      <div className='todo'>
        <Form>
          <div className='receta'>
            <div className='f1'>
              <div className='imgDiv'>
                <img src={def}/>
                <Upload {...props}>
                  <Button className='btUp' icon={<UploadOutlined />}></Button>
                </Upload>
              </div>
              <div className = 'ttpcDiv'>

                <div className='tiempo'>
                  <p className='txt'>Tiempo:</p>
                  <TimePicker minuteStep={15} secondStep={10} hourStep={1} className='time' placeholder="tiempo"/>
                </div>
                <div className='tipo'>
                  <p className='txi'>Tipo:</p>
                  <Select
                    labelInValue
                    defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                      {
                        value: 'jack',
                        label: 'Jack (100)',
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy (101)',
                      },
                    ]}
                className='sl'
                />
                </div>
                <div className='porciones'>
                  <p className='txp'>Porciones:</p>    
                  <InputNumber className='nP' min={1} max={100000} defaultValue={3} onChange={onChange} />
                </div>
                <div className='calorias'>
                  <p className='txc'>Calorias:</p>
                  <InputNumber min={1} max={100000} defaultValue={3} onChange={onChange} className='nC' />
                  <Select
                    labelInValue
                    defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                      {
                        value: 'jack',
                        label: 'Jack (100)',
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy (101)',
                      },
                    ]}
                    className='sl2'
                  />
                </div>
              </div>
            </div>
            <div className='f2'>
              <div className='rect'>
                <div className='nRecCom'>
                  <p className='nRec' >Receta</p>
                  <Button className='btImg' ><img src={btCom} className='imgCom'/></Button>
                </div>
                <div className='divEnviarReset'>
                  <Button htmlType="submit" className='btEn'><p className='tx2'>Enviar</p></Button>
                  <Button htmlType="button" onClick={onReset} className='btEn2' ><p className='tx2'>Reset</p></Button>
                </div>
              </div>
              <div className='ing'>
                <Ingredientes />
              </div>
            </div>
            <div className='f3'>
              <div className='proceso'>
                <Proceso/>
              </div>
            </div>
          
          </div>
        </Form>
      </div>
    );
  }
  
  