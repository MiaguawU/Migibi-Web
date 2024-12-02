const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Crear una nueva receta de consumo (POST)
router.post("/", (req, res, next) => {
  const { id_receta, id_usuario_receta, fecha_consumo, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_usuario_receta || !fecha_consumo || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar un nuevo consumo
  const query1 = `
    INSERT INTO consumo (Id_Receta, Id_Usuario_Receta, Fecha_Consumo, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values1 = [id_receta, id_usuario_receta, fecha_consumo, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al insertar consumo:", err1);
      return res.status(500).send("Error al agregar consumo");
    }

    // Responder con el ID de la nueva receta de consumo
    res.json({ id: result1.insertId, message: "Consumo agregado con éxito" });
  });
});

// Obtener consumos (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;

  // Construir la consulta SQL
  let query = `SELECT * FROM consumo WHERE 1`;

  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }

  // Ejecutar la consulta
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al obtener consumos:", err);
      return res.status(500).send("Error al obtener consumos");
    }

    // Devolver los consumos encontrados
    res.json(result);
  });
});

// Actualizar un consumo (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_receta, id_usuario_receta, fecha_consumo, id_usuario_modif, fecha_modif, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_usuario_receta || !fecha_consumo || !id_usuario_modif || !fecha_modif || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar un consumo
  const query1 = `
    UPDATE consumo 
    SET Id_Receta = ?, Id_Usuario_Receta = ?, Fecha_Consumo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Consumo = ?
  `;
  const values1 = [id_receta, id_usuario_receta, fecha_consumo, id_usuario_modif, fecha_modif, activo, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al actualizar consumo:", err1);
      return res.status(500).send("Error al actualizar consumo");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Consumo actualizado con éxito" });
  });
});

// Eliminar un consumo (marcarlo como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar el consumo como inactivo (baja lógica)
  const query1 = `
    UPDATE consumo 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Consumo = ?
  `;
  const values1 = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al eliminar consumo:", err1);
      return res.status(500).send("Error al eliminar consumo");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Consumo eliminado con éxito" });
  });
});

module.exports = router;
