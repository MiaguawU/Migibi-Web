const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();


router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    const query1 = 'SELECT * FROM cat_alimento WHERE Id_Alimento = ?';
    const query2 = 'SELECT * FROM stock_detalle WHERE Id_Alimento = ?';

    //necesitamos la fecha de caducidad, el  nombre del alimento, si es perecedero o no 
    //y el id de (alimento y stock_detalle)
    //ordenar de forma creciente conforme a las fechas (mas dias mas abajo) desde hoy
    //obtener la fecha de hoy
  
    db.query(query1, [id], (err, result1) => {
      if (err || result1.length === 0) {
        return res.status(404).send("Alimento no encontrado");
      }
  
      db.query(query2, [id], (err2, result2) => {
        if (err2) {
          return res.status(500).send("Error al consultar stock");
        }
  
        res.json({ alimento: result1[0], stock: result2 });
      });
    });
  });

  module.exports = router;