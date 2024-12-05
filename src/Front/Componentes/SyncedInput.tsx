import React from "react";
import { Input, ConfigProvider } from "antd";
import '../Estilos/EDrec.css';

interface SyncedInputsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder1?: string;
  placeholder2?: string;
  variant?: "borderless" | "default";
  className?: string;
}

const SyncedInputs: React.FC<SyncedInputsProps> = ({
  value,
  onChange,
  placeholder1 = "Input 1",
  placeholder2 = "Input 2",
  variant = "default",
  className,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      {/* Input 1 */}
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder1}
        variant="borderless" 
        className="nRec" 
      />
      {/* Input 2 */}
      {/**<Input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder2}
        variant="borderless" 
        className="nRec"
      /> */}
      
    </div>
  );
};

export default SyncedInputs;