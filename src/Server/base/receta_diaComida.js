const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const Joi = require("joi");
const router = express.Router();

// Esquema de validación con Joi
const ingredienteSchema = Joi.object({
  Id_Recetas_Dia: Joi.number().required(),
  id_receta: Joi.number().required(),
  Id_Usuario_Alta: Joi.number().required()
});
// Esquema de validación con Joi
const eliminarSchema = Joi.object({
  Id_Recetas_Dia: Joi.number().required(),
  Id_Usuario_Modif: Joi.number().required()
});
// Actualizar receta de desayuno
router.put("/:Id_Recetas_Dia", (req, res) => {
    const { Id_Recetas_Dia } = req.params;
    const { id_receta, Id_Usuario_Alta } = req.body;

  // Validar entrada (fusionando params y body)
  const { error } = ingredienteSchema.validate({
    Id_Recetas_Dia: Number(Id_Recetas_Dia), // Convertir a número
    id_receta,
    Id_Usuario_Alta
  });

  if (error) {
    console.log("Error al validar:", error);
    return res.status(400).json({ error: error.details[0].message });
  }

    const query = `
      UPDATE recetas_dia
      SET Id_Receta_Comida = ?, Id_Usuario_Modif = ?, Fecha_Modif = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [id_receta, Id_Usuario_Alta, Id_Recetas_Dia], (err, result) => {
      if (err) {
        
        console.error("Error al actualizar comida:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Comida actualizado con éxito" });
    });
  });
  
// Eliminar (borrar lógico) receta de desayuno
router.put("/borrar/:Id_Recetas_Dia", (req, res) => {
  const { Id_Recetas_Dia } = req.params;
  const { Id_Usuario_Modif } = req.body;
  
// Validar entrada (fusionando params y body)
const { error } = eliminarSchema.validate({
  Id_Recetas_Dia: Number(Id_Recetas_Dia), // Convertir a número
  Id_Usuario_Modif
});

if (error) {
  console.log("Error al validar:", error);
  return res.status(400).json({ error: error.details[0].message });
}
  
    const query = `
      UPDATE recetas_dia
      SET Id_Receta_Comida = NULL, Id_Usuario_Modif = ?, Fecha_Modif = NOW()
      WHERE Id_Recetas_Dia = ?
    `;
  
    db.query(query, [Id_Usuario_Modif, Id_Recetas_Dia], (err, result) => {
      if (err) {
        console.error("Error al eliminar comida:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
  
      res.json({ message: "Comida eliminado" });
    });
  });
  
  
module.exports = router;