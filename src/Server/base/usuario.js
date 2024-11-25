const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./conexion');

const router = express.Router();

const uploadDir = path.join(__dirname, '../imagenes');

// Configuración para subir imágenes
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener productos');
    } else {
      res.json(result);
    }
  });
});

// Agregar un producto
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error al procesar la imagen:', err);
      return res.status(500).send('Error al procesar la imagen');
    }

    const { name, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO products (name, price, image) VALUES (?, ?, ?)';
    db.query(sql, [name, price, image], (err, result) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        return res.status(500).send('Error al agregar producto');
      }
      res.json(result);
    });
  });
});



// Eliminar un producto
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar producto');
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
