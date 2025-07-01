const express = require("express");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./connection");
const validator = require("validator");
const xss = require("xss");
const bcrypt = require("bcrypt");

dotenv.config();

const router = express.Router();
let tempDatabase = {}; // Base de datos temporal para almacenar registros

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para sanitizar entradas
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

// Validación de contraseña
const validatePassword = (password) => {
  if (password.length < 8) return false;
  const uppercase = (password.match(/[A-Z]/g) || []).length;
  const lowercase = (password.match(/[a-z]/g) || []).length;
  const numbers = (password.match(/[0-9]/g) || []).length;
  return uppercase >= 2 && lowercase >= 2 && numbers >= 2;
};

const front = process.env.FRONTEND_URL;
const back = process.env.BASE_URL;

// Ruta para registrar temporalmente y enviar el correo de confirmación
router.post("/", sanitizeInput, (req, res) => {
  const { email, username, password } = req.body;
  console.log("Datos recibidos en req.body:", req.body);

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 8 caracteres, con mínimo 2 mayúsculas, 2 minúsculas y 2 números",
    });
  }

    const query = `select * from usuario where Email = ?;`;
    const values = [email];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al insertar en la base de datos:", err);
        return res.status(400).json({
          message: "Error al consultar usuario.",
        });
      }
      if (result.length > 0) {
        return res.status(409).json({
          message: "Ya existe un usuario con ese correo.",
        });
      }
      const confirmationToken = uuidv4();
      tempDatabase[confirmationToken] = { email, username, password };

      const confirmationLink = `${back}/registro/confirm/${confirmationToken}`;

      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirma tu Registro",
        html: `<p>Hola ${username}, haz clic en el siguiente enlace para confirmar tu registro:</p>
              <a href="${confirmationLink}">Confirmar Registro</a>`,
      });

      return res.json({ message: "Correo de confirmación enviado" });
    });
});

// Ruta para confirmar el correo y registrar el usuario en la BD
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;

  if (!tempDatabase[token]) {
    return res.redirect(`${process.env.FRONTEND_URL}/error?message=Token inválido o expirado`);
  }

  const { email, username, password } = tempDatabase[token];

  // Eliminar de la base de datos temporal
  delete tempDatabase[token];

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const foto_perfil = `/imagenes/defaultPerfil.png`;

    const query = `INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil, Id_Rol, Email) VALUES (?, ?, ?, 1, ?)`;
    const values = [username, hashedPassword, foto_perfil, email];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al insertar en la base de datos:", err);
        return res.redirect(`${process.env.FRONTEND_URL}/error?message=Error al agregar usuario`);
      }

      console.log("Usuario agregado con éxito:", { id: result.insertId, username, email });

      // 🔹 Redirigir al perfil del usuario en el frontend
      res.redirect(`${process.env.FRONTEND_URL}/acceder`);
    });
  } catch (error) {
    console.error("Error al procesar el registro:", error);
    res.redirect(`${process.env.FRONTEND_URL}/error?message=Error interno del servidor`);
  }
});



module.exports = router;
