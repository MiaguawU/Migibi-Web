const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');



const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());

// Middleware para analizar cuerpos de solicitudes con datos codificados en URL
router.use(express.urlencoded({ extended: true }));

router.post("/", (req, res) => {
  const { username, password } = req.body;
  console.log("Headers:", req.headers); // Para depuración
  console.log("Body recibido:", req.body); // Verifica los datos del cuerpo

  

  if (!username || !password) {
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  db.query('SELECT * FROM usuario WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener el usuario');
    }

    if (result.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const user = result[0];

    if (user.password !== password) {
      return res.status(401).send('Contraseña incorrecta');
    }

    res.json({ message: 'Inicio de sesión exitoso', user: { username: user.username } });
  });
});



module.exports = router;
