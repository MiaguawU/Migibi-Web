
import React, { useState } from 'react';
import { Button, Select, Input, Tooltip, Form, TimePicker } from "antd";
import def from '../Img/defRec.png';
import btEd from '../Img/btEditar.png';
import btCom from '../Img/btCompartir.png';
import './Estilos/EDrec.css';

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

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
            <img src={def}/>
            <div className='tiempo'>
              <p>Tiempo:</p>
              <TimePicker minuteStep={15} secondStep={10} hourStep={1} />
            </div>
            <div className='tipo'>
                <p>Tipo:</p>
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
            />
            </div>
          
          </div>
          <div className='f2'>
            <p>Receta</p>
            <Button className='btImg' ><img src={btEd} className='imgEd'/></Button>
            <Button className='btImg' ><img src={btCom} className='imgCom'/></Button>
              <div>

              </div>
              <Button>Mas</Button>
          </div>
          <div className='f3'>
              <div className='calorias'>
              <p>Calorias:</p>
            <NumericInput style={{ width: 120 }} value={value} onChange={setValue} />
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
            />
              </div>
              <div className='porciones'>
              <p>Porciones:</p>
            <NumericInput style={{ width: 120 }} value={value} onChange={setValue} />
              </div>
              <div className='proceso'>
                <p>Procedimiento</p>
                <TextArea
        placeholder="input here"
        className="custom"
        style={{ height: 50 }}
      />
              </div>
          </div>
          
        </div>
        <Button htmlType="submit" >Agregar</Button>
        <Button htmlType="button" onClick={onReset} >Reset</Button>
        </Form>
      </div>
    );
  }
  
  