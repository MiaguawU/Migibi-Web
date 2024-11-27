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
    fileSize: 5 * 1024 * 1024, // Tamaño máximo del archivo: 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});


// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.query('SELECT * FROM usuario', (err, result) => {
    if (err) {
      return res.status(500).send('Error al obtener usuarios');
    }
    res.json(result);
  });
});

// Actualizar usuario
router.put('/:id', upload.single('foto_perfil'), (req, res) => {
  const { id } = req.params;
  const { Nombre_Usuario, Contrasena, Email, Cohabitantes } = req.body;
  const foto_perfil = req.file ? `imagenes/${req.file.filename}` : null;

  const query = `
    UPDATE usuario 
    SET Nombre_Usuario = ?, Contrasena = ?, Email = ?, Cohabitantes = ?, foto_perfil = ? 
    WHERE Id_Usuario = ?
  `;
  const values = [Nombre_Usuario, Contrasena, Email, Cohabitantes, foto_perfil, id];

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).send('Error al actualizar usuario');
    }
    res.send('Usuario actualizado con éxito');
  });
});

// Ruta de registro

router.post("/", (req, res) => {
  const { username, password } = req.body;
  console.log("Headers:", req.headers); // Para depuración
  console.log("Body recibido:", req.body); // Verifica los datos del cuerpo

  

  if (!username || !password) {
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  // Ruta fija para la imagen predeterminada
  const foto_perfil = `imagenes/defaultPerfil.png`;

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


// Eliminar usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuario WHERE Id_Usuario = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Error al eliminar usuario');
    }
    res.send('Usuario eliminado con éxito');
  });
});

module.exports = router;
