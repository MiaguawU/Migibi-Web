export const formatoFechaLegible = (fechaSQL: string): string => {
    const fecha = new Date(fechaSQL); // Convertir la cadena SQL a un objeto Date
  
    // Obtener los elementos de la fecha
    const diasSemana = [
      "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo", 
    ];
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", 
      "septiembre", "octubre", "noviembre", "diciembre",
    ];
  
    const diaSemana = diasSemana[fecha.getDay()]; // Día de la semana
    const dia = fecha.getDate()+1; // Día del mes
    const mes = meses[fecha.getMonth()]; // Mes (0-11)
    const año = fecha.getFullYear(); // Año
  
    return `${diaSemana} ${dia} de ${mes} de ${año}`;
  };
  
  // Ejemplo de uso
  const fechaSQL = "2024-11-10T07:30:24.000Z";
  console.log(formatoFechaLegible(fechaSQL)); // Jueves 10 de noviembre de 2024
  