const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db"); // Asegúrate de tener tu conexión a MySQL aquí

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.Id_Usuario, email: usuario.Email }, // Payload con datos del usuario
    process.env.JWT_SECRET, // Clave secreta
    { expiresIn: "1h", algorithm: "HS256" } // Expira en 1 hora
  );
};

exports.login = (req, res) => {
  const { identifier, password } = req.body; // Puede ser email o usuario

  if (!identifier || !password) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  let query = identifier.endsWith("@gmail.com")
    ? "SELECT * FROM usuario WHERE Email = ?"
    : "SELECT * FROM usuario WHERE Nombre_Usuario = ?";

  db.query(query, [identifier], async (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const usuario = result[0];

    const passwordMatch = await bcrypt.compare(password, usuario.Contrasena);
    if (!passwordMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = generarToken(usuario);

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.Id_Usuario,
        username: usuario.Nombre_Usuario,
        email: usuario.Email,
        foto_perfil: usuario.foto_perfil,
      },
    });
  });
};
