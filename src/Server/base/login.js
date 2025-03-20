const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./connection');

const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", (req, res) => {
  const { identifier, password } = req.body; // Usamos "identifier" en lugar de "email"

  if (!identifier || !password) {
    console.log("Faltan datos requeridos: identifier y password");
    return res.status(400).send("Faltan datos requeridos: identifier y password");
  }

  let query = identifier.endsWith("@gmail.com") 
    ? 'SELECT * FROM usuario WHERE Email = ?' 
    : 'SELECT * FROM usuario WHERE Nombre_Usuario = ?';

  db.query(query, [identifier], async (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return res.status(500).send('Error al obtener el usuario');
    }

    if (result.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(404).send('Usuario no encontrado');
    }

    const user = result[0];

    // Comparar la contraseña ingresada con la cifrada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.Contrasena);

    if (!passwordMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).send('Contraseña incorrecta');
    }

    res.json({
      id: user.Id_Usuario,
      username: user.Nombre_Usuario,
      foto_perfil: user.foto_perfil,
      Cohabitantes: user.Cohabitantes,
      Email: user.Email,
      message: "Sesión iniciada con éxito",
    });
  });
});


module.exports = router;
