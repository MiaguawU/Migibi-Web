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
  tipo: Joi.number().allow(null, 0).optional(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().allow(null, '').optional(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});

const alimentoEsPerecederoSchema = Joi.object({
  id_alimento: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().allow(null, '').optional(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});

const alimentoNoPerecederoSchema = Joi.object({
  id_alimento: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  Id_Usuario_Alta: Joi.number().required(),
});

const nuevoAlimentoEsPerecederoSchema = Joi.object({
  nombre: Joi.string().required(),
  tipo: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().required(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});

const nuevoAlimentoNoPerecederoSchema = Joi.object({
  nombre: Joi.string().required(),
  tipo: Joi.number().allow(null, 0).optional(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  Id_Usuario_Alta: Joi.number().required(),
});

const alimentoConsumirSchema = Joi.object({
  id_stock: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
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
  destination: path.join(__dirname, '../imagenes'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const verificarWikimedia = async (filename) => {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=File:${encodeURIComponent(filename)}`;
  try {
    const response = await axios.get(endpoint);
    return response.data.query.pages["-1"] ? false : true;
  } catch (error) {
    console.error("Error al verificar la imagen en Wikimedia:", error);
    return false;
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: async (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Solo se permiten imágenes PNG, JPG o JPEG'));
    }
    
    const tieneCopyright = await verificarWikimedia(file.originalname);
    if (tieneCopyright) {
      return cb(new Error('La imagen tiene derechos de autor y no puede ser subida.'));
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
router.post("/original", async (req, res) => {
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
    
    if (Fecha_Caducidad) {
      const fechaCaducidadDate = new Date(Fecha_Caducidad);
      if (fechaCaducidadDate < new Date()) {
        return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
      }
    }
    

    try {
      // Verificar si el alimento ya existe
      const existencia = await queryAsync(
        `SELECT Id_Alimento, Es_Perecedero FROM cat_alimento 
        WHERE Id_Usuario_Alta = ? AND Alimento = ? AND Activo = 1`,
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
      //Esto ya no es necesario ya que ya existe el Trigger
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

// Agregar un alimento
router.post("/alimentoEsPerecedero", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { id_alimento, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;

    const { error } = alimentoEsPerecederoSchema.validate({
      id_alimento: Number(id_alimento),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      fecha_caducidad: fecha_caducidad,
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    // Validación de datos

    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const Fecha_Caducidad = formatFechaCaducidad(fecha_caducidad);
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;
    const fechaCaducidadDate = new Date(Fecha_Caducidad);
    if (fechaCaducidadDate < new Date()) {
      return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
    }
    
    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
    try {
        // Crear un nuevo registro en stock_detalle
        await queryAsync(
          `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_unidad,
            cantidad,
            cantidad,
            Fecha_Caducidad, // Si no es perecedero, Fecha_Caducidad será NULL
            Number(id_alimento),
            imagen,
            Id_Usuario_Alta,
            Fecha_Alta,
          ]
        );
        
        res.status(200).json({message: "Alimento agregado exitosamente",});

    } catch (error) {
      console.error("Error al agregar el alimento:", error);
      res.status(500).json({ error: "Error al agregar el alimento" });
    }
  });
});

