const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("./connection");
const validator = require("validator");
const xss = require("xss");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

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

const front = process.env.FRONTEND_URL;

router.post("/", sanitizeInput, (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: "Debe proporcionar un correo o nombre de usuario" });
  }

  let query = "SELECT Id_Usuario, Email FROM usuario WHERE Email = ? OR Nombre_Usuario = ?";
  let values = [email, username];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = result[0].Id_Usuario;
    const userEmail = result[0].Email;
    const resetToken = uuidv4();
    const expirationTime = new Date(Date.now() + 3600000); // Token válido por 1 hora

    const tokenQuery = "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
    db.query(tokenQuery, [userId, resetToken, expirationTime], (tokenErr) => {
      if (tokenErr) {
        console.error("Error al almacenar el token:", tokenErr);
        return res.status(500).json({ message: "Error al generar el token" });
      }

      const resetLink = `${front}/reset-password?token=${resetToken}`;
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Recuperación de Contraseña",
        html: `<p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
               <a href="${resetLink}">Restablecer Contraseña</a>`,
      }, (error) => {
        if (error) {
          console.error("Error al enviar correo:", error);
          return res.status(500).json({ message: "No se pudo enviar el correo" });
        }
        res.json({ message: "Correo de recuperación enviado" });
      });
    });
  });
});

router.post("/password", sanitizeInput, async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Se requiere el token y la nueva contraseña" });
  }

  if (newPassword.length < 8 || !/[A-Z]{2,}/.test(newPassword) || !/[a-z]{2,}/.test(newPassword) || !/[0-9]{2,}/.test(newPassword)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números" });
  }

  db.query("SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()", [token], async (err, result) => {
    if (err) {
      console.error("Error al validar el token:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const userId = result[0].user_id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query("UPDATE usuario SET Contrasena = ? WHERE Id_Usuario = ?", [hashedPassword, userId], (updateErr) => {
      if (updateErr) {
        console.error("Error al actualizar la contraseña:", updateErr);
        return res.status(500).json({ message: "Error al actualizar la contraseña" });
      }
      
      db.query("DELETE FROM password_reset_tokens WHERE token = ?", [token]); // Eliminar el token después de usarlo
      res.json({ message: "Contraseña actualizada correctamente" });
    });
  });
});

module.exports = router;
