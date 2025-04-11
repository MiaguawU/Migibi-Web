const express = require("express");
const Joi = require("joi");
const db = require("./connection");
const router = express.Router();

// Esquema de validación con Joi
const instructionSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  instruccion: Joi.string().trim().required(),
  orden: Joi.number().integer().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.date().iso().required(),
});

const updateInstructionSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  instruccion: Joi.string().trim().required(),
  orden: Joi.number().integer().required(),
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.date().iso().required(),
});

const deleteInstructionSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().iso().required(),
});

// Crear una nueva instrucción de receta (POST)
router.post("/", (req, res) => {
  const { error } = instructionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_receta, instruccion, orden, id_usuario_alta, fecha_alta } = req.body;
  const query = `INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?, ?, ?)`;
  const values = [id_receta, instruccion, orden, id_usuario_alta, fecha_alta];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al agregar instrucción de receta");
    res.json({ id: result.insertId, message: "Instrucción de receta agregada con éxito" });
  });
});

// Obtener instrucciones de receta por receta (GET)
router.get("/receta/:id_receta", (req, res) => {
  const { id_receta } = req.params;
  const query = `SELECT * FROM receta_instrucciones WHERE Id_Receta = ? AND Activo = 1 ORDER BY Orden`;
  db.query(query, [id_receta], (err, result) => {
    if (err) return res.status(500).send("Error al obtener instrucciones de receta");
    res.json(result);
  });
});

// Actualizar una instrucción de receta (PUT)
router.put("/:id", (req, res) => {
  const { error } = updateInstructionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_receta, instruccion, orden, id_usuario_modif, fecha_modif } = req.body;
  const query = `UPDATE receta_instrucciones SET Id_Receta = ?, Instruccion = ?, Orden = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Receta_Instrucciones = ?`;
  const values = [id_receta, instruccion, orden, id_usuario_modif, fecha_modif, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al actualizar instrucción de receta");
    res.json({ message: "Instrucción de receta actualizada con éxito" });
  });
});

// Eliminar una instrucción de receta (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { error } = deleteInstructionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;
  const query = `UPDATE receta_instrucciones SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Receta_Instrucciones = ?`;
  const values = [id_usuario_baja, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al eliminar instrucción de receta");
    res.json({ message: "Instrucción de receta eliminada con éxito" });
  });
});

module.exports = router;
