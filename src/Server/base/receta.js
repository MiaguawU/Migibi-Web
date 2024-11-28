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
  const { activo, id_tipo_consumo } = req.query;

  // Construir la consulta SQL
  let query = `SELECT * FROM receta WHERE 1`;

  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }
  if (id_tipo_consumo) {
    query += ` AND Id_Tipo_Consumo = ?`;
    params.push(id_tipo_consumo);
  }

  // Ejecutar la consulta
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al obtener recetas:", err);
      return res.status(500).send("Error al obtener recetas");
    }

    // Devolver las recetas encontradas
    res.json(result);
  });
});

// Obtener receta por ID (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para obtener una receta por su ID
  const query = `SELECT * FROM receta WHERE Id_Receta = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener receta:", err);
      return res.status(500).send("Error al obtener receta");
    }

    // Si no se encuentra la receta
    if (result.length === 0) {
      return res.status(404).send("Receta no encontrada");
    }

    // Devolver la receta encontrada
    res.json(result[0]);
  });
});

// Actualizar una receta (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, id_usuario_modif, fecha_modif, id_tipo_consumo, imagen_receta, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!nombre || !id_usuario_modif || !fecha_modif || !id_tipo_consumo || !imagen_receta || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar una receta
  const query = `
    UPDATE receta 
    SET Nombre = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Id_Tipo_Consumo = ?, Imagen_receta = ?, Activo = ?
    WHERE Id_Receta = ?
  `;
  const values = [nombre, id_usuario_modif, fecha_modif, id_tipo_consumo, imagen_receta, activo, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar receta:", err);
      return res.status(500).send("Error al actualizar receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Receta actualizada con éxito" });
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
