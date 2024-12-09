const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();


router.get("/", (req, res) => {

  let query = `select Id_Receta
  from receta
 order by Id_Receta desc
 limit 1;`;

  
  db.query(query, (err, result) => {
   
    if (err) {
      console.error("Error al obtener recetas:", err);
      return res.status(500).send("Error al obtener recetas");
    }
    console.log("si salio :3");
    console.log(result);
    res.json(result);
  });
});



module.exports = router;
