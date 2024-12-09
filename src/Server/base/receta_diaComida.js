const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Actualizar receta de comida
router.put("/comida/:id", (req, res) => {
    const { id } = req.params;
    const { fecha, idRecetaComida, idUsuarioModif } = req.body;
  
    if (!fecha || !idRecetaComida || !idUsuarioModif) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
  
    const query = `
      UPDATE recetas_dia
      SET Fecha = ?, Id_Receta_Comida = ?, Id_Usuario_Modif = ?, Fecha_Modif = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [fecha, idRecetaComida, idUsuarioModif, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar comida:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Comida actualizada con éxito" });
    });
  });

// Eliminar (borrar lógico) receta de desayuno
router.delete("/comida/:id", (req, res) => {
    const { id } = req.params;
    const { idUsuarioBaja } = req.body;
  
    if (!idUsuarioBaja) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
  
    const query = `
      UPDATE recetas_dia
      SET Id_Receta_Comida = NULL, Id_Usuario_Baja = ?, Fecha_Baja = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [idUsuarioBaja, id], (err, result) => {
      if (err) {
        console.error("Error al eliminar comida:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Comida eliminada" });
    });
  });
  
module.exports = router;