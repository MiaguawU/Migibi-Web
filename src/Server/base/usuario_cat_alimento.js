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

const idAlimento = Joi.object({
  Id_Usuario: Joi.number().integer().required(),
  Id_Alimento: Joi.number().integer().required(),
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
router.get("/usuario/:id", (req, res) => {
  const { error: idError, value: idValue } = idSchema.validate(req.params);
  if (idError) return res.status(400).json({ error: idError.details[0].message });

  const query = `SELECT * FROM usuario_cat_alimento WHERE Id_Usuario =  ${idValue.id}`;

  db.query(query, (err, result) => {
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

// Puede_Comer = 0
router.put("/agregar/:Id_Usuario", (req, res) => {
  const { Id_Usuario } = req.params;
  const { Id_Alimento } = req.body;
  
  // Validar entrada (fusionando params y body)
  const { error } = idAlimento.validate({
    Id_Usuario: Number(Id_Usuario),
    Id_Alimento: Id_Alimento,
  });

  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const query = `UPDATE usuario_cat_alimento SET Puede_Comer = 0 WHERE Id_Alimento = ${Id_Alimento} and Id_Usuario = ${Id_Usuario};`;
  db.query(query, (err) => {
    if (err) {
      console.error("Error al actualizar la relación usuario-alimento:", err);
      return res.status(500).send("Error al actualizar la relación usuario-alimento");
    }
    res.json({ message: "Relación usuario-alimento actualizada con éxito" });
  });
});

// Puede_Comer = 1
router.put("/borrar/:Id_Usuario", (req, res) => {
  const { Id_Usuario } = req.params;
  const { Id_Alimento } = req.body;
  
  // Validar entrada (fusionando params y body)
  const { error } = idAlimento.validate({
    Id_Usuario: Number(Id_Usuario),
    Id_Alimento: Id_Alimento,
  });

  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }
  const query = `UPDATE usuario_cat_alimento SET Puede_Comer = 1 WHERE Id_Alimento = ${Id_Alimento} and Id_Usuario = ${Id_Usuario};`;
  db.query(query, (err) => {
    if (err) {
      console.error("Error al actualizar la relación usuario-alimento:", err);
      return res.status(500).send("Error al actualizar la relación usuario-alimento");
    }
    res.json({ message: "Relación usuario-alimento actualizada con éxito" });
  });
});

module.exports = router;