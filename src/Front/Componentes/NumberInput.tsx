import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';

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
    const reg = /^\d*$/;

    if (reg.test(inputValue) || inputValue === '') {
      onChange(inputValue);
    }
  };

  const handleBlur = () => {
    let valueTemp = value;
    valueTemp = valueTemp.replace(/^0+(\d+)/, '$1');
    onChange(valueTemp);
  };

  const title = value ? (
    <span className="numeric-input-title">{formatNumber(Number(value))}</span>
  ) : (
    'Inserta un número entero positivo'
  );

  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder=""
        maxLength={2}
        size='small'
      />
    </Tooltip>
  );
};

export default NumericInput;