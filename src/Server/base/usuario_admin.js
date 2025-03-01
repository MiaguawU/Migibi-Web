const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');
const bcrypt = require('bcrypt');

const verificarPermisos = (id_usuario, res, callback) => {
  const query = 'SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?';
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos", err);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }
    if (!result.length || result[0].Id_Rol == 1) {
      return res.status(403).json({ error: "Acceso prohibido: No tienes permiso para realizar esta acción" });
    }
    callback();
  });
};

const uploadDir = path.join(__dirname, "../imagenes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Solo se permiten imágenes PNG, JPG o JPEG'));
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
  return /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*\d){2,}).{7,}$/.test(password);
};

router.post('/', upload.single('foto_perfil'), sanitizeInput, (req, res) => {
  const { Nombre_Usuario, Contrasena, Cohabitantes, Email, Id_Rol, id_usuario_admin } = req.body;
  verificarPermisos(id_usuario_admin, res, async () => {
    if (!Nombre_Usuario || !Contrasena || !Id_Rol) {
      return res.status(400).json({ error: 'Nombre de usuario, contraseña y rol son obligatorios' });
    }
    if (!validatePassword(Contrasena)) {
      return res.status(400).json({ error: 'La contraseña no cumple con los requisitos' });
    }
    try {
      const hashedPassword = await bcrypt.hash(Contrasena, 10);
      const nuevaImagen = req.file ? `imagenes/${req.file.filename}` : null;
      const query = `INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil, Cohabitantes, Email, Es_Gmail, Id_Rol) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const valores = [
        Nombre_Usuario, hashedPassword, nuevaImagen, Cohabitantes || 1, Email || null,
        Email && Email.endsWith('@gmail.com') ? 1 : 0, Id_Rol
      ];
      db.query(query, valores, (err) => {
        if (err) return res.status(500).json({ error: 'Error al insertar usuario' });
        res.json({ message: 'Usuario creado con éxito' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { id_usuario_admin } = req.body;
  verificarPermisos(id_usuario_admin, res, () => {
    if (!validator.isNumeric(id)) {
      return res.status(400).send("El ID debe ser numérico");
    }
    const query = 'UPDATE usuario SET Activo = 0 WHERE Id_Usuario = ?';
    db.query(query, [id], (err) => {
      if (err) return res.status(500).send('Error al eliminar usuario');
      res.send('Usuario eliminado con éxito');
    });
  });
});

router.put('/:id', upload.single('foto_perfil'), sanitizeInput, (req, res) => {
  const { id } = req.params;
  const { Nombre_Usuario, Cohabitantes, Email, Id_Rol, id_usuario_admin } = req.body;
  verificarPermisos(id_usuario_admin, res, async () => {
    if (!validator.isNumeric(id)) {
      return res.status(400).json({ error: 'El ID debe ser numérico' });
    }
    try {
      const nuevaImagen = req.file ? `imagenes/${req.file.filename}` : null;
      let query = 'UPDATE usuario SET ';
      const values = [];
      if (Nombre_Usuario) { query += 'Nombre_Usuario = ?, '; values.push(Nombre_Usuario); }
      if (Cohabitantes) { query += 'Cohabitantes = ?, '; values.push(Cohabitantes); }
      if (Email) { query += 'Email = ?, '; values.push(Email); }
      if (req.file) { query += 'foto_perfil = ?, '; values.push(nuevaImagen); }
      if (Id_Rol) { query += 'Id_Rol = ?, '; values.push(Id_Rol); }
      if (values.length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
      }
      query = query.slice(0, -2) + ' WHERE Id_Usuario = ?';
      values.push(id);
      db.query(query, values, (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
        res.json({ message: 'Usuario actualizado con éxito' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

module.exports = router;
