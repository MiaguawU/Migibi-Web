const express = require('express');
const Joi = require('joi');
const db = require('./connection');
const router = express.Router();

// Esquema de validación para stock
const stockSchema = Joi.object({
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.string().isoDate().required(),
});

const stockUpdateSchema = Joi.object({
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.string().isoDate().required(),
});

const stockDeleteSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.string().isoDate().required(),
});

// Crear un nuevo registro en el stock (POST)
router.post("/", (req, res) => {
  const { error } = stockSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id_usuario_alta, fecha_alta } = req.body;
  const query = "INSERT INTO stock (Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?)";
  db.query(query, [id_usuario_alta, fecha_alta], (err, result) => {
    if (err) return res.status(500).send("Error al agregar stock");
    res.json({ id: result.insertId, message: "Stock agregado con éxito" });
  });
});

// Obtener todos los registros de stock activos (GET)
router.get("/", (req, res) => {
  const query = "SELECT * FROM stock WHERE Activo = 1";
  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Error al obtener registros de stock");
    res.json(result);
  });
});

// Obtener un registro de stock por ID (GET)
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM stock WHERE Id_Stock = ? AND Activo = 1";
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).send("Error al obtener el registro de stock");
    if (result.length === 0) return res.status(404).send("Registro de stock no encontrado");
    res.json(result[0]);
  });
});

// Actualizar un registro de stock (PUT)
router.put("/:id", (req, res) => {
  const { error } = stockUpdateSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id_usuario_modif, fecha_modif } = req.body;
  const query = "UPDATE stock SET Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Stock = ?";
  db.query(query, [id_usuario_modif, fecha_modif, req.params.id], (err) => {
    if (err) return res.status(500).send("Error al actualizar el stock");
    res.json({ message: "Stock actualizado con éxito" });
  });
});

// Eliminar un registro de stock (marcar como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { error } = stockDeleteSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id_usuario_baja, fecha_baja } = req.body;
  const query = "UPDATE stock SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Stock = ?";
  db.query(query, [id_usuario_baja, fecha_baja, req.params.id], (err) => {
    if (err) return res.status(500).send("Error al eliminar el stock");
    res.json({ message: "Stock eliminado con éxito" });
  });
});

module.exports = router;
