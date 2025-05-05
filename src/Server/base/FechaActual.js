function FechaActual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const dia = String(hoy.getDate()).padStart(2, '0');
  
    // Generar las fechas del rango
    const fechaInicio = `${año}-${mes}-${dia}`;
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const mesMañana = String(mañana.getMonth() + 1).padStart(2, '0');
    const diaMañana = String(mañana.getDate()).padStart(2, '0');
    const fechaFin = `${mañana.getFullYear()}-${mesMañana}-${diaMañana}`;
  
    return `rd.fecha>='${fechaInicio}' AND rd.fecha<'${fechaFin}'`;
  }
  function FechaActual1() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const dia = String(hoy.getDate()).padStart(2, '0');
  
    // Generar las fechas del rango
    const fechaInicio = `${año}-${mes}-${dia}`;
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const mesMañana = String(mañana.getMonth() + 1).padStart(2, '0');
    const diaMañana = String(mañana.getDate()).padStart(2, '0');
    const fechaFin = `${mañana.getFullYear()}-${mesMañana}-${diaMañana}`;
  
    return `Fecha>='${fechaInicio}' AND Fecha<'${fechaFin}'`;
  }
  function FechaSQL(fechaInput) {
    console.log(fechaInput);
    const hoy = new Date(fechaInput);
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const dia = String(hoy.getDate()).padStart(2, '0');
  
    // Generar las fechas del rango
    const fechaInicio = `${año}-${mes}-${dia}`;
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const mesMañana = String(mañana.getMonth() + 1).padStart(2, '0');
    const diaMañana = String(mañana.getDate()).padStart(2, '0');
    const fechaFin = `${mañana.getFullYear()}-${mesMañana}-${diaMañana}`;

    return `Fecha>='${fechaInicio}' AND Fecha<'${fechaFin}'`;
  }
  function FechaSQL(fechaInput) {
    console.log(fechaInput);
    const hoy = new Date(fechaInput);
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const dia = String(hoy.getDate()).padStart(2, '0');
  
    // Generar las fechas del rango
    const fechaInicio = `${año}-${mes}-${dia}`;
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const mesMañana = String(mañana.getMonth() + 1).padStart(2, '0');
    const diaMañana = String(mañana.getDate()).padStart(2, '0');
    const fechaFin = `${mañana.getFullYear()}-${mesMañana}-${diaMañana}`;

    return `Fecha>='${fechaInicio}' AND Fecha<'${fechaFin}'`;
  }

  function formatoSQL (fechaInput) {
    const fecha = new Date(fechaInput);
  
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (1-12)
    const day = String(fecha.getDate()).padStart(2, '0'); // Día del mes
  
    return `${year}-${month}-${day} 00:00:00`;
  };
  
  function getCurrentWeekDates() {
  const result = [];
  for (let i = 0; i < 7; i++) {
  const monday = new Date();
  const day = monday.getDay(); // 0 (domingo) - 6 (sábado)
  const diff = monday.getDate() - day + 1; // Lunes
    const d = new Date(monday.setDate(diff + i));
    console.log(d.getDate())
    result.push(formatoSQL(d)); // formato YYYY-MM-DD
  }
  return result;
  }
function semanaFormato() {
  const monday = new Date();
  const day = monday.getDay(); // 0 (domingo) - 6 (sábado)
  const diff = monday.getDate() - day + 1; // Lunes
  const d = new Date(monday.setDate(diff));
  const sunday = new Date();
  const dS = new Date(sunday.setDate(diff + 7));
  return `Fecha>='${formatoSQL(d)}' AND Fecha<'${formatoSQL(dS)}'`;
}
// Exporta la función
module.exports = { FechaActual, FechaSQL, FechaActual1, semanaFormato, getCurrentWeekDates };
