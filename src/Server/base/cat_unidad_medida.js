const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const db = require('./connection');
const router = express.Router();

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

const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    console.log("Archivo recibido:", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

// Esquema de validación con Joi
const unidadMedidaSchema = Joi.object({
  nombre: Joi.string().min(1).max(50).required(),
  abreviatura: Joi.string().min(1).max(10).required(),
  id_usuario: Joi.number().integer().required()
});

const unidadMedidaUpdateSchema = Joi.object({
  nombre: Joi.string().min(1).max(50).required(),
  abreviatura: Joi.string().min(1).max(10).required(),
  id_usuario_modif: Joi.number().integer().required()
});

const unidadMedidaDeleteSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required()
});

router.post("/", (req, res) => {
  const { error } = unidadMedidaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { nombre, abreviatura, id_usuario } = req.body;
  verificarPermisos(id_usuario, res, () => {
    const fecha_alta = new Date();
    const query = `INSERT INTO cat_unidad_medida (Unidad_Medida, Abreviatura, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?, ?)`;
    db.query(query, [nombre, abreviatura, id_usuario, fecha_alta], (err, result) => {
      if (err) return res.status(500).send("Error al agregar unidad de medida");
      res.json({ id: result.insertId, message: "Unidad de medida agregada con éxito" });
    });
  });
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM cat_unidad_medida", (err, result) => {
    if (err) return res.status(500).send("Error al obtener unidades de medida");
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT Unidad_Medida, Abreviatura FROM cat_unidad_medida WHERE Id_Unidad_Medida = ?", [id],(err, result) => {
    if (err) return res.status(500).send("Error al obtener unidades de medida");
    console.log(result)
    res.json(result);
  });
});

router.put("/:id", (req, res) => {
  const { error } = unidadMedidaUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { nombre, abreviatura, id_usuario_modif } = req.body;
  verificarPermisos(id_usuario_modif, res, () => {
    const fecha_modif = new Date();
    const query = `UPDATE cat_unidad_medida SET Unidad_Medida = ?, Abreviatura = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Unidad_Medida = ?`;
    db.query(query, [nombre, abreviatura, id_usuario_modif, fecha_modif, id], (err) => {
      if (err) return res.status(500).send("Error al actualizar unidad de medida");
      res.json({ message: "Unidad de medida actualizada con éxito" });
    });
  });
});

router.delete("/:id", (req, res) => {
  const { error } = unidadMedidaDeleteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja } = req.body;
  verificarPermisos(id_usuario_baja, res, () => {
    const fecha_baja = new Date();
    const query = `UPDATE cat_unidad_medida SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Unidad_Medida = ?`;
    db.query(query, [id_usuario_baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).send("Error al eliminar unidad de medida");
      res.json({ message: "Unidad de medida eliminada con éxito" });
    });
  });
});

router.put("/activar/:id", (req, res) => {
  const { error } = unidadMedidaDeleteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja } = req.body;
  verificarPermisos(id_usuario_baja, res, () => {
    const fecha_baja = new Date();
    const query = `UPDATE cat_unidad_medida SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Unidad_Medida = ?`;
    db.query(query, [id_usuario_baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).send("Error al activar unidad de medida");
      res.json({ message: "Unidad de medida activada con éxito" });
    });
  });
});
module.exports = router;
