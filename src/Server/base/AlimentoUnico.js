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

const alimentoEsPerecederoSchema = Joi.object({
  id_stock: Joi.number().required(),
  id_alimento: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().allow(null, '').optional(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});

const alimentoNoPerecederoSchema = Joi.object({
  id_stock: Joi.number().required(),
  id_alimento: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  Id_Usuario_Alta: Joi.number().required(),
});

const nuevoAlimentoEsPerecederoSchema = Joi.object({
  id_stock: Joi.number().required(),
  nombre: Joi.string().required(),
  tipo: Joi.number().required(),
  id_unidad: Joi.number().required(),
  cantidad: Joi.number().min(1).required(),
  fecha_caducidad: Joi.date().required(), // Permite cadenas vacías o nulos
  Id_Usuario_Alta: Joi.number().required(),
});

const nuevoAlimentoNoPerecederoSchema = Joi.object({
  id_stock: Joi.number().required(),
  nombre: Joi.string().required(),
  tipo: Joi.number().allow(null, 0).optional(),
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
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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

router.get("/:id", async (req, res) => {
    const id = req.params.id;
  
    const query = `
      SELECT
        sd.Id_Alimento,  
        ca.Alimento AS Nombre,
        sd.Total AS Cantidad,
        sd.Id_Unidad_Medida AS id_unidad,
        ca.Id_Tipo_Alimento AS id_tipo,
        sd.Fecha_Caducidad AS Fecha,
        ca.Es_Perecedero AS EsPerecedero
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

  
// Actualizar un alimento
router.put("/original/:id", upload.single("image"), async (req, res) => {
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

    if (Fecha_Caducidad) {
      const fechaCaducidadDate = new Date(Fecha_Caducidad);
      if (fechaCaducidadDate < new Date()) {
        return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
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

    //Aquí terminan las dfjksljklsadsdafjilsdfajiosdjiofjiofgijdfggjikldfjilfgijler 
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

// Actualizar un alimento
router.put("/alimentoEsPerecedero/:id_stock", upload.single("image"), async (req, res) => {
  
    const id_stock = req.params.id_stock;
    
    const { id_alimento, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;
    console.log('id_Al: ',id_alimento);

    const { error } = alimentoEsPerecederoSchema.validate({
      id_stock: Number(id_stock),
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
    const fechaCaducidadDate = new Date(Fecha_Caducidad);
    if (fechaCaducidadDate < new Date()) {
      return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
    }

    // Obtener la imagen existente si no se proporciona una nueva
    let imagen;
    if (req.file) {
      // Si hay un archivo subido, se usa esa imagen
      imagen = `/imagenes/${req.file.filename}`;
    } else {
      // Si no, obtenemos la imagen actual desde la base de datos
      const queryImagen = `SELECT Imagen_alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?`;
      const [result] = await queryAsync(queryImagen, [id_stock]);
      if (!result) {
        console.log("imagen alimento no encontrado");
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
    }

    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

  try {

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Id_Alimento = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, Fecha_Caducidad, id_alimento, imagen, Id_Usuario_Alta, Fecha_Alta, id_stock];

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});

// Actualizar un alimento
router.put("/alimentoNoPerecedero/:id_stock", upload.single("image"), async (req, res) => {
  
    const id_stock = req.params.id_stock;
    const { id_alimento, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;
    console.log(cantidad)

    const { error } = alimentoNoPerecederoSchema.validate({
      id_stock: Number(id_stock),
      id_alimento: Number(id_alimento),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    // Validación de datos

    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

    // Obtener la imagen existente si no se proporciona una nueva
    let imagen;
    if (req.file) {
      // Si hay un archivo subido, se usa esa imagen
      imagen = `/imagenes/${req.file.filename}`;
    } else {
      // Si no, obtenemos la imagen actual desde la base de datos
      const queryImagen = `SELECT Imagen_alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?`;
      const [result] = await queryAsync(queryImagen, [id_stock]);
      if (!result) {
        console.log("imagen alimento no encontrado");
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
    }

    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

  try {

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Id_Alimento = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, null, id_alimento, imagen, Id_Usuario_Alta, Fecha_Alta, id_stock];

    const sanitizeValue = (value) => {
        if (value === null) return 'NULL';
        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`; // Escapar comillas para SQL
        if (typeof value === 'number' || typeof value === 'boolean') return value;
        return `'${String(value).replace(/'/g, "''")}'`; // Convertir otros tipos a string y escapar
    };

    let fullQuery = query2;
    // Reemplaza los placeholders '?' con los valores correspondientes
    for (let i = 0; i < values2.length; i++) {
        fullQuery = fullQuery.replace('?', sanitizeValue(values2[i]));
    }

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});

// Actualizar un alimento
router.put("/nuevoAlimentoEsPerecedero/:id_stock", upload.single("image"), async (req, res) => {
  
    const id_stock = req.params.id_stock;
    const { nombre, tipo, id_unidad, cantidad, fecha_caducidad, Id_Usuario_Alta } = req.body;

    const { error } = nuevoAlimentoEsPerecederoSchema.validate({
      id_stock: Number(id_stock),
      nombre: nombre,
      tipo: Number(tipo),
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
    const fechaCaducidadDate = new Date(Fecha_Caducidad);
    if (fechaCaducidadDate < new Date()) {
      return res.status(400).json({ error: "No puedes agregar un alimento con fecha de caducidad vencida." });
    }

    // Obtener la imagen existente si no se proporciona una nueva
    let imagen;
    if (req.file) {
      // Si hay un archivo subido, se usa esa imagen
      imagen = `/imagenes/${req.file.filename}`;
    } else {
      // Si no, obtenemos la imagen actual desde la base de datos
      const queryImagen = `SELECT Imagen_alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?`;
      const [result] = await queryAsync(queryImagen, [id_stock]);
      if (!result) {
        console.log("imagen alimento no encontrado");
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
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

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Id_Alimento = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, Fecha_Caducidad, Id_Alimento, imagen, Id_Usuario_Alta, Fecha_Alta, id_stock];

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});

// Actualizar un alimento
router.put("/nuevoAlimentoNoPerecedero/:id_stock", upload.single("image"), async (req, res) => {
  
    const id_stock = req.params.id_stock;

    const { nombre, tipo, id_unidad, cantidad, Id_Usuario_Alta } = req.body;

    const { error } = nuevoAlimentoNoPerecederoSchema.validate({
      id_stock: Number(id_stock),
      nombre: nombre,
      tipo: Number(tipo),
      id_unidad: Number(id_unidad),
      cantidad: Number(cantidad),
      Id_Usuario_Alta: Number(Id_Usuario_Alta),
    });
    // Validación de datos

    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

    // Obtener la imagen existente si no se proporciona una nueva
    let imagen;
    if (req.file) {
      // Si hay un archivo subido, se usa esa imagen
      imagen = `/imagenes/${req.file.filename}`;
    } else {
      // Si no, obtenemos la imagen actual desde la base de datos
      const queryImagen = `SELECT Imagen_alimento FROM stock_detalle WHERE Id_Stock_Detalle = ?`;
      const [result] = await queryAsync(queryImagen, [id_stock]);
      if (!result) {
        console.log("imagen alimento no encontrado");
        return res.status(404).json({ error: "Alimento no encontrado" });
      }
      imagen = result.Imagen_alimento;
    }

    //return res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});

  try {
    // Insertar nuevo alimento si no existe
    const result1 = await queryAsync(
      `INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?)`,
      [nombre, tipo, 0, Id_Usuario_Alta, Fecha_Alta]
    );

    const Id_Alimento = result1.insertId;

    // Actualizar los detalles del stock
    const query2 = `UPDATE stock_detalle 
      SET Id_Unidad_Medida = ?, Cantidad = ?, Fecha_Caducidad = ?, Id_Alimento = ?, Imagen_alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = 1
      WHERE Id_Stock_Detalle = ?`;

    const values2 = [id_unidad, cantidad, null, Id_Alimento,  imagen, Id_Usuario_Alta, Fecha_Alta, id_stock];

    await queryAsync(query2, values2);

    // Respuesta exitosa
    res.status(200).json({message: "Alimento y detalle del stock actualizados exitosamente.",});
  } catch (error) {
    console.error("Error al actualizar el alimento:", error);
    res.status(500).json({ error: "Error al actualizar el alimento" });
  }
});

module.exports = router;