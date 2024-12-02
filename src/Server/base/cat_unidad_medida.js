const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Ruta para crear el directorio de imágenes si no existe
const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para manejar la subida de imágenes
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
    fileSize: 5 * 1024 * 1024,  // Limite de tamaño de archivo 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

// Crear una nueva unidad de medida (POST)
router.post("/", (req, res, next) => {
  const { unidad_medida, abreviatura, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!unidad_medida || !abreviatura || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar una nueva unidad de medida
  const query1 = `
    INSERT INTO cat_unidad_medida (Unidad_Medida, Abreviatura, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?)
  `;
  const values1 = [unidad_medida, abreviatura, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al insertar unidad de medida:", err1);
      return res.status(500).send("Error al agregar unidad de medida");
    }

    // Responder con el ID de la nueva unidad de medida
    res.json({ id: result1.insertId, message: "Unidad de medida agregada con éxito" });
  });
});

// Obtener unidades de medida (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;

  // Construir la consulta SQL
  let query = `SELECT * FROM cat_unidad_medida`;


  // Ejecutar la consulta
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener unidades de medida:", err);
      return res.status(500).send("Error al obtener unidades de medida");
    }

    // Devolver las unidades de medida encontradas
    res.json(result);
  });
});

// Actualizar una unidad de medida (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { unidad_medida, abreviatura, id_usuario_modif, fecha_modif, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!unidad_medida || !abreviatura || !id_usuario_modif || !fecha_modif || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar la unidad de medida
  const query1 = `
    UPDATE cat_unidad_medida 
    SET Unidad_Medida = ?, Abreviatura = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Unidad_Medida = ?
  `;
  const values1 = [unidad_medida, abreviatura, id_usuario_modif, fecha_modif, activo, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al actualizar unidad de medida:", err1);
      return res.status(500).send("Error al actualizar unidad de medida");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Unidad de medida actualizada con éxito" });
  });
});

// Eliminar una unidad de medida (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar la unidad de medida como inactiva (baja lógica)
  const query1 = `
    UPDATE cat_unidad_medida 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Unidad_Medida = ?
  `;
  const values1 = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al eliminar unidad de medida:", err1);
      return res.status(500).send("Error al eliminar unidad de medida");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Unidad de medida eliminada con éxito" });
  });
});

module.exports = router;
