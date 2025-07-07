const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./connection");
const validator = require("validator");
const xss = require("xss");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sanitizeInput = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === "string") {
      req.body[key] = validator.escape(req.body[key]);
      req.body[key] = validator.stripLow(req.body[key], { keep_newlines: false });
      req.body[key] = xss(req.body[key]);
    }
  });
  next();
};

const validatePassword = (password) => {
  if (password.length < 8) return false;
  const uppercase = (password.match(/[A-Z]/g) || []).length;
  const lowercase = (password.match(/[a-z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  return uppercase >= 2 && lowercase >= 2 && numbers >= 2;
};

const front = process.env.FRONTEND_URL;
const back = process.env.BASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Ruta para registrar temporalmente y enviar el correo de confirmación
router.post("/", sanitizeInput, (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 8 caracteres, con mínimo 2 mayúsculas, 2 minúsculas y 2 números",
    });
  }

  const query = `SELECT * FROM usuario WHERE Email = ?;`;
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error al consultar usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Ya existe un usuario con ese correo." });
    }

    // ✅ Crear token JWT con email, username y password (temporal)
    const confirmationToken = jwt.sign({ email, username, password }, JWT_SECRET, { expiresIn: "1h" });
    const confirmationLink = `${back}/registro/confirm/${confirmationToken}`;

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirma tu Registro",
      html: `<p>Hola ${username}, haz clic en el siguiente enlace para confirmar tu registro:</p>
             <a href="${confirmationLink}">Confirmar Registro</a>`,
    }, (error) => {
      if (error) {
        console.error("Error al enviar correo:", error);
        return res.status(500).json({ message: "No se pudo enviar el correo de confirmación" });
      }
      return res.json({ message: "Correo de confirmación enviado" });
    });
  });
});

// ✅ Ruta para confirmar el correo y registrar al usuario en la BD
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, username, password } = decoded;

    const hashedPassword = await bcrypt.hash(password, 10);
    const foto_perfil = `/imagenes/defaultPerfil.png`;

    const query = `
      INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil, Id_Rol, Email)
      VALUES (?, ?, ?, 1, ?)
    `;
    const values = [username, hashedPassword, foto_perfil, email];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al insertar en la base de datos:", err);
        return res.redirect(`${front}/error?message=Error al agregar usuario`);
      }

      console.log("Usuario agregado con éxito:", { id: result.insertId, username, email });
      res.redirect(`${front}/acceder`);
    });
  } catch (error) {
    console.error("Error al verificar token:", error);

    let mensaje = "Token inválido o expirado";
    if (error.name === "TokenExpiredError") {
      mensaje = "Token expirado. Por favor, registra de nuevo.";
    }

    return res.redirect(`${front}/error?message=${encodeURIComponent(mensaje)}`);
  }
});

module.exports = router;
