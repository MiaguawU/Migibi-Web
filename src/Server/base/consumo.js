const express = require('express');
const Joi = require('joi');
const db = require('./connection');
const router = express.Router();

// Esquema de validación con Joi
const consumoSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_usuario_receta: Joi.number().integer().required(),
  fecha_consumo: Joi.string().isoDate().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.string().isoDate().required()
});

const updateConsumoSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_usuario_receta: Joi.number().integer().required(),
  fecha_consumo: Joi.string().isoDate().required(),
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.string().isoDate().required(),
  activo: Joi.boolean().required()
});

const deleteConsumoSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.string().isoDate().required()
});

// Crear una nueva receta de consumo (POST)
router.post("/", (req, res) => {
  const { error } = consumoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_receta, id_usuario_receta, fecha_consumo, id_usuario_alta, fecha_alta } = req.body;
  const query = `INSERT INTO consumo (Id_Receta, Id_Usuario_Receta, Fecha_Consumo, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?, ?, ?)`;
  const values = [id_receta, id_usuario_receta, fecha_consumo, id_usuario_alta, fecha_alta];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al agregar consumo" });
    res.json({ id: result.insertId, message: "Consumo agregado con éxito" });
  });
});

// Obtener consumos (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;
  let query = "SELECT * FROM consumo WHERE 1";
  const params = [];
  if (activo !== undefined) {
    query += " AND Activo = ?";
    params.push(activo);
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Error al obtener consumos" });
    res.json(result);
  });
});

// Actualizar un consumo (PUT)
router.put("/:id", (req, res) => {
  const { error } = updateConsumoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_receta, id_usuario_receta, fecha_consumo, id_usuario_modif, fecha_modif, activo } = req.body;
  const query = `UPDATE consumo SET Id_Receta = ?, Id_Usuario_Receta = ?, Fecha_Consumo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ? WHERE Id_Consumo = ?`;
  const values = [id_receta, id_usuario_receta, fecha_consumo, id_usuario_modif, fecha_modif, activo, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: "Error al actualizar consumo" });
    res.json({ message: "Consumo actualizado con éxito" });
  });
});

// Eliminar un consumo (marcarlo como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { error } = deleteConsumoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;
  const query = `UPDATE consumo SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Consumo = ?`;
  const values = [id_usuario_baja, fecha_baja, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: "Error al eliminar consumo" });
    res.json({ message: "Consumo eliminado con éxito" });
  });
});

module.exports = router;