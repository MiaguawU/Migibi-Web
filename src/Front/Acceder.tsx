import React, { useState } from "react";
import AuthForm from "./Componentes/AuthForm";

const App: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);  
  
  const onLogin = (userData: any) => {
    setUserData(userData);  
    console.log("Usuario logueado:", userData);  
  };

  return (
    <div>
      <AuthForm onLogin={onLogin} />
    </div>
  );
};

export default App;
