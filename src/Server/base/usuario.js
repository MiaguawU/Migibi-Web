const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');  

// Crear el directorio para las imágenes si no existe
const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    console.log("📂 Archivo recibido:", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage, // Antes usaba memoryStorage
}).single("foto_perfil"); // Asegura que se espere un solo archivo con el campo "foto_perfil"


// Middleware para sanitizar entradas y prevenir inyecciones
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

// Endpoint para obtener el usuario
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

// Endpoint para actualizar el usuario (incluyendo la imagen de perfil)
router.put('/:id', upload, async (req, res) => {
  console.log("🔹 req.body:", req.body);
  console.log("🔹 req.file:", req.file);

  const { id } = req.params;
  const { Nombre_Usuario, Cohabitantes, Email } = req.body;
  if (!validator.isNumeric(id)) {
    return res.status(400).json({ error: "El ID debe ser numérico" });
  }

  try {
    const [usuario] = await new Promise((resolve, reject) => {
      db.query("SELECT foto_perfil FROM usuario WHERE Id_Usuario = ?", [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si se sube una nueva imagen, se actualiza; de lo contrario se conserva la existente
    const nuevaImagen = req.file ? `imagenes/${req.file.filename}` : usuario.foto_perfil;

    let query = "UPDATE usuario SET ";
    const values = [];

    if (Nombre_Usuario) { query += "Nombre_Usuario = ?, "; values.push(Nombre_Usuario); }
    if (Cohabitantes) { query += "Cohabitantes = ?, "; values.push(Cohabitantes); }
    if (Email) { query += "Email = ?, "; values.push(Email); }
    if (req.file) { query += "foto_perfil = ?, "; values.push(nuevaImagen); }

    // Eliminar la última coma y espacio, y agregar la cláusula WHERE
    query = query.slice(0, -2) + " WHERE Id_Usuario = ?";
    values.push(id);

    db.query(query, values, (err) => {
      if (err) {
        console.error("🚨 Error al actualizar usuario:", err);
        return res.status(500).json({ error: "Error al actualizar usuario" });
      }
      res.json({ message: "Usuario actualizado con éxito" });
    });
  } catch (error) {
    console.error("🚨 Error en la actualización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint para agregar un usuario
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

// Endpoint para eliminar un usuario
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
