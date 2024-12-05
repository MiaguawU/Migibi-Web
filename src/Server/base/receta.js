const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Crear una nueva receta (POST)
router.post("/", (req, res, next) => {
  const { nombre, id_usuario_alta, fecha_alta, id_tipo_consumo, imagen_receta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!nombre || !id_usuario_alta || !fecha_alta || !id_tipo_consumo || !imagen_receta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar una nueva receta
  const query = `
    INSERT INTO receta (Nombre, Id_Usuario_Alta, Fecha_Alta, Id_Tipo_Consumo, Imagen_receta) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [nombre, id_usuario_alta, fecha_alta, id_tipo_consumo, imagen_receta];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar receta:", err);
      return res.status(500).send("Error al agregar receta");
    }

    // Responder con el ID de la nueva receta
    res.json({ id: result.insertId, message: "Receta agregada con éxito" });
  });
});

// Obtener receta(s) (GET)
router.get("/", (req, res) => {

  let query = `SELECT
              Id_Receta, 
              Nombre, 
              Tiempo, 
              Calorias, 
              Imagen_receta,
              Activo
            FROM receta`;

 //nombre y id
 //tiempo
 //calorias
 //imagen y activo :3
  
  // Ejecutar la consulta
  db.query(query, (err, result) => {
   
    if (err) {
      console.error("Error al obtener recetas:", err);
      return res.status(500).send("Error al obtener recetas");
    }
    console.log("si salio :3");
    console.log(result);
    res.json(result);
  });
});


//eliminar receta
router.put("/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para actualizar una receta
  const query = `UPDATE receta SET Activo = 0 WHERE Id_Receta = ?`;
  console.error("id recibido");

  // Ejecutar la consulta
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al actualizar receta:", err);
      return res.status(500).send("Error al eliminar receta");
    }
    console.error("receta eliminada");
    res.json({ message: "Receta eliminada con éxito" });
  });
});

// Eliminar una receta (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar la receta como inactiva (baja lógica)
  const query = `
    UPDATE receta 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Receta = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar receta:", err);
      return res.status(500).send("Error al eliminar receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Receta eliminada con éxito" });
  });
});

module.exports = router;
