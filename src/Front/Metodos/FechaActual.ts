export const FechaActual = (): string => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const dia = hoy.getDate().toString().padStart(2, '0');
  
    // Generar las fechas del rango
    const fechaInicio = `${año}-${mes}-${dia}`;
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const mesMañana = (mañana.getMonth() + 1).toString().padStart(2, '0');
    const diaMañana = mañana.getDate().toString().padStart(2, '0');
    const fechaFin = `${mañana.getFullYear()}-${mesMañana}-${diaMañana}`;
  
    return `fecha>='${fechaInicio}' AND fecha<'${fechaFin}'`;
  };
  