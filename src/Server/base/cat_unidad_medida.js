const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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

router.post("/", (req, res) => {
  const { unidad_medida, abreviatura, id_usuario_alta } = req.body;
  if (!unidad_medida || !abreviatura || !id_usuario_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }
  verificarPermisos(id_usuario_alta, res, () => {
    const fecha_alta = new Date();
    const query = `INSERT INTO cat_unidad_medida (Unidad_Medida, Abreviatura, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?, ?)`;
    db.query(query, [unidad_medida, abreviatura, id_usuario_alta, fecha_alta], (err, result) => {
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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { unidad_medida, abreviatura, id_usuario_modif } = req.body;
  if (!unidad_medida || !abreviatura || !id_usuario_modif) {
    return res.status(400).send("Faltan datos requeridos");
  }
  verificarPermisos(id_usuario_modif, res, () => {
    const fecha_modif = new Date();
    const query = `UPDATE cat_unidad_medida SET Unidad_Medida = ?, Abreviatura = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Unidad_Medida = ?`;
    db.query(query, [unidad_medida, abreviatura, id_usuario_modif, fecha_modif, id], (err) => {
      if (err) return res.status(500).send("Error al actualizar unidad de medida");
      res.json({ message: "Unidad de medida actualizada con éxito" });
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja } = req.body;
  if (!id_usuario_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }
  verificarPermisos(id_usuario_baja, res, () => {
    const fecha_baja = new Date();
    const query = `UPDATE cat_unidad_medida SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Unidad_Medida = ?`;
    db.query(query, [id_usuario_baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).send("Error al eliminar unidad de medida");
      res.json({ message: "Unidad de medida eliminada con éxito" });
    });
  });
});

module.exports = router;