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
    console.log(`Fecha>='${fechaInicio}' AND Fecha<'${fechaFin}'`);
    return `Fecha>='${fechaInicio}' AND Fecha<'${fechaFin}'`;
  }
// Exporta la función
module.exports = { FechaActual, FechaSQL };
