const express = require('express');
const db = require('./connection');
const router = express.Router();
const Joi = require("joi");

// Esquema de validación para insertar un detalle de receta
const recetaDetalleSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  cantidad: Joi.number().precision(2).positive().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.date().iso().required(),
  id_alimento: Joi.number().integer().required()
});

// Esquema para actualizar un detalle de receta
const updateRecetaDetalleSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  cantidad: Joi.number().precision(2).positive().required(),
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.date().iso().required(),
  id_alimento: Joi.number().integer().required(),
  activo: Joi.boolean().required()
});

// Esquema para la baja lógica (DELETE)
const deleteRecetaDetalleSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().iso().required()
});

// Crear un nuevo detalle de receta (POST)
router.post("/", (req, res) => {
  const { error, value } = recetaDetalleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_receta, id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, id_alimento } = value;

  const query = `
    INSERT INTO receta_detalle (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Usuario_Alta, Fecha_Alta, Id_Alimento) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [id_receta, id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, id_alimento], (err, result) => {
    if (err) {
      console.error("Error al agregar detalle de receta:", err);
      return res.status(500).send("Error al agregar detalle de receta");
    }
    res.json({ id: result.insertId, message: "Detalle de receta agregado con éxito" });
  });
});

// Obtener detalles de receta por receta (GET)
router.get("/receta/:id_receta", (req, res) => {
  const { id_receta } = req.params;
  if (!/^\d+$/.test(id_receta)) return res.status(400).send("ID inválido");

  const query = `SELECT * FROM receta_detalle WHERE Id_Receta = ? AND Activo = 1`;

  db.query(query, [id_receta], (err, result) => {
    if (err) {
      console.error("Error al obtener detalles de receta:", err);
      return res.status(500).send("Error al obtener detalles de receta");
    }
    res.json(result);
  });
});

// Actualizar un detalle de receta (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const { error, value } = updateRecetaDetalleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_receta, id_unidad_medida, cantidad, id_usuario_modif, fecha_modif, id_alimento, activo } = value;

  const query = `
    UPDATE receta_detalle 
    SET Id_Receta = ?, Id_Unidad_Medida = ?, Cantidad = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Id_Alimento = ?, Activo = ?
    WHERE Id_Receta_Detalle = ?
  `;
  db.query(query, [id_receta, id_unidad_medida, cantidad, id_usuario_modif, fecha_modif, id_alimento, activo, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar detalle de receta:", err);
      return res.status(500).send("Error al actualizar detalle de receta");
    }
    res.json({ message: "Detalle de receta actualizado con éxito" });
  });
});

// Eliminar un detalle de receta (marcarlo como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const { error, value } = deleteRecetaDetalleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_usuario_baja, fecha_baja } = value;

  const query = `
    UPDATE receta_detalle 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Receta_Detalle = ?
  `;
  db.query(query, [id_usuario_baja, fecha_baja, id], (err, result) => {
    if (err) {
      console.error("Error al eliminar detalle de receta:", err);
      return res.status(500).send("Error al eliminar detalle de receta");
    }
    res.json({ message: "Detalle de receta eliminado con éxito" });
  });
});

module.exports = router;
