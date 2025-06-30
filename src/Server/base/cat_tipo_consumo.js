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
  db.query('SELECT * FROM cat_tipo_consumo WHERE Activo=1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

router.get('/cat', (req, res) => {
  console.log("Enviando datos");
  db.query('SELECT * FROM cat_tipo_consumo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  db.query('SELECT Tipo_Consumo FROM cat_tipo_consumo WHERE Id_Tipo_Consumo = ?', [id],(err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Esquema de validación Joi para POST y PUT
const schema = Joi.object({
  nombre: Joi.string().required(),
  id_usuario: Joi.number().required()
});

// Crear un nuevo registro
router.post('/', (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { nombre, id_usuario } = req.body;
  const fecha_alta = new Date();

  verificarPermisos(id_usuario, res, () => {
    const query = 'INSERT INTO cat_tipo_consumo (Tipo_Consumo, Activo, Id_Usuario_Alta, Fecha_Alta) VALUES (?, 1, ?, ?)';
    db.query(query, [nombre, id_usuario, fecha_alta], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Registro creado', id: result.insertId });
    });
  });
});

// Actualizar un registro
router.put('/:id', (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { nombre, id_usuario } = req.body;
  const fecha_modif = new Date();

  verificarPermisos(id_usuario, res, () => {
    const query = 'UPDATE cat_tipo_consumo SET Tipo_Consumo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [nombre, id_usuario, fecha_modif, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro actualizado' });
    });
  });
});

// Esquema de validación Joi para DELETE
const deleteSchema = Joi.object({
  id_usuario_baja: Joi.number().required()
});

// Eliminar (desactivar) un registro
router.delete('/:id', (req, res) => {
  const { error } = deleteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja } = req.body;
  const fecha_baja = new Date();

  verificarPermisos(id_usuario_baja, res, () => {
    const query = 'UPDATE cat_tipo_consumo SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Tipo_Consumo = ?';
    db.query(query, [id_usuario_baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Registro eliminado (desactivado)' });
    });
  });
});

const activateTipoConsumoSchema = Joi.object({
  id_usuario: Joi.number().integer().positive().required(), // Renamed to id_usuario for consistency with general modify actions
});

// Update the PUT /activar/:id route
router.put('/activar/:id', (req, res) => {
  // Use the new schema
  const { error } = activateTipoConsumoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  // Use id_usuario for consistency with update operations
  const { id_usuario } = req.body; // Expecting id_usuario from frontend now

  // Use fecha_modif as this is a modification/activation
  const fecha_modif = new Date();

  // Assuming verificarPermisos takes userId, res, and callback
  // Pass id_usuario to verificarPermisos
  verificarPermisos(id_usuario, res, () => {
    const query = 'UPDATE cat_tipo_consumo SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Consumo = ?';
    // Pass id_usuario for Id_Usuario_Modif, and fecha_modif for Fecha_Modif
    db.query(query, [id_usuario, fecha_modif, id], (err, result) => { // Added result to check affectedRows
      if (err) {
        console.error("Error al activar tipo de consumo:", err); // Specific error log
        return res.status(500).json({ error: err.message || "Error al activar tipo de consumo" });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Tipo de consumo no encontrado o ya estaba activo." });
      }
      res.json({ message: 'Tipo de consumo activado correctamente.' }); // Specific success message
    });
  });
});

module.exports = router;