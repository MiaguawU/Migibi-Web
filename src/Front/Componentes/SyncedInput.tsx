import React from "react";
import { Input } from "antd";
import '../Estilos/EDrec.css';

interface SyncedInputsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder1?: string;
  placeholder2?: string;
  variant?: "borderless" | "outlined";
  className?: string;
}

const { TextArea } = Input;

const SyncedInputs: React.FC<SyncedInputsProps> = ({
  value,
  onChange,
  placeholder1 = "Input 1",
  placeholder2 = "Input 2",
  variant = "outlined",
  className,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      {/* TextArea 1 */}
      <TextArea
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder1}
        variant={variant}
        className={`nRec ${className ?? ""}`}
        autoSize={{ minRows: 3 }}
        style={{ whiteSpace: 'pre-wrap' }}
      />

      {/* TextArea 2 (descomenta si lo necesitas) */}
      {/*
      <TextArea
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder2}
        variant={variant}
        className={`nRec ${className ?? ""}`}
        autoSize={{ minRows: 3 }}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      */}
    </div>
  );
};

export default SyncedInputs;
