const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');
const bcrypt = require('bcrypt');
const axios = require('axios');

const verificarPermisos = (id_usuario, res, callback) => {
  const query = 'SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?';
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos", err);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }

    const rol = parseInt(result[0]?.Id_Rol);
    console.log(`Usuario ${id_usuario} tiene rol:`, rol);

    if (!result.length || rol !== 2) {
      console.log('Acceso denegado a usuario:', id_usuario);
      return res.status(403).json({ error: "Acceso prohibido: No tienes permiso para realizar esta acción" });
    }

    console.log('Acceso permitido a usuario:', id_usuario);
    callback();
  });
};


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
  return /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*\d){2,}).{7,}$/.test(password);
};

router.get('/:id_usuario_admin', (req, res) => {
  const { id_usuario_admin } = req.params; // ID del usuario que solicita los datos

  if (!id_usuario_admin) {
    return res.status(400).json({ error: 'Se requiere el ID del usuario administrador' });
  }

  verificarPermisos(id_usuario_admin, res, () => {
    const query = 'SELECT * FROM usuario';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      res.json(results);
    });
  });
});

router.get('/unic/:id_usuario_admin/:id', (req, res) => {
  const { id_usuario_admin, id } = req.params; // ID del usuario que solicita los datos

  if (!id_usuario_admin) {
    return res.status(400).json({ error: 'Se requiere el ID del usuario administrador' });
  }

  verificarPermisos(id_usuario_admin, res, () => {
    const query = 'SELECT Nombre_Usuario, Cohabitantes, Email, Id_Rol, foto_perfil FROM usuario WHERE Id_Usuario=?';

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      res.json(results);
    });
  });
});

router.post('/:id_usuario_admin', upload.single('foto_perfil'), sanitizeInput, (req, res) => {
  const { id_usuario_admin } = req.params;
  const { Nombre_Usuario, Contrasena, Cohabitantes, Email, Id_Rol} = req.body;
  
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

router.delete('/:id/:id_usuario_admin', (req, res) => {
  const { id, id_usuario_admin } = req.params;
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

router.put('/:id/:id_usuario_admin', upload.single('foto_perfil'), sanitizeInput, (req, res) => {
  const { id, id_usuario_admin } = req.params;
  const { Nombre_Usuario, Cohabitantes, Email, Id_Rol } = req.body;
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

router.put("/act/:id", (req, res) => {
    console.log("--- Inicio de la ruta /act/:id ---"); // Add this
    const { id } = req.params;
    const { id_usuario } = req.body; // id_usuario is the admin performing the action

    console.log('Valores recibidos: id =', id, 'id_usuario =', id_usuario); // Add this for clarity

    // Basic validation for id and id_usuario
    if (!id || !validator.isNumeric(id)) {
        console.log("Error: ID de usuario a activar inválido."); // Add this
        return res.status(400).json({ error: "ID de usuario a activar inválido." });
    }
    if (!id_usuario || !validator.isNumeric(id_usuario)) {
        console.log("Error: ID del usuario administrador inválido."); // Add this
        return res.status(400).json({ error: "ID del usuario administrador inválido." });
    }

    console.log('Pasó validación inicial. Llamando a verificarPermisos...'); // Add this

    verificarPermisos(id_usuario, res, () => {
        console.log('Dentro del callback de verificarPermisos.'); // This is where your original logs are
        console.log('id ',id, id_usuario);
        console.log('ñiani');

        const fecha_baja = new Date();
        const query = `UPDATE usuario SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Usuario = ?`;

        db.query(query, [id_usuario, fecha_baja, id], (err) => {
            if (err) {
                console.error("Error al activar usuario:", err);
                return res.status(500).json({ error: "Error al activar usuario" });
            }
            console.log(`Usuario con ID ${id} activado con éxito en la base de datos.`); // Add this
            res.json({ message: `Usuario con ID ${id} activado con éxito` });
        });
    });
});

module.exports = router;
