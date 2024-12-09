const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Actualizar receta de cena
router.put("/cena/:id", (req, res) => {
    const { id } = req.params;
    const { fecha, idRecetaCena, idUsuarioModif } = req.body;
  
    if (!fecha || !idRecetaCena || !idUsuarioModif) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
  
    const query = `
      UPDATE recetas_dia
      SET Fecha = ?, Id_Receta_Cena = ?, Id_Usuario_Modif = ?, Fecha_Modif = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [fecha, idRecetaCena, idUsuarioModif, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar cena:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Cena actualizada con éxito" });
    });
  });
  
// Eliminar (borrar lógico) receta de desayuno
router.delete("/cena/:id", (req, res) => {
    const { id } = req.params;
    const { idUsuarioBaja } = req.body;
  
    if (!idUsuarioBaja) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
  
    const query = `
      UPDATE recetas_dia
      SET Id_Receta_Cena = NULL, Id_Usuario_Baja = ?, Fecha_Baja = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [idUsuarioBaja, id], (err, result) => {
      if (err) {
        console.error("Error al eliminar cena:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Cena eliminada" });
    });
  });
  module.exports = router;