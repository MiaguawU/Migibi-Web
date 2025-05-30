const express = require("express");
const db = require("./connection");
const Joi = require("joi");
const router = express.Router();

const schema = Joi.object({
  nombre: Joi.string().min(3).max(50).required(),
  Id_Usuario: Joi.number().integer().positive().required(),
});

const verificarPermisos = (req, res, next) => {
  const { Id_Usuario } = req.body || req.params;

  if (!Id_Usuario) {
    return res.status(400).send("ID de usuario requerido para la validación");
  }

  const evaluar = `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`;
  db.query(evaluar, [Id_Usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos:", err);
      return res.status(500).send("Error al validar permisos");
    }
    if (result.length === 0 || result[0].Id_Rol == 1) {
      return res.status(403).send("Acceso prohibido: No tienes permiso para realizar esta acción");
    }
    next();
  });
};

router.post("/", verificarPermisos, (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nombre, Id_Usuario } = req.body;
  const fecha_alta = new Date();
  const query = `INSERT INTO cat_tipo_alimento (Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?)`;
  const values = [nombre, Id_Usuario, fecha_alta];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar tipo de alimento:", err);
      return res.status(500).send("Error al agregar tipo de alimento");
    }
    res.json({ id: result.insertId, message: "Tipo de alimento agregado con éxito" });
  });
});

router.put("/:id", verificarPermisos, (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { nombre, Id_Usuario } = req.body;
  const fecha_modif = new Date();
  const query = `UPDATE cat_tipo_alimento SET Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Alimento = ?`;
  const values = [nombre, Id_Usuario, fecha_modif, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar tipo de alimento:", err);
      return res.status(500).send("Error al actualizar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento actualizado con éxito" });
  });
});

router.get("/", (req, res) => {
  const query = `SELECT * FROM cat_tipo_alimento`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

router.delete("/:id", verificarPermisos, (req, res) => {
  const idSchema = Joi.object({
    Id_Usuario: Joi.number().integer().positive().required(),
  });
  const { error } = idSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { Id_Usuario } = req.body;
  const fecha_baja = new Date();
  const query = `UPDATE cat_tipo_alimento SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Tipo_Alimento = ?`;
  const values = [Id_Usuario, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar tipo de alimento:", err);
      return res.status(500).send("Error al eliminar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento eliminado con éxito" });
  });
});

router.put("/activar/:id", verificarPermisos, (req, res) => {
  const idSchema = Joi.object({
    Id_Usuario: Joi.number().integer().positive().required(),
  });
  const { error } = idSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { Id_Usuario } = req.body;
  const fecha_baja = new Date();
  const query = `UPDATE cat_tipo_alimento SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Alimento = ?`;
  const values = [Id_Usuario, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al activar tipo de alimento:", err);
      return res.status(500).send("Error al activar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento activado con éxito" });
  });
});

module.exports = router;
