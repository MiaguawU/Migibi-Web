const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Llamando a caducar");

  const query1 = `
    SELECT * FROM vw_stock_detalle WHERE Activo = 1 order by Fecha_Caducidad, Alimento ASC limit 10;`;
  
  db.query(query1, (err, result1) => {
    if (err) {
      console.log("Error:", err);  // Loguea el error
      return res.status(404).send("Alimento no encontrado");
    }
    console.log("Enviando alimentos por caducar");
    console.log(result1);
    
    // Enviar la respuesta correctamente
    return res.json({ porcaducar: result1 });
  });
});


router.put("/", (req, res) => {
  const { ids} = req.body; // Obtener los IDs y la cantidad desde el cuerpo de la solicitud

  // Validar que se hayan enviado los datos necesarios
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Faltan los IDs o no son válidos.");
  }


  // Construir una consulta para actualizar múltiples registros
  const placeholders = ids.map(() => "?").join(", ");
  const query = `UPDATE stock_detalle SET Activo = 0, Cantidad = 0 WHERE Id_Stock_Detalle IN (${placeholders})`;

  // Combinar los valores para la consulta
  const values = [Cantidad, ...ids];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar los alimentos:", err);
      return res.status(500).send("Error al actualizar los alimentos.");
    }
    res.json({ message: "Alimentos actualizados correctamente", affectedRows: result.affectedRows });
    console.log("Alimentos actualizados:", ids);
  });
});


module.exports = router;
