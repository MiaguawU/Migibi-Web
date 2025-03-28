const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const Joi = require("joi");

// Crear un nueva instrucción de una nueva receta 
router.post("/", (req, res) => {
    // Desestructuración de los datos del body
    const { instruccion, orden, Id_Usuario_Alta, Fecha_Alta } = req.body;
    const  id_receta = 1; //id temporal para despues agregar el verdadero

    

    console.log("Headers:", req.headers); 
    console.log("Body recibido:", req.body);

    // Validar que los campos requeridos estén presentes
    if (!id_receta || !instruccion || !orden) {
      return res.status(400).send("Faltan datos requeridos");
    }

    // Consulta de inserción en la tabla `receta_instrucciones`
    const query = `
      INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [id_receta, instruccion, orden, Id_Usuario_Alta, Fecha_Alta];

    // Ejecutar la consulta para insertar la instrucción
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al insertar instrucción:", err);
        return res.status(500).send("Error al agregar instrucción");
      }
      res.json({ id: result.insertId, message: "Instrucción agregada con éxito" });
    });
});

// Obtener todas las instrucciones de una receta específica (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params; // Cambiado a "id", que es lo que llega en la URL
  
  const query = `
    SELECT 
      ri.Instruccion AS Nombre,
      ri.Orden AS Orden,
      ri.Id_Receta_Instrucciones AS id,
      ri.Activo AS Activo
    FROM receta_instrucciones ri
    WHERE ri.Id_Receta = ?
    ORDER BY ri.Orden ASC;
  `;

  db.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error al obtener instrucciones de receta:", err);
          return res.status(500).send("Error al obtener las instrucciones");
      }
      res.json(results);
  });
});



// Actualizar una instrucción de receta (PUT)
router.put("/:id", (req, res) => {
    const { id } = req.params;


    // Consulta para actualizar la instrucción de receta
    const query = `
      UPDATE receta_instrucciones
      SET Id_Receta_Instrucciones = ?, Cantidad = ?, Id_Unidad_Medida = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
      WHERE Id_Receta = ?
    `;
    const values = [id_receta, instruccion, orden, Id_Usuario_Alta, Fecha_Alta, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar la instrucción:", err);
        return res.status(500).send("Error al actualizar la instrucción");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Instrucción no encontrada");
      }
      res.json({ message: "Instrucción actualizada con éxito" });
    });
});

// Eliminar una instrucción de receta (DELETE)
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM receta_instrucciones WHERE Id_Instruccion = ?";
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar la instrucción:", err);
        return res.status(500).send("Error al eliminar la instrucción");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Instrucción no encontrada");
      }
      res.json({ message: "Instrucción eliminada con éxito" });
    });
});

module.exports = router;
