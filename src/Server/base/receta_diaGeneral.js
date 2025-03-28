const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const Joi = require("joi");
const { FechaSQL} = require("./FechaActual");
const router = express.Router();

// Esquema de validación con Joi
const existePlanSchema = Joi.object({
  Id_Usuario_Alta: Joi.number().required(),
  Fecha: Joi.string().required(),
});

// Crear un nuevo registro de recetas del día
router.post("/:Id_Usuario_Alta", (req, res) => {
  
  const { Id_Usuario_Alta } = req.params;
  const { Fecha } = req.body;
  
// Validar entrada (fusionando params y body)
const { error } = existePlanSchema.validate({
  Id_Usuario_Alta: Number(Id_Usuario_Alta),
  Fecha: Fecha,
});

if (error) {
  console.log("Error al validar:", error);
  return res.status(400).json({ error: error.details[0].message });
}

    // Manejo de la fecha de caducidad
    let FechaR = null;
    let date = new Date(Fecha);
    FechaR = date.toISOString().slice(0, 19).replace("T", " ");

  let query = `INSERT INTO recetas_dia (Fecha, Activo, Id_Usuario_Alta, Fecha_Alta) VALUES ("${FechaR}", 1, ${Id_Usuario_Alta}, now() );`;
  // Ejecutar la consulta
  db.query(query, [Id_Usuario_Alta, FechaR], (err, result) => {
    if (err) {
      console.error("Error al crear receta del día:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    res.json({ id: result.insertId, message: "Receta del día creada con éxito" });
  });
});

// Obtener receta(s) (GET)
router.get("/", (req, res) => {

  let query = `
SELECT 
    rd.Id_Recetas_Dia,
    rd.Fecha,
    d.Id_Receta AS Id_Receta_Desayuno, 
    d.Nombre AS Nombre_Desayuno, 
    d.Porciones AS Porciones_Desayuno,
    d.Calorias AS Calorias_Desayuno,
    d.Tiempo AS Tiempo_Desayuno,
    d.Imagen_receta AS Imagen_Desayuno,
    d.Activo AS Activo_Desayuno,
    c.Id_Receta AS Id_Receta_Comida, 
    c.Nombre AS Nombre_Comida,  
    c.Porciones AS Porciones_Comida,
    c.Calorias AS Calorias_Comida,
    c.Tiempo AS Tiempo_Comida,
    c.Imagen_receta AS Imagen_Comida,
    c.Activo AS Activo_Comida,
    ce.Id_Receta AS Id_Receta_Cena, 
    ce.Nombre AS Nombre_Cena,  
    ce.Porciones AS Porciones_Cena,
    ce.Calorias AS Calorias_Cena,
    ce.Tiempo AS Tiempo_Cena,
    ce.Imagen_receta AS Imagen_Cena,
    ce.Activo AS Activo_Cena
FROM 
    recetas_dia rd
LEFT JOIN receta d ON rd.Id_Receta_Desayuno = d.Id_Receta
LEFT JOIN receta c ON rd.Id_Receta_Comida = c.Id_Receta
LEFT JOIN receta ce ON rd.Id_Receta_Cena = ce.Id_Receta
WHERE 
    WEEK(rd.Fecha) = WEEK(CURDATE()) AND YEAR(rd.Fecha) = YEAR(CURDATE());`;
  
  // Ejecutar la consulta
  db.query(query, (err, result) => {
   
    if (err) {
      console.error("Error al obtener plan:", err);
      return res.status(500).send("Error al obtener plan");
    }
    console.log("Este es el plan");
    console.log(result);
    res.json(result);
  });
});

// Obtener receta(s) (GET)
router.post("/agregarPlan/:Id_Usuario_Alta", (req, res) => {

  const { Id_Usuario_Alta } = req.params;
  const { Fecha } = req.body;
  
// Validar entrada (fusionando params y body)
const { error } = existePlanSchema.validate({
  Id_Usuario_Alta: Number(Id_Usuario_Alta),
  Fecha: Fecha,
});

if (error) {
  console.log("Error al validar:", error);
  return res.status(400).json({ error: error.details[0].message });
}

    // Manejo de la fecha de caducidad
    let FechaR = null;
    let date = new Date(Fecha);
    FechaR = date.toISOString().slice(0, 19).replace("T", " ");
    if (Fecha) {
      try {
        FechaR= FechaSQL(FechaR);
      } catch (parseError) {
        console.log(parseError);
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }
    }

  let query = `SELECT * FROM recetas_dia where Id_Usuario_Alta = ${Id_Usuario_Alta} and ${FechaR};`;
  // Ejecutar la consulta
  db.query(query, [Id_Usuario_Alta, FechaR], (err, result) => {
   
    if (err) {
      console.error("Error al obtener plan:", err);
      return res.status(500).send("Error al obtener plan");
    }
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
