const express = require('express');
const db = require('./connection');

const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", (req, res) => {
  const { username, password } = req.body;

  console.log("Headers:", req.headers); // Para depuración
  console.log("Body recibido:", req.body); // Verifica los datos del cuerpo

  if (!username || !password) {
    console.log("Faltan datos requeridos: username y password");
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  // Ajustar la consulta para coincidir con la estructura de la tabla
  db.query('SELECT * FROM usuario WHERE Nombre_Usuario = ?', [username], (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return res.status(500).send('Error al obtener el usuario');
    }

    if (result.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(404).send('Usuario no encontrado');
    }

    const user = result[0];

    // Validar la contraseña
    if (user.Contrasena !== password) {
      console.log("Contraseña incorrecta");
      return res.status(401).send('Contraseña incorrecta');
    }
    
    console.log(";(((");
    // Responder con los datos requeridos
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
