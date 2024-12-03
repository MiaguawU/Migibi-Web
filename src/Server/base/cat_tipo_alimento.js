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

// Crear un nuevo tipo de alimento (POST)
router.post("/", (req, res, next) => {
  const { tipo_alimento, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!tipo_alimento || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar un nuevo tipo de alimento
  const query1 = `
    INSERT INTO cat_tipo_alimento (Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?)
  `;
  const values1 = [tipo_alimento, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al insertar tipo de alimento:", err1);
      return res.status(500).send("Error al agregar tipo de alimento");
    }

    // Responder con el ID del nuevo tipo de alimento
    res.json({ id: result1.insertId, message: "Tipo de alimento agregado con éxito" });
  });
});

// Obtener tipos de alimento (GET)
router.get("/", (req, res) => {

  // Construir la consulta SQL
  let query = `SELECT * FROM cat_tipo_alimento`;


  // Ejecutar la consulta
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

// Actualizar un tipo de alimento (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { tipo_alimento, id_usuario_modif, fecha_modif, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!tipo_alimento || !id_usuario_modif || !fecha_modif || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar el tipo de alimento
  const query1 = `
    UPDATE cat_tipo_alimento 
    SET Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Tipo_Alimento = ?
  `;
  const values1 = [tipo_alimento, id_usuario_modif, fecha_modif, activo, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al actualizar tipo de alimento:", err1);
      return res.status(500).send("Error al actualizar tipo de alimento");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Tipo de alimento actualizado con éxito" });
  });
});

// Eliminar un tipo de alimento (marcarlo como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar el tipo de alimento como inactivo (baja lógica)
  const query1 = `
    UPDATE cat_tipo_alimento 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Tipo_Alimento = ?
  `;
  const values1 = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al eliminar tipo de alimento:", err1);
      return res.status(500).send("Error al eliminar tipo de alimento");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Tipo de alimento eliminado con éxito" });
  });
});

module.exports = router;
