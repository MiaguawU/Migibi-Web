const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

router.get("/:id", (req, res) => {
  console.log("Llamando a caducar");

  const query1 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Cantidad AS Cantidad,
      sd.Fecha_Caducidad AS Fecha,
      ca.Id_Usuario_Alta
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    WHERE ca.Es_Perecedero = 1 
      AND sd.Activo = 1 
      AND ca.Id_Usuario_Alta = ?
    ORDER BY sd.Fecha_Caducidad ASC 
    LIMIT 10;
  `;

  const id = req.params.id; // Se obtiene correctamente el ID desde los parámetros

  db.query(query1, [id], (err, result1) => {
    if (err) {
      console.error("Error:", err);  // Usa console.error para errores
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    if (result1.length === 0) {
      return res.status(404).json({ message: "No se encontraron alimentos por caducar" });
    }

    console.log("Enviando alimentos por caducar:", result1);
    
    // Enviar la respuesta correctamente
    return res.json({ porcaducar: result1 });
  });
});



router.put("/", (req, res) => {
  const { ids } = req.body; // Obtener los IDs desde el cuerpo de la solicitud

  // Validar que se hayan enviado los datos necesarios
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Faltan los IDs o no son válidos.");
  }

  // Registrar resultados de las actualizaciones
  const resultados = { actualizados: [], errores: [] };

  // Función para procesar cada ID
  const procesarId = (id, callback) => {
    const query = `UPDATE stock_detalle SET Activo = 0, Cantidad = 0 WHERE Id_Stock_Detalle = ?`;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error(`Error al actualizar el ID ${id}:`, err);
        resultados.errores.push({ id, error: err.message });
      } else {
        console.log(`ID ${id} actualizado correctamente.`);
        resultados.actualizados.push(id);
      }
      callback(); // Llamar al callback para continuar
    });
  };

  // Procesar los IDs uno por uno
  let index = 0;
  const procesarSiguiente = () => {
    if (index < ids.length) {
      const id = ids[index];
      index++;
      procesarId(id, procesarSiguiente); // Procesar el siguiente ID
    } else {
      // Finalizar cuando se procesen todos los IDs
      res.json({
        message: "Proceso de actualización finalizado.",
        resultados,
      });
    }
  };

  // Iniciar el procesamiento
  procesarSiguiente();
});



module.exports = router;
