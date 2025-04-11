import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useBlockNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const confirmExit = window.confirm("¿Seguro que quieres salir?");
      if (!confirmExit) {
        event.preventDefault();
        navigate(1); // Volver a la página
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
};

export default useBlockNavigation;
