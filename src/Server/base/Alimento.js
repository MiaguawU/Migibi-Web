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
  tipo: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().optional(),
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


// Agregar un alimento
router.post("/", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { nombre, tipo, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;

    // Validación de datos
    const { error } = alimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const es_perecedero = fecha_caducidad ? 1 : 0;

    let Fecha_Caducidad = null;
    if (fecha_caducidad) {
      try {
        const date = new Date(fecha_caducidad);
        Fecha_Caducidad = date.toISOString().slice(0, 19).replace("T", " ");
      } catch (parseError) {
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }
    }

    // Asegurar que el prefijo `/imagenes/` esté incluido
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;

    // Inserción en `cat_alimento`
    const query1 = `
      INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values1 = [nombre, tipo, es_perecedero, imagen, Id_Usuario_Alta, Fecha_Alta];

    db.query(query1, values1, (err, result1) => {
      if (err) {
        console.error("Error al insertar en cat_alimento:", err);
        return res.status(500).json({ error: "Error al agregar el alimento." });
      }

      const Id_Alimento = result1.insertId; // Obtener el ID generado por la inserción

      // Inserción en `stock_detalle`
      const query2 = `
        INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Fecha_Caducidad, Id_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values2 = [id_unidad, cantidad, Fecha_Caducidad, Id_Alimento, es_perecedero, Id_Usuario_Alta, Fecha_Alta];

      db.query(query2, values2, (err2, result2) => {
        if (err2) {
          console.error("Error al insertar en stock_detalle:", err2);
          return res.status(500).json({ error: "Error al agregar el detalle del stock." });
        }

        res.status(201).json({
          message: "Alimento y detalle del stock agregados exitosamente.",
          alimento: { id: Id_Alimento, nombre, tipo, es_perecedero, imagen },
          stock: { id: result2.insertId, id_unidad, cantidad, fecha_caducidad: Fecha_Caducidad },
        });
      });
    });
  });
});


//obtener alimentos del refri
router.get("/", (req, res) => {
  const query1 = `
  SELECT 
  ca.Id_Alimento AS id,
  ca.Alimento AS Nombre,
  ca.Activo As Activo,
  sd.Cantidad AS Cantidad,
  cum.Abreviatura AS Unidad,
  ca.Imagen_alimento AS Imagen,
  sd.Fecha_Caducidad,
  ca.Id_Usuario_Alta,
  cta.Tipo_Alimento AS Tipo_Alimento -- Agregado el tipo de alimento
FROM stock_detalle sd
LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento -- Agregado JOIN para obtener el tipo de alimento
WHERE ca.Es_Perecedero = 1
ORDER BY sd.Fecha_Caducidad ASC;`;

  const query2 = `
    SELECT 
    ca.Id_Alimento AS id,
  ca.Alimento AS Nombre,
  ca.Activo As Activo,
  sd.Cantidad AS Cantidad,
  cum.Abreviatura AS Unidad,
  ca.Imagen_alimento AS Imagen,
  ca.Id_Usuario_Alta,
  cta.Tipo_Alimento AS Tipo_Alimento -- Agregado el tipo de alimento
FROM stock_detalle sd
LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento -- Agregado JOIN para obtener el tipo de alimento
WHERE ca.Es_Perecedero = 0
ORDER BY sd.Fecha_Caducidad ASC;`;

  db.query(query1, (err, result1) => {
    if (err) {
      console.error("Error en query1:", err);
      return res.status(500).json({ error: "Error al obtener alimentos perecederos" });
    }

    db.query(query2, (err2, result2) => {
      if (err2) {
        console.error("Error en query2:", err2);
        return res.status(500).json({ error: "Error al obtener alimentos no perecederos" });
      }

      res.json({ Perecedero: result1, NoPerecedero: result2 });
    });
  });
});



// Obtener un alimento por ID
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
      ca.Id_Alimento = ?;
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

// Actualizar un alimento
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, tipo, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;

    // Validación de datos del alimento
    const { error } = alimentoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const es_perecedero = fecha_caducidad ? 1 : 0;

    // Manejo de la fecha de caducidad
    let Fecha_Caducidad = null;
    if (fecha_caducidad) {
      try {
        const date = new Date(fecha_caducidad);
        Fecha_Caducidad = date.toISOString().slice(0, 19).replace("T", " ");
      } catch (parseError) {
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }
    }

    // Obtener la imagen existente si no se proporciona una nueva
    let imagen;
    if (req.file) {
      // Si hay un archivo subido, se usa esa imagen
      imagen = `/imagenes/${req.file.filename}`;
    } else {
      // Si no, obtenemos la imagen actual desde la base de datos
      const queryImagen = `SELECT Imagen_alimento FROM cat_alimento WHERE Id_Alimento = ?`;
      const [result] = await queryAsync(queryImagen, [id]);
      if (!result) {
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
    }

    // Actualizar los datos del alimento
    const query1 = `
      UPDATE cat_alimento 
      SET Alimento = ?, Id_Tipo_Alimento = ?, Es_Perecedero = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Alimento = ?
    `;
    const values1 = [nombre, tipo, es_perecedero, imagen, Id_Usuario_Alta, Fecha_Alta, id];

    await queryAsync(query1, values1);

    // Actualizar los detalles del stock
    const query2 = `
      UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Es_Perecedero = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Alimento = ?
    `;
    const values2 = [id_unidad, cantidad, Fecha_Caducidad, es_perecedero, Id_Usuario_Alta, Fecha_Alta, id];

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({
      message: "Alimento y detalle del stock actualizados exitosamente.",
      alimento: { id, nombre, tipo, es_perecedero, imagen },
      stock: { id_unidad, cantidad, fecha_caducidad: Fecha_Caducidad },
    });
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});





module.exports = router;
