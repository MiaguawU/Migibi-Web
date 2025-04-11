import { useEffect } from "react";

const useBlockShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey && event.key === "w") || // Bloquear Ctrl + W
        (event.altKey && event.key === "ArrowLeft") // Bloquear Alt + ←
      ) {
        event.preventDefault();
        alert("No puedes salir de esta página.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export default useBlockShortcuts;
