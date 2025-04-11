const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();
const { FechaActual} = require("./FechaActual");

// Crear un nuevo registro de recetas del día
router.post("/:id", (req, res) => {
    const { id_usuario_alta } = req.body;
    const { id } = req.params;

  const query = `
    INSERT INTO recetas_dia (Fecha, Activo, Id_Usuario_Alta, Fecha_Alta)
    VALUES (NOW(), 1, ?, NOW())
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al crear receta del día:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    res.json({ id: result.insertId, message: "Receta del día creada con éxito" });
  });
});

// Obtener receta(s) (GET)
router.get("/:id", (req, res) => {
    const { id } = req.params;

  let query = `
SELECT 
    rd.Id_Recetas_Dia,
    rd.Id_Usuario_Alta,
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
    rd.Id_Usuario_Alta = ? AND ${FechaActual()}`;
  
  // Ejecutar la consulta
  db.query(query, [id],  (err, result) => {
    console.log (query);
    if (err) {
      console.error("Error al obtener plan:", err);
      return res.status(500).send("Error al obtener plan");
    }
    console.log("Este es el hoy");
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
