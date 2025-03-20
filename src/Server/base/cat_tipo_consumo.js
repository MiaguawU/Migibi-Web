const express = require('express');
const db = require('./connection');
const router = express.Router();
const Joi = require('joi');

// Función para verificar permisos
const verificarPermisos = (id_usuario, res, callback) => {
  const query = 'SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?';
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos", err);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }
    if (!result.length || result[0].Id_Rol == 1) {
      return res.status(403).json({ error: "Acceso prohibido: No tienes permiso para realizar esta acción" });
    }
    callback();
  });
};

// Obtener todos los registros
router.get('/', (req, res) => {
  console.log("Enviando datos");
  db.query('SELECT * FROM cat_tipo_consumo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Crear un nuevo registro
router.post('/', (req, res) => {
  const schema = Joi.object({
    Tipo_Consumo: Joi.string().required(),
    Id_Usuario_Alta: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { Tipo_Consumo, Id_Usuario_Alta } = req.body;
  const fecha_alta = new Date();

  verificarPermisos(Id_Usuario_Alta, res, () => {
    const query = 'INSERT INTO cat_tipo_consumo (Tipo_Consumo, Activo, Id_Usuario_Alta, Fecha_Alta) VALUES (?, 1, ?, ?)';
    db.query(query, [Tipo_Consumo, Id_Usuario_Alta, fecha_alta], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Registro creado', id: result.insertId });
    });
  });
});

// Actualizar un registro
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Tipo_Consumo, Id_Usuario_Modif } = req.body;
  const fecha_modif = new Date();

  if (!Tipo_Consumo || !Id_Usuario_Modif) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  verificarPermisos(Id_Usuario_Modif, res, () => {
    const query = 'UPDATE cat_tipo_consumo SET Tipo_Consumo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [Tipo_Consumo, Id_Usuario_Modif, fecha_modif, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro actualizado' });
    });
  });
});

// Eliminar (desactivar) un registro
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { Id_Usuario_Baja } = req.body;
  const fecha_baja = new Date();

  if (!Id_Usuario_Baja) {
    return res.status(400).json({ error: "Faltan datos requeridos para la baja" });
  }

  verificarPermisos(Id_Usuario_Baja, res, () => {
    const query = 'UPDATE cat_tipo_consumo SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [Id_Usuario_Baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro eliminado (desactivado)' });
    });
  });
});

module.exports = router;
