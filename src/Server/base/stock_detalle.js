const express = require("express");
const Joi = require("joi");
const db = require("./connection");
const router = express.Router();

// Esquema de validación con Joi
const stockDetailSchema = Joi.object({
  id_unidad_medida: Joi.number().integer().required(),
  cantidad: Joi.number().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.date().iso().required(),
  total: Joi.number().required(),
  cantidad_consumida: Joi.number().required(),
  fecha_caducidad: Joi.date().iso().allow(null),
  es_perecedero: Joi.boolean().required(),
  id_alimento: Joi.number().integer().required(),
  id_stock: Joi.number().integer().allow(null),
});

const updateStockDetailSchema = Joi.object({
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.date().iso().required(),
  cantidad: Joi.number().required(),
  total: Joi.number().required(),
  cantidad_consumida: Joi.number().required(),
  fecha_caducidad: Joi.date().iso().allow(null),
  es_perecedero: Joi.boolean().required(),
});

const deleteStockDetailSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().iso().required(),
});

// Crear un nuevo detalle de stock (POST)
router.post("/", (req, res) => {
  const { error } = stockDetailSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const query = `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Id_Usuario_Alta, Fecha_Alta, Total, Cantidad_Consumida, Fecha_Caducidad, Es_Perecedero, Id_Alimento, Id_Stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = Object.values(req.body);

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al agregar detalle de stock");
    res.json({ id: result.insertId, message: "Detalle de stock agregado con éxito" });
  });
});

// Obtener todos los detalles de stock activos (GET)
router.get("/", (req, res) => {
  const query = `SELECT * FROM stock_detalle WHERE Activo = 1`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Error al obtener detalles de stock");
    res.json(result);
  });
});

// Obtener un detalle de stock específico por ID (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM stock_detalle WHERE Id_Stock_Detalle = ? AND Activo = 1`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("Error al obtener el detalle de stock");
    if (result.length === 0) return res.status(404).send("Detalle de stock no encontrado");
    res.json(result[0]);
  });
});

// Actualizar un detalle de stock (PUT)
router.put("/:id", (req, res) => {
  const { error } = updateStockDetailSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const query = `UPDATE stock_detalle SET Id_Usuario_Modif = ?, Fecha_Modif = ?, Cantidad = ?, Total = ?, Cantidad_Consumida = ?, Fecha_Caducidad = ?, Es_Perecedero = ? WHERE Id_Stock_Detalle = ?`;
  const values = [...Object.values(req.body), id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al actualizar el detalle de stock");
    res.json({ message: "Detalle de stock actualizado con éxito" });
  });
});

// Eliminar un detalle de stock (DELETE - Baja lógica)
router.delete("/:id", (req, res) => {
  const { error } = deleteStockDetailSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;
  const query = `UPDATE stock_detalle SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Stock_Detalle = ?`;
  const values = [id_usuario_baja, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al eliminar el detalle de stock");
    res.json({ message: "Detalle de stock eliminado con éxito" });
  });
});

module.exports = router;