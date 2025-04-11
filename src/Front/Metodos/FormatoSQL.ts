
export const formatoSQL = (fechaInput: Date | string | number): string => {
    const fecha = new Date(fechaInput);
  
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (1-12)
    const day = String(fecha.getDate()).padStart(2, '0'); // Día del mes
    const hours = String(fecha.getHours()).padStart(2, '0'); // Horas
    const minutes = String(fecha.getMinutes()).padStart(2, '0'); // Minutos
    const seconds = String(fecha.getSeconds()).padStart(2, '0'); // Segundos
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const fechaEjemplo = "2024-12-09T07:30:24.000Z";
  console.log(formatoSQL(fechaEjemplo)); // Output: "2024-12-09 07:30:24"