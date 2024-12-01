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
    
    // Enviar la respuesta correctamente
    return res.json({ porcaducar: result1 });
  });
});


router.put("/:id", (req, res) => {
  const id = req.params.id;  // Obtener el ID de los parámetros de la URL
  const data = req.body;  // El resto de los datos vienen del cuerpo de la solicitud

  // Lógica para actualizar el alimento con el ID
  const query = 'UPDATE stock_detalle SET ... WHERE id = ?'; // Usa el id en la consulta
  
  db.query(query, [id, data], (err, result) => {
    if (err) {
      return res.status(500).send("Error al actualizar el alimento");
    }
    res.json({ message: "Alimento actualizado correctamente" });
  });
});

module.exports = router;
