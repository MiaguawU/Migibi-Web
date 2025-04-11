const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const Joi = require('joi');
const router = express.Router();

// Ruta para crear el directorio de imágenes si no existe
const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Esquema de validación con Joi
const compraSchema = Joi.object({
  id_usuario_compra: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  fecha_compra: Joi.date().required(),
  cantidad: Joi.number().required(),
  id_usuario_alta: Joi.number().integer().required(),
  fecha_alta: Joi.date().required(),
});

const actualizarCompraSchema = Joi.object({
  id_usuario_compra: Joi.number().integer().required(),
  id_unidad_medida: Joi.number().integer().required(),
  fecha_compra: Joi.date().required(),
  cantidad: Joi.number().required(),
  id_usuario_modif: Joi.number().integer().required(),
  fecha_modif: Joi.date().required(),
  activo: Joi.number().integer().valid(0, 1).required(),
});

const eliminarCompraSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().required(),
});

// Crear una nueva compra (POST)
router.post("/", (req, res) => {
  const { error } = compraSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_alta, fecha_alta } = req.body;
  const query1 = `
    INSERT INTO compras (Id_Usuario_Compra, Id_Unidad_Medida, Fecha_Compra, Cantidad, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values1 = [id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_alta, fecha_alta];

  db.query(query1, values1, (err1, result1) => {
    if (err1) return res.status(500).send("Error al agregar compra");
    res.json({ id: result1.insertId, message: "Compra agregada con éxito" });
  });
});

// Obtener compras (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;
  let query = `SELECT * FROM compras WHERE 1`;
  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send("Error al obtener compras");
    res.json(result);
  });
});

// Actualizar una compra (PUT)
router.put("/:id", (req, res) => {
  const { error } = actualizarCompraSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_modif, fecha_modif, activo } = req.body;
  const query1 = `
    UPDATE compras 
    SET Id_Usuario_Compra = ?, Id_Unidad_Medida = ?, Fecha_Compra = ?, Cantidad = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Compras = ?
  `;
  const values1 = [id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_modif, fecha_modif, activo, id];

  db.query(query1, values1, (err1) => {
    if (err1) return res.status(500).send("Error al actualizar compra");
    res.json({ message: "Compra actualizada con éxito" });
  });
});

// Eliminar una compra (DELETE)
router.delete("/:id", (req, res) => {
  const { error } = eliminarCompraSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;
  const query1 = `
    UPDATE compras 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Compras = ?
  `;
  const values1 = [id_usuario_baja, fecha_baja, id];

  db.query(query1, values1, (err1) => {
    if (err1) return res.status(500).send("Error al eliminar compra");
    res.json({ message: "Compra eliminada con éxito" });
  });
});

module.exports = router;
