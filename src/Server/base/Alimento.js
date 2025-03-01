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


// Agregar un alimento
router.post("/", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { nombre, tipo, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;
    console.log(req.body);

    // Validación de datos
    const { error } = alimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const es_perecedero = fecha_caducidad ? 1 : 0;
    const Fecha_Caducidad = fecha_caducidad ? formatFechaCaducidad(fecha_caducidad) : null;
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;

    try {
      // Verificar si el alimento ya existe
      const existencia = await queryAsync(
        `SELECT Id_Alimento, Es_Perecedero FROM cat_alimento 
        WHERE Id_Usuario_Alta = ? AND Alimento LIKE ? AND Activo = 1`,
        [Id_Usuario_Alta, `%${nombre}%`]
      );

      if (existencia.length > 0) {
        // Si el alimento ya existe, se obtiene su ID
        const Id_Alimento = existencia[0].Id_Alimento;
        const esPerecederoExistente = existencia[0].Es_Perecedero;

        // Crear un nuevo registro en stock_detalle
        await queryAsync(
          `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Es_Perecedero,Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [
            id_unidad,
            cantidad,
            cantidad,
            esPerecederoExistente ? Fecha_Caducidad : null, // Si no es perecedero, Fecha_Caducidad será NULL
            Id_Alimento,
            esPerecederoExistente,
            imagen,
            Id_Usuario_Alta,
            Fecha_Alta,
          ]
        );

        return res.status(200).json({ message: "Nuevo stock agregado para alimento existente" });
      }

      // Insertar nuevo alimento si no existe
      const result1 = await queryAsync(
        `INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?)`,
        [nombre, tipo, es_perecedero, Id_Usuario_Alta, Fecha_Alta]
      );

      const Id_Alimento = result1.insertId;

      // Insertar en stock_detalle
      await queryAsync(
        `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Es_Perecedero, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [id_unidad, cantidad, cantidad, Fecha_Caducidad, Id_Alimento, es_perecedero,imagen, Id_Usuario_Alta, Fecha_Alta]
      );

      //al crearse un nuevo alimento en el catalogo se marca como que el usuario puede comerlo
      await queryAsync(
        `INSERT INTO usuario_cat_alimento ( Id_Alimento, Id_Usuario, Puede_Comer) 
        VALUES (?, ?, ?)`,
        [ Id_Alimento,  Id_Usuario_Alta, 1 ]
      );

      res.status(201).json({
        message: "Alimento agregado exitosamente",
        alimento: { id: Id_Alimento, nombre, tipo, es_perecedero, imagen },
      });
    } catch (error) {
      console.error("Error al agregar el alimento:", error);
      res.status(500).json({ error: "Error al agregar el alimento" });
    }
  });
});

router.get("/", (req, res) => {
  

  const query1 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Activo AS Activo,
      sd.Cantidad AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      sd.Fecha_Caducidad,
      ca.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    ORDER BY sd.Fecha_Caducidad ASC;
  `;

  const query2 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Activo AS Activo,
      sd.Cantidad AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      ca.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    ORDER BY sd.Fecha_Caducidad ASC;
  `;

  db.query(query1,  (err, result1) => {
    if (err) {
      console.error("Error en query1:", err);
      return res.status(500).json({ error: "Error al obtener alimentos perecederos" });
    }

    db.query(query2, (err2, result2) => { // ✅ Pasar id como parámetro en query2
      if (err2) {
        console.error("Error en query2:", err2);
        return res.status(500).json({ error: "Error al obtener alimentos no perecederos" });
      }

      res.json({ Perecedero: result1, NoPerecedero: result2 });
    });
  });
});

//obtener alimentos del refri
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10); // Convertir id a número

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const query1 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Activo AS Activo,
      sd.Cantidad AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      sd.Fecha_Caducidad,
      ca.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    WHERE sd.Es_Perecedero = 1 AND sd.Id_Usuario_Alta = ?
    ORDER BY sd.Fecha_Caducidad ASC;
  `;

  const query2 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Activo AS Activo,
      sd.Cantidad AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      ca.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    WHERE sd.Es_Perecedero = 0 AND sd.Id_Usuario_Alta = ?
    ORDER BY sd.Fecha_Caducidad ASC;
  `;

  db.query(query1, [id], (err, result1) => {
    if (err) {
      console.error("Error en query1:", err);
      return res.status(500).json({ error: "Error al obtener alimentos perecederos" });
    }

    db.query(query2, [id], (err2, result2) => { // ✅ Pasar id como parámetro en query2
      if (err2) {
        console.error("Error en query2:", err2);
        return res.status(500).json({ error: "Error al obtener alimentos no perecederos" });
      }

      res.json({ Perecedero: result1, NoPerecedero: result2 });
    });
  });
});




// Obtener un alimento por ID


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
      const queryImagen = `SELECT Imagen_alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?`;
      const [result] = await queryAsync(queryImagen, [id]);
      if (!result) {
        console.log("imagen alimento no encontrado");
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
    }

    // Actualizar los datos del alimento
    const query1 = `
    UPDATE cat_alimento 
    SET Alimento = ?, Id_Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1 
    WHERE Id_Alimento = ?;`;

    const query = `SELECT Id_Alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?;`;

    // Obtener id_Alimento a partir de la consulta
    const [resultId] = await queryAsync(query, [id]); // Asegúrate de que el id esté siendo pasado correctamente

    if (!resultId) {
      return res.status(404).json({ error: "Stock no encontrado" });
    }

    const idAlimento = Number(resultId.Id_Alimento);  // Convertir correctamente a número

    const values1 = [nombre, tipo, Id_Usuario_Alta, Fecha_Alta, idAlimento];

    await queryAsync(query1, values1);

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, Fecha_Caducidad, imagen, Id_Usuario_Alta, Fecha_Alta, id];

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
