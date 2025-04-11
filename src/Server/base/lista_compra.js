const express = require('express');
const Joi = require('joi');
const db = require('./connection');
const router = express.Router();

// Esquemas de validación con Joi
const listaCompraSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  cantidad: Joi.number().required(),
  id_alimento: Joi.number().integer().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.date().iso().required()
});

const listaCompraUpdateSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  cantidad: Joi.number().required(),
  id_alimento: Joi.number().integer().required(),
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.date().iso().required(),
  activo: Joi.number().valid(0, 1).required()
});

const listaCompraDeleteSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().iso().required()
});

// Crear una nueva lista de compra (POST)
router.post("/", (req, res) => {
  const { error } = listaCompraSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_alta, fecha_alta } = req.body;
  const query = `
    INSERT INTO lista_compra (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_alta, fecha_alta], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al agregar lista de compra" });
    res.json({ id: result.insertId, message: "Lista de compra agregada con éxito" });
  });
});

// Obtener lista de compra (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;
  let query = `SELECT * FROM lista_compra WHERE 1`;
  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Error al obtener lista de compra" });
    res.json(result);
  });
});

// Actualizar una lista de compra (PUT)
router.put("/:id", (req, res) => {
  const { error } = listaCompraUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_modif, fecha_modif, activo } = req.body;
  const query = `
    UPDATE lista_compra 
    SET Id_Receta = ?, Id_Unidad_Medida = ?, Cantidad = ?, Id_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Lista_Compra = ?
  `;
  
  db.query(query, [id_receta, id_unidad_medida, cantidad, id_alimento, id_usuario_modif, fecha_modif, activo, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al actualizar lista de compra" });
    res.json({ message: "Lista de compra actualizada con éxito" });
  });
});

// Eliminar una lista de compra (DELETE - baja lógica)
router.delete("/:id", (req, res) => {
  const { error } = listaCompraDeleteSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;
  const query = `
    UPDATE lista_compra 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Lista_Compra = ?
  `;
  
  db.query(query, [id_usuario_baja, fecha_baja, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al eliminar lista de compra" });
    res.json({ message: "Lista de compra eliminada con éxito" });
  });
});

module.exports = router;