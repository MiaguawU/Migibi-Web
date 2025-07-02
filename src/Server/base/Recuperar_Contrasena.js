const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("./connection");
const validator = require("validator");
const xss = require("xss");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const util = require("util");
const jwt = require('jsonwebtoken');

dotenv.config();

const queryAsync = util.promisify(db.query).bind(db);

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
const JWT_SECRET = process.env.JWT_SECRET;

//actualizar contraseña
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Validación básica de longitud (puedes agregar más reglas si quieres)
  if (newPassword.length < 8 || !/[A-Z]{2,}/.test(newPassword) || !/[a-z]{2,}/.test(newPassword) || !/[0-9]{2,}/.test(newPassword)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números" });
  }

  try {
    // 🔒 Cifrar la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `
      UPDATE usuario
      SET Contrasena = ?
      WHERE Id_Usuario = ?;
    `;

    const result = await queryAsync(query, [hashedPassword, id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Contraseña actualizada correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
});

router.post("/", sanitizeInput, (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Debe proporcionar un correo o nombre de usuario" });
    }

    let query = "SELECT Id_Usuario, Email FROM usuario WHERE Email = ?";
    let values = [email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }

        if (result.length === 0) {
            // For security, it's often better to send a generic message
            // like "If an account with that email exists, a password reset link has been sent."
            // to prevent email enumeration.
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userId = result[0].Id_Usuario;
        const userEmail = result[0].Email;

        // Create a JWT token with the user ID and an expiration time
        const resetToken = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' }); // Token valid for 1 hour

        const resetLink = `${front}/recuperar?token=${resetToken}`;

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

router.post("/password", sanitizeInput, async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Se requiere el token y la nueva contraseña" });
    }

    // Password policy validation
    if (newPassword.length < 8 || !/[A-Z]{2,}/.test(newPassword) || !/[a-z]{2,}/.test(newPassword) || !/[0-9]{2,}/.test(newPassword)) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo 2 mayúsculas, 2 minúsculas y 2 números" });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query("UPDATE usuario SET Contrasena = ? WHERE Id_Usuario = ?", [hashedPassword, userId], (updateErr) => {
            if (updateErr) {
                console.error("Error al actualizar la contraseña:", updateErr);
                return res.status(500).json({ message: "Error al actualizar la contraseña" });
            }
            // No token deletion needed as it's not stored in the DB
            res.json({ message: "Contraseña actualizada correctamente" });
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Token de restablecimiento de contraseña expirado" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Token de restablecimiento de contraseña inválido" });
        }
        console.error("Error al verificar el token:", error);
        return res.status(500).json({ message: "Error interno del servidor al verificar el token" });
    }
});

module.exports = router;
