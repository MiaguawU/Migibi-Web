const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./connection");
const util = require("util");
const Joi = require("joi");

const router = express.Router();
const BASE_IMAGE_URL = process.env.SERVER_PORT; // URL base del servidor

// Validación de datos con Joi
const alimentoSchema = Joi.object({
  nombre: Joi.string().required(),
  tipo: Joi.number().required().messages({ "number.base": "El tipo debe ser un número." }),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().allow(null, '').optional(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});


// Asincronizar consultas de la base de datos
const queryAsync = util.promisify(db.query).bind(db);

// Configuración para almacenamiento de imágenes
const uploadDir = path.join(__dirname, "../imagenes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

function formatFechaCaducidad(fecha) {
  if (!fecha) return null;
  try {
    const date = new Date(fecha);
    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return null; // Devuelve null si la fecha no es válida
  }
}

router.get("/:id", async (req, res) => {
    const id = req.params.id;
  
    const query = `
      SELECT 
        ca.Alimento AS Nombre,
        sd.Cantidad AS Cantidad,
        sd.Id_Unidad_Medida AS id_unidad,
        ca.Id_Tipo_Alimento AS id_tipo,
        sd.Fecha_Caducidad AS Fecha
      FROM 
        stock_detalle sd
      JOIN 
        cat_alimento ca
      ON 
        sd.Id_Alimento = ca.Id_Alimento
      WHERE 
        sd.Id_Stock_Detalle = ?;
    `;
  
    try {
      const result = await queryAsync(query, [id]);
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ error: "No se encontró el alimento" });
      }
    } catch (error) {
      console.error("Error al obtener alimento:", error);
      res.status(500).json({ error: "Error al obtener alimento" });
    }
  });

  module.exports = router;