const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Eliminar un alimento
router.put("/:id", (req, res) => {  // Se asume que el id se pasa como parámetro en la URL
    const { id } = req.params;  // Obtener el id de los parámetros de la URL
    console.log("id recibido:", id);

    const query1 = `UPDATE cat_alimento SET Activo = 0 WHERE Id_Alimento = ?`;

    const query = `UPDATE stock_detalle SET Activo = 0 WHERE Id_Alimento = ?`;

    db.query(query1, [id], (err, result1) => {  // Usamos un arreglo para pasar el parámetro correctamente
        if (err) {
          console.log(err);  // Registra el error en consola
          return res.status(500).send("Error al eliminar el alimento");
        }
        db.query(query, [id], (err2,result2)=>{
          if (err2) {
            console.log(err);  // Registra el error en consola
            return res.status(500).send("Error al eliminar el alimento");
          }
          res.json({ id, message: "Alimento eliminado con éxito" });
        console.log("Alimento inactivo");
        });
        
    });
});

module.exports = router;
