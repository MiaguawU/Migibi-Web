const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./connection");
const util = require("util");
const Joi = require("joi");
const axios = require('axios');
const dotenv = require("dotenv");
const sharp = require('sharp');

const router = express.Router();

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

//informacion escaneo
router.post('/scanner', async (req, res) => {
    const { codigo } = req.body;
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
        const data = await response.json();

        if (data.status === 1) {
            const nombre = data.product.product_name || '';
            const marca = data.product.brands || '';
            const nombreCompleto = `${nombre} ${marca}`.trim();

            console.log('Sending to front:', nombreCompleto); // Confirm what's being sent

            res.status(200).json({ // Use .json() and set status explicitly for clarity
                mensaje: 'Alimento encontrado',
                nombreCompleto: nombreCompleto
            });
        } else {
            res.status(404).json({ // Use 404 for not found
                mensaje: 'Código no encontrado',
                nombreCompleto: null
            });
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ // 500 for server errors
            mensaje: 'Error interno del servidor al buscar el producto',
            nombreCompleto: null,
            error: error.message
        });
    }
});

//informacion renocer imagen
const FATSECRET_ACCESS_TOKEN = process.env.ID_FAT; // ¡REEMPLAZA ESTO CON TU TOKEN REAL!

// Información para reconocer imagen
router.post('/recognize-food-image', async (req, res) => {
    // Solo esperamos image_b64 del frontend.
    const { image_b64 } = req.body;

    if (!image_b64) {
        return res.status(400).json({ mensaje: 'No se proporcionó ninguna imagen Base64.' });
    }

    try {
        // Convierte la Base64 a Buffer para el procesamiento con Sharp
        const imageBuffer = Buffer.from(image_b64, 'base64');

        // Redimensionar y optimizar la imagen antes de enviarla a FatSecret
        const processedImageB64 = await sharp(imageBuffer)
            .resize(512, 512, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 }) // Puedes usar .jpeg({ quality: 80 }) o .png() si prefieres
            .toBuffer()
            .then(buffer => buffer.toString('base64')); // Convertir de nuevo a Base64

        console.log('Tamaño de la imagen Base64 procesada:', processedImageB64.length);
        if (processedImageB64.length > 1148549) {
            console.warn('Advertencia: La imagen Base64 excede el límite de 1.09 MB. La solicitud a FatSecret podría fallar.');
        }

        // Prepara el cuerpo de la solicitud para FatSecret
        const fatSecretRequestBody = {
            image_b64: processedImageB64,
            region: "MX",          // Fijo para México
            language: "es",        // Fijo para español
            include_food_data: false, // Establecido en `false` si solo quieres el nombre
            eaten_foods: []       // Dejar vacío si no usas esta funcionalidad
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${FATSECRET_ACCESS_TOKEN}`
        };

        console.log('Enviando solicitud a FatSecret...');
        const fatSecretResponse = await axios.post(
            'https://platform.fatsecret.com/rest/image-recognition/v2',
            fatSecretRequestBody,
            { headers }
        );
        console.log(fatSecretResponse);

        // --- Procesamiento de la respuesta de FatSecret ---
        if (fatSecretResponse.data && fatSecretResponse.data.food_response && fatSecretResponse.data.food_response.length > 0) {
            const recognizedFoodsDetailed = [];

            // Agrupar y contar los alimentos detectados
            const foodCounts = {};
            fatSecretResponse.data.food_response.forEach(foodItem => {
                if (foodItem.food_entry_name) {
                    const name = foodItem.food_entry_name;
                    foodCounts[name] = (foodCounts[name] || 0) + 1;
                }
            });

            for (const name in foodCounts) {
                recognizedFoodsDetailed.push({ name: name, quantity: foodCounts[name] });
            }

            console.log('Alimentos reconocidos para el frontend:', recognizedFoodsDetailed);

            res.status(200).json({
                mensaje: 'Alimentos encontrados',
                recognizedFoodsDetailed: recognizedFoodsDetailed
            });

        } else {
            console.log('No se detectaron alimentos en la imagen.');
            res.status(200).json({ // 200 OK si la operación fue exitosa pero no se encontró nada
                mensaje: 'No se detectaron alimentos en la imagen.',
                recognizedFoodsDetailed: []
            });
        }

    } catch (error) {
        console.error('Error al procesar la imagen para FatSecret:', error.response ? error.response.data : error.message);

        let errorMessage = 'Error al reconocer la imagen de alimentos con FatSecret.';
        let statusCode = 500;

        // Comprobación específica para errores de Axios
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401) { // Unauthorized
                errorMessage = 'Error de autenticación con FatSecret. Verifica tu Access Token.';
                statusCode = 401;
            } else if (error.response.data && error.response.data.message) {
                 // Capturar mensajes de error de FatSecret como el "Error 211"
                errorMessage = `Error de FatSecret: ${error.response.data.message}`;
                statusCode = error.response.status; // Usa el status devuelto por FatSecret
            } else {
                errorMessage = `Error de la API de FatSecret: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                statusCode = error.response.status;
            }
        }

        res.status(statusCode).json({
            mensaje: errorMessage,
            recognizedFoodsDetailed: []
        });
    }
});


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
