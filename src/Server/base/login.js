const express = require('express');
const db = require('./connection');

const router = express.Router();

// Middleware para analizar cuerpos de solicitudes con datos en formato JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    console.log("Faltan datos requeridos: username y password");
    return res.status(400).send("Faltan datos requeridos: username y password");
  }

  let query = ` `;

  if(username.endsWith("@gmail.com")){
    query = 'SELECT * FROM usuario WHERE Email = ?';
    const query2 = `UPDATE usuario SET Nombre_Usuario = ? WHERE Email = ? `;
    let value1 = username;
    db.query(query, [username], (err, result) => {
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
  }
  else{
    query = 'SELECT * FROM usuario WHERE Nombre_Usuario = ?';

    db.query(query, [username], (err, result) => {
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
  }
  

});



module.exports = router;
