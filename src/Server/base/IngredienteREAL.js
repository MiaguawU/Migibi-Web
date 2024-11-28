const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();



// Actualizar un detalle de receta (PUT)
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { id_alimento, cantidad, id_unidad, Id_Usuario_Alta, Fecha_Alta } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!id_alimento || !cantidad || !id_unidad) {
      return res.status(400).send("Faltan datos requeridos");
    }

    // Consulta para actualizar el detalle de receta
    const query = `
      UPDATE receta_detalle
      SET Id_Alimento = ?, Cantidad = ?, Id_Unidad_Medida = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
      WHERE Id_Receta = ?
    `;
    const values = [id_alimento, cantidad, id_unidad, Id_Usuario_Alta, Fecha_Alta, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar el detalle de receta:", err);
        return res.status(500).send("Error al actualizar el ingrediente");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Detalle de receta no encontrado");
      }
      res.json({ message: "Ingrediente actualizado con éxito" });
    });
});


module.exports = router;
