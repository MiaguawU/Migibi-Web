const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./connection");
const util = require("util");
const Joi = require("joi");

const router = express.Router();
const BASE_IMAGE_URL = process.env.BASE_IMAGE_URL; // URL base del servidor

// Validación de datos con Joi
const recetaSchema = Joi.object({
  nombre: Joi.string().required(),
  tiempo: Joi.string().required(),
  porciones: Joi.number().integer().min(1).required(),
  calorias: Joi.number().integer().min(0).required(),
  id_tipo_consumo: Joi.number().integer().required(),
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
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño de archivo 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

// Endpoint: Crear una receta
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { nombre, id_tipo_consumo, tiempo, calorias } = req.body;

    const { error } = recetaSchema.validate({ nombre, id_tipo_consumo, tiempo, calorias });
    if (error) return res.status(400).send(error.details[0].message);

    const imagen = req.file ? `../imagenes/${req.file.filename}` : `/imagenes/defRec.png`;

    const query = `
      INSERT INTO receta (Nombre, Id_Tipo_Consumo, Tiempo, Calorias, Imagen_receta) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [nombre, id_tipo_consumo, tiempo, calorias, imagen];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al agregar receta:", err);
        return res.status(500).send("Error al agregar receta");
      }
      res.json({ id: result.insertId, message: "Receta agregada con éxito" });
    });
  });
});

// Endpoint: Actualizar una receta
// Endpoint: Actualizar una receta
router.put("/:id", (req, res) => {
  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).json({ error: "Error al procesar la imagen" });
    }

    const { id } = req.params;
    const { nombre, id_tipo_consumo, tiempo, porciones, calorias } = req.body;

    // Validar datos enviados por el cliente
    const { error } = recetaSchema.validate({
      nombre,
      id_tipo_consumo,
      tiempo,
      calorias,
      porciones,
    });

    if (error) {
      console.error("Error en la validación:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      // Verificar si la receta existe y obtener su imagen actual
      const selectQuery = `SELECT Imagen_receta FROM receta WHERE Id_Receta = ?`;
      const [receta] = await new Promise((resolve, reject) =>
        db.query(selectQuery, [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        })
      );

      if (!receta) {
        return res.status(404).json({ error: "Receta no encontrada" });
      }

      // Determinar la imagen a usar
      const nuevaImagen = req.file ? `/imagenes/${req.file.filename}` : receta.Imagen_receta;

      // Actualizar la receta
      const updateQuery = `
        UPDATE receta 
        SET 
          Nombre = ?, 
          Id_Tipo_Consumo = ?, 
          Tiempo = ?, 
          Porciones = ?, 
          Calorias = ?, 
          Imagen_receta = ?, 
          Activo = 1
        WHERE Id_Receta = ?
      `;

      const values = [nombre, id_tipo_consumo, tiempo, porciones, calorias, nuevaImagen, id];

      console.log("Valores para la actualización:", values);

      db.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error("Error al actualizar receta:", err);
          return res.status(500).json({ error: "Error al actualizar receta" });
        }
        res.json({ message: "Receta actualizada con éxito" });
      });
    } catch (err) {
      console.error("Error al manejar la solicitud de actualización:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
});




// Endpoint: Eliminar una receta
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deleteDetailsQuery = `DELETE FROM receta_detalle WHERE Id_Receta = ?`;
  db.query(deleteDetailsQuery, [id], (err) => {
    if (err) {
      console.error("Error al eliminar detalles de receta:", err);
      return res.status(500).send("Error al eliminar detalles de receta");
    }

    const deleteRecipeQuery = `DELETE FROM receta WHERE Id_Receta = ?`;
    db.query(deleteRecipeQuery, [id], (err) => {
      if (err) {
        console.error("Error al eliminar receta:", err);
        return res.status(500).send("Error al eliminar receta");
      }
      res.json({ message: "Receta y detalles eliminados con éxito" });
    });
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  //nombre receta
  //imagen
  //tiempo
  //tipo
  //porciones
  //calorias
 
  const query1 = `
        SELECT
            r.Nombre AS Nombre,
            r.Calorias AS Calorias,
            r.Id_Tipo_Consumo AS id_Tipo,
            r.Imagen_receta AS Imagen,
            r.Tiempo AS Tiempo,
            r.Porciones 
        FROM
            receta r
        WHERE
            r.Id_Receta = ?;`;


      console.log("id recibido");
 
  db.query(query1, [id], (err1, result1) => {
    if (err1) {
      console.error("Error al obtener receta:", err1);
      return res.status(500).send("Error al obtener receta");
    }

    if (result1.length === 0) {
      return res.status(404).send("Receta no encontrada");
    }
    console.log("receta enviada", result1);
    res.json(result1)
  });
});



module.exports = router;