router.post("/alimentoNoPerecedero", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { id_alimento, id_unidad, cantidad, Id_Usuario_Alta } = req.body;

    const { error } = alimentoNoPerecederoSchema.validate({
      id_alimento: Number(id_alimento),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    // Validación de datos

    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;
    
    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
    try {
        // Crear un nuevo registro en stock_detalle
        await queryAsync(
          `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_unidad,
            cantidad,
            cantidad,
            null, // Si no es perecedero, Fecha_Caducidad será NULL
            Number(id_alimento),
            imagen,
            Id_Usuario_Alta,
            Fecha_Alta,
          ]
        );
        
        res.status(200).json({message: "Alimento agregado exitosamente",});

    } catch (error) {
      console.error("Error al agregar el alimento:", error);
      res.status(500).json({ error: "Error al agregar el alimento" });
    }
  });
});

// Agregar un alimento
router.post("/nuevoAlimentoEsPerecedero", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { nombre, tipo, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;

    const { error } = nuevoAlimentoEsPerecederoSchema.validate({
      nombre: nombre,
      tipo: Number(tipo),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      fecha_caducidad: fecha_caducidad,
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const Fecha_Caducidad = formatFechaCaducidad(fecha_caducidad);
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;
    const fechaCaducidadDate = new Date(Fecha_Caducidad);
    if (fechaCaducidadDate < new Date()) {
      return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
    }
    
    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

    try {

      // Insertar nuevo alimento si no existe
      const result1 = await queryAsync(
        `INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?)`,
        [nombre, tipo, 1, Id_Usuario_Alta, Fecha_Alta]
      );

      const Id_Alimento = result1.insertId;

      // Insertar en stock_detalle
      await queryAsync(
        `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_unidad, cantidad, cantidad, Fecha_Caducidad, Id_Alimento, imagen, Id_Usuario_Alta, Fecha_Alta]
      );

      //al crearse un nuevo alimento en el catalogo se marca como que el usuario puede comerlo
      //Esto ya no es necesario ya que ya existe el Trigger

      res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
    } catch (error) {
      console.error("Error al agregar el alimento:", error);
      res.status(500).json({ error: "Error al agregar el alimento" });
    }
  });
});

// Agregar un alimento
router.post("/nuevoAlimentoNoPerecedero", async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).send("Error al procesar la imagen");
    }

    const { nombre, tipo, id_unidad, cantidad, Id_Usuario_Alta } = req.body;

    const { error } = nuevoAlimentoNoPerecederoSchema.validate({
      nombre: nombre,
      tipo: Number(tipo),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");
    const imagen = req.file ? `/imagenes/${req.file.filename}` : `/imagenes/defIng.png`;
    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

    try {

      // Insertar nuevo alimento si no existe
      const result1 = await queryAsync(
        `INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?)`,
        [nombre, tipo, 0, Id_Usuario_Alta, Fecha_Alta]
      );

      const Id_Alimento = result1.insertId;

      // Insertar en stock_detalle
      await queryAsync(
        `INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_unidad, cantidad, cantidad, null, Id_Alimento, imagen, Id_Usuario_Alta, Fecha_Alta]
      );

      //al crearse un nuevo alimento en el catalogo se marca como que el usuario puede comerlo
      //Esto ya no es necesario ya que ya existe el Trigger

      res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
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
      sd.Total AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      sd.Fecha_Caducidad,
      sd.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    WHERE ca.Es_Perecedero = 1 AND sd.Id_Usuario_Alta = ?
    ORDER BY sd.Fecha_Caducidad ASC;
  `;

  const query2 = `
    SELECT 
      sd.Id_Stock_Detalle AS id,
      ca.Alimento AS Nombre,
      sd.Activo AS Activo,
      sd.Total AS Cantidad,
      cum.Abreviatura AS Unidad,
      sd.Imagen_alimento AS Imagen,
      sd.Id_Usuario_Alta,
      cta.Tipo_Alimento AS Tipo_Alimento
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
    WHERE ca.Es_Perecedero = 0 AND sd.Id_Usuario_Alta = ?
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

// Actualizar un alimento
router.put("/:id_stock", async (req, res) => {
  
    const id_stock = req.params.id_stock;
    const { id_unidad, cantidad, Id_Usuario_Alta } = req.body;

    /*const { error } = alimentoConsumirSchema.validate({
      id_stock: Number(id_stock),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });*/
    // Validación de datos
    const parsedData = {
      id_stock: Number(id_stock),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta)
    };
    if (Object.values(parsedData).some(val => Number.isNaN(val))) {
      return res.status(400).json({ error: "Datos numéricos inválidos." });
    }
    const { error } = alimentoConsumirSchema.validate(parsedData);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

    // return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

  try {

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad_Consumida = ?, Total = Total - Cantidad_Consumida, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, Id_Usuario_Alta, Fecha_Alta, id_stock];

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});

module.exports = router;
