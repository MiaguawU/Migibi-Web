const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Crear una nueva lista de compra (POST)
router.post("/", (req, res, next) => {
  const { id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_unidad_medida || cantidad === undefined || !id_alimento || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar una nueva lista de compra
  const query = `
    INSERT INTO lista_compra (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar lista de compra:", err);
      return res.status(500).send("Error al agregar lista de compra");
    }

    // Responder con el ID de la nueva lista de compra
    res.json({ id: result.insertId, message: "Lista de compra agregada con éxito" });
  });
});

// Obtener lista de compra (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;

  // Construir la consulta SQL
  let query = `SELECT * FROM lista_compra WHERE 1`;

  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }

  // Ejecutar la consulta
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al obtener lista de compra:", err);
      return res.status(500).send("Error al obtener lista de compra");
    }

    // Devolver las listas de compra encontradas
    res.json(result);
  });
});

// Actualizar una lista de compra (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_modif, fecha_modif, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_unidad_medida || cantidad === undefined || !id_alimento || !id_usuario_modif || !fecha_modif || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar una lista de compra
  const query = `
    UPDATE lista_compra 
    SET Id_Receta = ?, Id_Unidad_Medida = ?, Cantidad = ?, Id_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Lista_Compra = ?
  `;
  const values = [id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_modif, fecha_modif, activo, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar lista de compra:", err);
      return res.status(500).send("Error al actualizar lista de compra");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Lista de compra actualizada con éxito" });
  });
});

// Eliminar una lista de compra (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar la lista de compra como inactiva (baja lógica)
  const query = `
    UPDATE lista_compra 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Lista_Compra = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar lista de compra:", err);
      return res.status(500).send("Error al eliminar lista de compra");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Lista de compra eliminada con éxito" });
  });
});

module.exports = router;
