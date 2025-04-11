const express = require('express');
const db = require('./connection');
const router = express.Router();
const Joi = require("joi");

// Esquema de validación con Joi
const recetaInstruccionSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  instruccion: Joi.string().trim().min(3).required(),
  orden: Joi.number().integer().min(1).required(),
  Id_Usuario_Alta: Joi.number().integer().required(),
  Fecha_Alta: Joi.date().iso().required()
});

// Esquema para actualizar
const updateSchema = Joi.object({
  instruccion: Joi.string().trim().min(3).required(),
  orden: Joi.number().integer().min(1).required(),
  Id_Usuario_Alta: Joi.number().integer().required(),
  Fecha_Alta: Joi.date().iso().required()
});

// Crear una nueva instrucción de una receta
router.post("/", (req, res) => {
  const id_receta = 1; // Temporal, reemplazar con el real

  // Validar con Joi
  const { error, value } = recetaInstruccionSchema.validate({ ...req.body, id_receta });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { instruccion, orden, Id_Usuario_Alta, Fecha_Alta } = value;

  const query = `
    INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [id_receta, instruccion, orden, Id_Usuario_Alta, Fecha_Alta], (err, result) => {
    if (err) {
      console.error("Error al insertar instrucción:", err);
      return res.status(500).send("Error al agregar instrucción");
    }
    res.json({ id: result.insertId, message: "Instrucción agregada con éxito" });
  });
});

// Obtener todas las instrucciones de una receta específica
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

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

// Actualizar una instrucción de receta
router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { instruccion, orden, Id_Usuario_Alta, Fecha_Alta } = value;

  const query = `
    UPDATE receta_instrucciones
    SET Instruccion = ?, Orden = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
    WHERE Id_Receta_Instrucciones = ?
  `;
  db.query(query, [instruccion, orden, Id_Usuario_Alta, Fecha_Alta, id], (err, result) => {
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

// Eliminar una instrucción de receta
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const query = "DELETE FROM receta_instrucciones WHERE Id_Receta_Instrucciones = ?";
  
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
