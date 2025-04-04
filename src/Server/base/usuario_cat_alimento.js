const express = require('express');
const db = require('./connection');
const router = express.Router();
const Joi = require('joi');

// Esquema de validación con Joi
const usuarioAlimentoSchema = Joi.object({
  id_usuario: Joi.number().integer().required(),
  id_alimento: Joi.number().integer().required(),
  puede_comer: Joi.boolean().required()
});

const puedeComerSchema = Joi.object({
  puede_comer: Joi.boolean().required()
});

const idSchema = Joi.object({
  id: Joi.number().integer().required()
});

// Crear una relación usuario-alimento (POST)
router.post("/", (req, res) => {
  const { error, value } = usuarioAlimentoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_usuario, id_alimento, puede_comer } = value;
  const query = `INSERT INTO usuario_cat_alimento (Id_Usuario, Id_Alimento, Puede_Comer) VALUES (?, ?, ?)`;
  db.query(query, [id_usuario, id_alimento, puede_comer], (err, result) => {
    if (err) {
      console.error("Error al agregar relación usuario-alimento:", err);
      return res.status(500).send("Error al agregar relación usuario-alimento");
    }
    res.json({ id: result.insertId, message: "Relación usuario-alimento agregada con éxito" });
  });
});

// Obtener todas las relaciones usuario-alimento (GET)
router.get("/", (req, res) => {
  const query = `SELECT * FROM usuario_cat_alimento`;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener relaciones usuario-alimento:", err);
      return res.status(500).send("Error al obtener relaciones usuario-alimento");
    }
    res.json(result);
  });
});

// Obtener las relaciones de un usuario específico (GET)
router.get("/usuario/:id_usuario", (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const query = `SELECT * FROM usuario_cat_alimento WHERE Id_Usuario = ?`;
  db.query(query, [value.id], (err, result) => {
    if (err) {
      console.error("Error al obtener las relaciones del usuario:", err);
      return res.status(500).send("Error al obtener las relaciones del usuario");
    }
    if (result.length === 0) {
      return res.status(404).send("No se encontraron relaciones para este usuario");
    }
    res.json(result);
  });
});

// Actualizar la relación usuario-alimento (PUT)
router.put("/:id", (req, res) => {
  const { error: idError, value: idValue } = idSchema.validate(req.params);
  if (idError) return res.status(400).json({ error: idError.details[0].message });

  const { error, value } = puedeComerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const query = `UPDATE usuario_cat_alimento SET Puede_Comer = ? WHERE Id_Usuario_Cat_Alimento = ?`;
  db.query(query, [value.puede_comer, idValue.id], (err) => {
    if (err) {
      console.error("Error al actualizar la relación usuario-alimento:", err);
      return res.status(500).send("Error al actualizar la relación usuario-alimento");
    }
    res.json({ message: "Relación usuario-alimento actualizada con éxito" });
  });
});

// Eliminar la relación usuario-alimento (DELETE)
router.delete("/:id", (req, res) => {
  const { error, value } = idSchema.validate(req.params);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const query = `DELETE FROM usuario_cat_alimento WHERE Id_Usuario_Cat_Alimento = ?`;
  db.query(query, [value.id], (err) => {
    if (err) {
      console.error("Error al eliminar la relación usuario-alimento:", err);
      return res.status(500).send("Error al eliminar la relación usuario-alimento");
    }
    res.json({ message: "Relación usuario-alimento eliminada con éxito" });
  });
});

module.exports = router;