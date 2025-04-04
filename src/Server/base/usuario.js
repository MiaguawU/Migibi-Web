const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');  
const bcrypt = require('bcrypt');

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

const sanitizeInput = (req, res, next) => {
  Object.keys(req.body).forEach(key => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = validator.escape(req.body[key]);
      req.body[key] = validator.stripLow(req.body[key], { keep_newlines: false });
      req.body[key] = xss(req.body[key]);
    }
  });
  next();
};

const validatePassword = (password) => {
  if (password.length < 8) return false;
  const uppercase = (password.match(/[A-Z]/g) || []).length;
  const lowercase = (password.match(/[a-z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  return uppercase >= 2 && lowercase >= 2 && numbers >= 2;
};

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
    }
  );
});

router.put('/:id', upload.single('foto_perfil'), async (req, res) => {
  console.log('🔹 req.body:', req.body);
  console.log('🔹 req.file:', req.file || 'No se subió imagen');

  const { id } = req.params;
  const { Nombre_Usuario, Cohabitantes, Email } = req.body;

  if (!validator.isNumeric(id)) {
    return res.status(400).json({ error: 'El ID debe ser numérico' });
  }

  try {
    const [usuario] = await new Promise((resolve, reject) => {
      db.query('SELECT foto_perfil FROM usuario WHERE Id_Usuario = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const nuevaImagen = req.file ? `imagenes/${req.file.filename}` : usuario.foto_perfil;

    let query = 'UPDATE usuario SET ';
    const values = [];

    if (Nombre_Usuario) { query += 'Nombre_Usuario = ?, '; values.push(Nombre_Usuario); }
    if (Cohabitantes) { query += 'Cohabitantes = ?, '; values.push(Cohabitantes); }
    if (Email) { query += 'Email = ?, '; values.push(Email); }
    if (req.file) { query += 'foto_perfil = ?, '; values.push(nuevaImagen); }

    if (values.length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    query = query.slice(0, -2) + ' WHERE Id_Usuario = ?';
    values.push(id);

    db.query(query, values, (err) => {
      if (err) {
        console.error('🚨 Error al actualizar usuario:', err);
        return res.status(500).json({ error: 'Error al actualizar usuario' });
      }
      res.json({ message: 'Usuario actualizado con éxito' });
    });
  } catch (error) {
    console.error('🚨 Error en la actualización:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post("/", sanitizeInput, async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);

  if (!username || !password || !email) {
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  if (!validatePassword(password)) {
    return res.status(400).send("La contraseña debe tener al menos 8 caracteres, con mínimo 2 mayúsculas, 2 minúsculas y 2 números");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const foto_perfil = `/imagenes/defaultPerfil.png`;

  const query = `
    INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil, Id_Rol, Email) 
    VALUES (?, ?, ?, 1, ?)
  `;
  const values = [username, hashedPassword, foto_perfil, email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar en la base de datos:", err);
      return res.status(500).send("Error al agregar usuario");
    }
    res.json({ id: result.insertId, message: "Usuario agregado con éxito" });
  });
});

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
