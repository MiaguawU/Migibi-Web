const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const validator = require('validator');
const xss = require('xss');
const bcrypt = require('bcrypt');
const axios = require('axios');

const verificarPermisos = (id_usuario, res, callback) => {
  const query = 'SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?';
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos", err);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }

    const rol = parseInt(result[0]?.Id_Rol);
    console.log(`Usuario ${id_usuario} tiene rol:`, rol);

    if (!result.length || rol !== 2) {
      console.log('Acceso denegado a usuario:', id_usuario);
      return res.status(403).json({ error: "Acceso prohibido: No tienes permiso para realizar esta acción" });
    }

    console.log('Acceso permitido a usuario:', id_usuario);
    callback();
  });
};

router.put("/:id", (req, res) => {
  console.log("--- Inicio de la ruta /activar/:id ---");
  const { id } = req.params;
  const { id_usuario } = req.body;

  console.log('Valores recibidos: id =', id, 'id_usuario =', id_usuario);

  // ✅ Convertir a string para validar
  if (!id || !validator.isNumeric(String(id))) {
    console.log("Error: ID de usuario a activar inválido.");
    return res.status(400).json({ error: "ID de usuario a activar inválido." });
  }

  if (!id_usuario || !validator.isNumeric(String(id_usuario))) {
    console.log("Error: ID del usuario administrador inválido.");
    return res.status(400).json({ error: "ID del usuario administrador inválido." });
  }

  console.log('Pasó validación inicial. Llamando a verificarPermisos...');

  verificarPermisos(id_usuario, res, () => {
    console.log('Dentro del callback de verificarPermisos.');

    const fecha_baja = new Date();
    const query = `UPDATE usuario SET Activo = 1 WHERE Id_Usuario = ?`;

    db.query(query, [ id], (err) => {
      if (err) {
        console.error("Error al activar usuario:", err);
        return res.status(500).json({ error: "Error al activar usuario" });
      }

      console.log(`Usuario con ID ${id} activado con éxito en la base de datos.`);
      res.json({ message: `Usuario con ID ${id} activado con éxito` });
    });
  });
});

module.exports = router;
