const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');  


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
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

// Función para sanitizar las entradas y evitar inyecciones de HTML/JS
const sanitizeInput = (req, res, next) => {
  Object.keys(req.body).forEach(key => {
    if (typeof req.body[key] === 'string') {
      // Escapa caracteres especiales para evitar inyecciones de HTML
      req.body[key] = validator.escape(req.body[key]);
      
      // Elimina caracteres ASCII no imprimibles
      req.body[key] = validator.stripLow(req.body[key], { keep_newlines: false });
      
      // Sanitiza cualquier posible código HTML/JavaScript
      req.body[key] = xss(req.body[key]);
    }
  });
  next();
};

// Endpoint para obtener usuario
router.get("/", (req, res) => {
  const { id_us } = req.query;

  if (!id_us || !validator.isNumeric(id_us)) {
    return res.status(400).send("El ID del usuario es requerido y debe ser numérico");
  }

  db.query(
    "SELECT * FROM usuario WHERE Id_Usuario = ?",
    [id_us],
    (err, result) => {
      if (err) {
        console.error("Error al obtener usuario:", err);
        return res.status(500).send("Error al obtener usuario");
      }
      res.json(result);
      console.log(result);
    }
  );
});

// Endpoint para actualizar usuario
router.put('/:id', upload.single('foto_perfil'), sanitizeInput, (req, res) => {
  const { id } = req.params;
  const { Nombre_Usuario, Cohabitantes, Email } = req.body;

  // Verificar si se recibe una nueva foto de perfil
  const foto_perfil = req.file ? `imagenes/${req.file.filename}` : null;

  // Validación de ID
  if (!validator.isNumeric(id)) {
    return res.status(400).send("El ID debe ser numérico");
  }

  // Preparar la consulta dinámica
  let query = `UPDATE usuario SET `;
  const values = [];

  // Añadir los campos a actualizar
  if (Nombre_Usuario) {
    query += `Nombre_Usuario = ?, `;
    values.push(Nombre_Usuario);
  }
  if (Cohabitantes) {
    query += `Cohabitantes = ?, `;
    values.push(Cohabitantes);
  }
  if (Email) {
    query += `Email = ?, `;
    values.push(Email);
  }
  if (foto_perfil) {
    query += `foto_perfil = ?, `;
    values.push(foto_perfil);
  }

  // Eliminar la coma final
  query = query.slice(0, -2);

  // Añadir la condición WHERE al final de la consulta
  query += ` WHERE Id_Usuario = ?`;
  values.push(id);

  // Ejecutar la consulta
  db.query(query, values, (err) => {
    if (err) { 
      return res.status(500).send('Error al actualizar usuario');
    }
    res.send('Usuario actualizado con éxito');
  });
});

// Endpoint para agregar usuario
router.post("/", sanitizeInput, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  const foto_perfil = `/imagenes/defaultPerfil.png`;


  const query = `
    INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil) 
    VALUES (?, ?, ?)
  `;
  
  const values = [username, password, foto_perfil];


  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar en la base de datos:", err);
      return res.status(500).send("Error al agregar usuario");
    }
    res.json({ id: result.insertId, message: "Usuario agregado con éxito" });
  });
});

// Endpoint para eliminar usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!validator.isNumeric(id)) {
    return res.status(400).send("El ID debe ser numérico");
  }

  const query = 'DELETE FROM usuario WHERE Id_Usuario = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Error al eliminar usuario');
    }
    res.send('Usuario eliminado con éxito');
  });
});

module.exports = router;
