const express = require("express");
const Joi = require("joi");
const db = require("./connection");
const router = express.Router();

// Esquema de validación con Joi
const createRecipeSchema = Joi.object({
  idUsuario: Joi.number().integer().required(),
});

const deleteRecipeSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
  fecha_baja: Joi.date().iso().required(),
});

// Crear una nueva receta (POST)
router.post("/:id", (req, res) => {
  const idUsuario = parseInt(req.params.id, 10);
  const { error } = createRecipeSchema.validate({ idUsuario });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const query = `INSERT INTO receta (Nombre, Id_Usuario_Alta, Fecha_Alta, Id_Tipo_Consumo, Tiempo, Calorias, Activo) VALUES ('Receta_nueva', ?, ?, 1, '00:30:00', 20, 0);`;
  const hoy = new Date();
  const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
  const values = [idUsuario, Fecha_Alta];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al agregar receta");
    res.json({ id: result.insertId, message: "Receta agregada con éxito" });
  });
});

// Obtener recetas (GET)
router.get("/", (req, res) => {
  const query = `SELECT Id_Receta, Nombre, Tiempo, Calorias, Imagen_receta, Id_Usuario_Alta, Activo FROM receta`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Error al obtener recetas");
    res.json(result);
  });
});

// Obtener nombres de recetas (GET)
router.get("/nombres", (req, res) => {
  const query = `SELECT Id_Receta, Nombre, Activo FROM receta WHERE Activo = 1`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Error al obtener nombres de recetas");
    res.json(result);
  });
});

// Marcar una receta como inactiva (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const query = `UPDATE receta SET Activo = 0 WHERE Id_Receta = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("Error al eliminar receta");
    res.json({ message: "Receta eliminada con éxito" });
  });
});

// Eliminar una receta (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { error } = deleteRecipeSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id_usuario_baja, fecha_baja } = req.body;
  const query = `UPDATE receta SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Receta = ?`;
  const values = [id_usuario_baja, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).send("Error al eliminar receta");
    res.json({ message: "Receta eliminada con éxito" });
  });
});

module.exports = router;
