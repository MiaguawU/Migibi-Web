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
router.put("/:id", (req, res) => {
  upload.single("imagen")(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar la imagen:", err);
      return res.status(500).json({ error: "Error al procesar la imagen" });
    }

    const { id } = req.params;
    const { nombre, id_tipo_consumo, tiempo, porciones, calorias, id_usu } = req.body;

    // Validar datos
    const { error } = recetaSchema.validate({ nombre, id_tipo_consumo, tiempo, calorias, porciones });
    if (error) {
      console.error("Error en la validación:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      // Obtener usuario que creó la receta
      const recetaAutorRes = await queryAsync(`SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`, [id]);
      if (recetaAutorRes.length === 0) {
        return res.status(404).json({ error: "Receta no encontrada" });
      }
      const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

      // Obtener rol del usuario que intenta actualizar
      const usuarioRes = await queryAsync(`SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`, [id_usu]);
      if (usuarioRes.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const rol = usuarioRes[0].Id_Rol;

      // Verificar permiso (autor o admin)
      if (parseInt(id_usu) !== idAutor && rol !== 2) {
        console.log("Acceso denegado, sin permisos");
        return res.status(403).json({ error: "Acceso denegado, sin permisos" });
      }

      // Obtener imagen actual si no se sube una nueva
      const recetaActualRes = await queryAsync(`SELECT Imagen_receta FROM receta WHERE Id_Receta = ?`, [id]);
      const recetaActual = recetaActualRes[0];
      const nuevaImagen = req.file ? `/imagenes/${req.file.filename}` : recetaActual.Imagen_receta;

      // Actualizar receta
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
      await queryAsync(updateQuery, values);

      // Eliminar recetas basura
      
      const deleteQuery = `CALL eliminarRecetasBasura();`;
      await queryAsync(deleteQuery);

      res.json({ message: "Receta actualizada con éxito" });
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

router.get("/:id/:id_usu", async (req, res) => {
  const { id, id_usu } = req.params;

  try {
    // Obtener autor de la receta
    const recetaAutorRes = await queryAsync(
      `SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`,
      [id]
    );

    if (recetaAutorRes.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

    // Obtener rol del usuario que intenta acceder
    const usuarioRes = await queryAsync(
      `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`,
      [id_usu]
    );

    if (usuarioRes.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const rol = usuarioRes[0].Id_Rol;

    // Verificar permisos:
    const esAutor = parseInt(id_usu) === idAutor;
    const esAdmin = rol === 2;
    const recetaEsPublica = idAutor === 1;

    if (!esAutor && !esAdmin && !recetaEsPublica) {
      console.log("Acceso denegado, sin permisos");
      return res.status(403).json({ error: "Acceso denegado, sin permisos" });
    }

    // Obtener datos de la receta
    const query1 = `
      SELECT
        r.Nombre AS Nombre,
        r.Calorias AS Calorias,
        r.Id_Tipo_Consumo AS id_Tipo,
        r.Imagen_receta AS Imagen,
        r.Tiempo AS Tiempo,
        r.Porciones
      FROM receta r
      WHERE r.Id_Receta = ?;
    `;

    const recetaInfo = await queryAsync(query1, [id]);

    if (recetaInfo.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    console.log("Receta enviada:", recetaInfo);
    res.json(recetaInfo);

  } catch (err) {
    console.error("Error al obtener receta:", err);
    res.status(500).send("Error al procesar la solicitud");
  }
});

router.get("/ed/:id/:id_usu", async (req, res) => {
  const { id, id_usu } = req.params;

  try {
    // Obtener autor de la receta
    const recetaAutorRes = await queryAsync(
      `SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`,
      [id]
    );

    if (recetaAutorRes.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

    // Obtener rol del usuario que intenta acceder
    const usuarioRes = await queryAsync(
      `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`,
      [id_usu]
    );

    if (usuarioRes.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const rol = usuarioRes[0].Id_Rol;

    // Verificar permisos:
    const esAutor = parseInt(id_usu) === idAutor;
    const esAdmin = rol === 2;

    if (!esAutor && !esAdmin ) {
      console.log("Acceso denegado, sin permisos");
      return res.status(403).json({ error: "Acceso denegado, sin permisos" });
    }

    // Obtener datos de la receta
    const query1 = `
      SELECT
        r.Nombre AS Nombre,
        r.Calorias AS Calorias,
        r.Id_Tipo_Consumo AS id_Tipo,
        r.Imagen_receta AS Imagen,
        r.Tiempo AS Tiempo,
        r.Porciones
      FROM receta r
      WHERE r.Id_Receta = ?;
    `;

    const recetaInfo = await queryAsync(query1, [id]);

    if (recetaInfo.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    console.log("Receta enviada:", recetaInfo);
    res.json(recetaInfo);

  } catch (err) {
    console.error("Error al obtener receta:", err);
    res.status(500).send("Error al procesar la solicitud");
  }
});

module.exports = router;
