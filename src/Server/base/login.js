const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./connection");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const redis = new Redis(); // Asegúrate de tener Redis corriendo

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60; // 15 minutos

async function isBlocked(identifier) {
  const blocked = await redis.get(`blocked:${identifier}`);
  return blocked !== null;
}

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

async function resetAttempts(identifier) {
  await redis.del(`attempts:${identifier}`);
}

router.post("/", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).send("Faltan datos requeridos: identifier y password");
  }

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
      await registerFailedAttempt(identifier);
      return res.status(404).send("Usuario no encontrado");
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.Contrasena);

    if (!passwordMatch) {
      await registerFailedAttempt(identifier);
      return res.status(401).send("Contraseña incorrecta");
    }

    await resetAttempts(identifier);

    // 🔔 Enviar correo de notificación de inicio de sesión
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.Email,
      subject: "Inicio de sesión en Migibi Eats",
      html: `
        <p>Hola ${user.Nombre_Usuario},</p>
        <p>Alguien ha iniciado sesión en tu cuenta de <strong>Migibi Eats</strong>.</p>
        <p>Si no fuiste tú, por favor <strong>contacta con soporte inmediatamente</strong>.</p>
        <p>Gracias por usar nuestra app.</p>
        <p>Ya que esta utilizando migibi eats, le pedimos por favor que lea los terminos</p>
        <p>y condiciones de nustro servicio y los de la plataforma fatsecret, en caso de que no cumpla,</p>
        <p>la responsabilidad cae en usted.</p>
        <a href="https://platform.fatsecret.com/terms">Fatsecret</a>
        <a href="http://localhost:3000/">Migibi eats</a>
        <hr/>
        <small>Este correo se envió automáticamente para tu seguridad.</small>
      `,
    }, (error, info) => {
      if (error) {
        console.error("Error al enviar correo de inicio de sesión:", error);
      } else {
        console.log("Correo de inicio de sesión enviado:", info.response);
      }
    });

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
