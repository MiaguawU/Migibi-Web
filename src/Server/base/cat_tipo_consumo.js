const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const Joi = require('joi');


// Obtener todos los registros
router.get('/', (req, res) => {
  console.log("enviando");
    db.query('SELECT Id_Tipo_Consumo, Tipo_Consumo FROM cat_tipo_consumo;', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  });
  
 
  

router.post('/', (req, res) => {
  const schema = Joi.object({
    Tipo_Consumo: Joi.string().required(),
    Id_Usuario_Alta: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { Tipo_Consumo, Id_Usuario_Alta } = req.body;
  const now = new Date();
  const query = 'INSERT INTO cat_tipo_consumo (Tipo_Consumo, Activo, Id_Usuario_Alta, Fecha_Alta) VALUES (?, 1, ?, ?)';
  db.query(query, [Tipo_Consumo, Id_Usuario_Alta, now], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Registro creado', id: result.insertId });
  });
});

  
  // Actualizar un registro
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Tipo_Consumo, Id_Usuario_Modif } = req.body;
    const now = new Date();
    const query = 'UPDATE cat_tipo_consumo SET Tipo_Consumo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [Tipo_Consumo, Id_Usuario_Modif, now, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro actualizado' });
    });
  });
  
  // Eliminar (desactivar) un registro
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { Id_Usuario_Baja } = req.body;
    const now = new Date();
    const query = 'UPDATE cat_tipo_consumo SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [Id_Usuario_Baja, now, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro eliminado (desactivado)' });
    });
  });
  
  module.exports = router;