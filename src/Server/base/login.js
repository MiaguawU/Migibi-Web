const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./connection");
const Redis = require("ioredis");

const router = express.Router();
const redis = new Redis(); // Asegúrate de tener Redis corriendo

// Middleware para analizar cuerpos de solicitudes con datos JSON
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const MAX_ATTEMPTS = 5; // Número máximo de intentos antes de bloquear
const BLOCK_TIME = 15 * 60; // Tiempo de bloqueo en segundos (15 minutos)

// Función para verificar si el usuario está bloqueado
async function isBlocked(identifier) {
  const blocked = await redis.get(`blocked:${identifier}`);
  return blocked !== null;
}

// Función para registrar intentos fallidos
async function registerFailedAttempt(identifier) {
  const attempts = await redis.incr(`attempts:${identifier}`);

  if (attempts === 1) {
    await redis.expire(`attempts:${identifier}`, BLOCK_TIME);
  }

  if (attempts >= MAX_ATTEMPTS) {
    await redis.set(`blocked:${identifier}`, "true", "EX", BLOCK_TIME);
    await redis.del(`attempts:${identifier}`);
  }
}

// Función para restablecer intentos fallidos después de un inicio de sesión exitoso
async function resetAttempts(identifier) {
  await redis.del(`attempts:${identifier}`);
}

router.post("/", async (req, res) => {
  const { identifier, password } = req.body; // "identifier" puede ser email o username

  if (!identifier || !password) {
    return res.status(400).send("Faltan datos requeridos: identifier y password");
  }

  // Verificar si el usuario está bloqueado
  if (await isBlocked(identifier)) {
    return res.status(403).send("Cuenta bloqueada temporalmente. Intenta más tarde.");
  }

  let query = identifier.includes("@") 
    ? "SELECT * FROM usuario WHERE Email = ?" 
    : "SELECT * FROM usuario WHERE Nombre_Usuario = ?";

  db.query(query, [identifier], async (err, result) => {
    if (err) {
      console.error("Error al obtener el usuario:", err);
      return res.status(500).send("Error interno del servidor");
    }

    if (result.length === 0) {
      await registerFailedAttempt(identifier); // Registrar intento fallido
      return res.status(404).send("Usuario no encontrado");
    }

    const user = result[0];

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.Contrasena);

    if (!passwordMatch) {
      await registerFailedAttempt(identifier); // Registrar intento fallido
      return res.status(401).send("Contraseña incorrecta");
    }

    // Restablecer intentos fallidos si el inicio de sesión es exitoso
    await resetAttempts(identifier);

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
