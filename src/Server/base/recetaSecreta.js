const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();


router.get("/", (req, res) => {
    const query = `
      SELECT Id_Receta 
      FROM receta 
      ORDER BY Id_Receta DESC 
      LIMIT 1
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al obtener el último ID:", err);
        return res.status(500).send("Error al obtener recetas");
      }
  
      if (result.length === 0) {
        return res.status(404).send("No se encontraron recetas");
      }
  
      res.json({ id: result[0].Id_Receta });
    console.log("ID enviado al cliente:", result[0].Id_Receta);  // Verifica lo que el servidor envía

    });
  });
  



module.exports = router;
