const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

router.post("/", (req, res, next) => {
  // Procesar la carga de la imagen antes de continuar con el resto del proceso
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error al procesar la imagen:', err);
      return res.status(500).send('Error al procesar la imagen');
    }

    // Desestructuración de los datos del body
    const { nombre, id_tipo_alimento, id_usuario_alta, fecha_alta, es_perecedero } = req.body;

    console.log("Headers:", req.headers);
    console.log("Body recibido:", req.body);

    // Validar que los campos requeridos estén presentes
    if (!nombre || !id_tipo_alimento || !id_usuario_alta || !fecha_alta) {
      return res.status(400).send("Faltan datos requeridos");
    }

    // Establecer la imagen predeterminada si no se sube una imagen
    const imagen = req.file ? `../imagenes/${req.file.filename}` : `imagenes/defAlimento.png`;

    // Consulta para insertar el nuevo alimento
    const query1 = `
      INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta, Es_Perecedero) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values1 = [nombre, id_tipo_alimento, imagen, id_usuario_alta, fecha_alta, es_perecedero];

    // Ejecutar la consulta
    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al insertar alimento:", err1);
        return res.status(500).send("Error al agregar alimento");
      }

      // Responder con el ID del alimento creado y un mensaje de éxito
      res.json({ id: result1.insertId, message: "Alimento agregado con éxito" });
    });
  });
});

// Ruta para obtener alimentos
router.get("/", (req, res) => {
    const { id_tipo_alimento, activo } = req.query;
  
    // Construir la consulta SQL
    let query = `SELECT * FROM cat_alimento WHERE 1`;
  
    const params = [];
    if (id_tipo_alimento) {
      query += ` AND Id_Tipo_Alimento = ?`;
      params.push(id_tipo_alimento);
    }
    if (activo !== undefined) {
      query += ` AND Activo = ?`;
      params.push(activo);
    }
  
    // Ejecutar la consulta
    db.query(query, params, (err, result) => {
      if (err) {
        console.error("Error al obtener alimentos:", err);
        return res.status(500).send("Error al obtener alimentos");
      }
  
      // Devolver los alimentos encontrados
      res.json(result);
    });
  });
  

// Ruta para actualizar un alimento
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, id_tipo_alimento, es_perecedero, id_usuario_modif, fecha_modif } = req.body;
  
    // Validar que los campos requeridos estén presentes
    if (!nombre || !id_tipo_alimento || !id_usuario_modif || !fecha_modif) {
      return res.status(400).send("Faltan datos requeridos");
    }
  
    // Consulta para actualizar el alimento
    const query1 = `
      UPDATE cat_alimento 
      SET Alimento = ?, Id_Tipo_Alimento = ?, Es_Perecedero = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? 
      WHERE Id_Alimento = ?
    `;
    const values1 = [nombre, id_tipo_alimento, es_perecedero, id_usuario_modif, fecha_modif, id];
  
    // Ejecutar la consulta
    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al actualizar alimento:", err1);
        return res.status(500).send("Error al actualizar alimento");
      }
  
      // Responder con un mensaje de éxito
      res.json({ message: "Alimento actualizado con éxito" });
    });
  });

  // Ruta para eliminar un alimento (marcarlo como inactivo)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
  
    // Consulta para marcar el alimento como inactivo (baja lógica)
    const query1 = `
      UPDATE cat_alimento 
      SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
      WHERE Id_Alimento = ?
    `;
    const { id_usuario_baja, fecha_baja } = req.body;
  
    // Validar que los campos requeridos estén presentes
    if (!id_usuario_baja || !fecha_baja) {
      return res.status(400).send("Faltan datos requeridos para la baja");
    }
  
    const values1 = [id_usuario_baja, fecha_baja, id];
  
    // Ejecutar la consulta
    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al eliminar alimento:", err1);
        return res.status(500).send("Error al eliminar alimento");
      }
  
      // Responder con un mensaje de éxito
      res.json({ message: "Alimento eliminado con éxito" });
    });
  });
  

module.exports = router;
