const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Crear un nuevo detalle de receta (POST)
router.post("/", (req, res) => {
    // Desestructuración de los datos del body
    const { id_alimento, cantidad, Id_Usuario_Alta, Fecha_Alta, id_unidad } = req.body;
    const  id_receta = 1; //id temporal para despues agregar el verdadero
    console.log("Headers:", req.headers); 
    console.log("Body recibido:", req.body);

    // Validar que los campos requeridos estén presentes
    if (!id_alimento || !cantidad) {
      return res.status(400).send("Faltan datos requeridos");
    }

    // Consulta de inserción en la tabla `receta_detalle`
    const query = `
      INSERT INTO receta_detalle (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [id_receta ,id_alimento,  id_unidad ,cantidad, Id_Usuario_Alta, Fecha_Alta];

    // Ejecutar la consulta para insertar el detalle en `receta_detalle`
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al insertar en receta_detalle:", err);
        return res.status(500).send("Error al agregar ingrediente");
      }
      res.json({ id: result.insertId, message: "Ingrediente agregado con éxito" });
    });
});


// Obtener un detalle de receta específico por ID 
router.get("/:id", (req, res) => {
    const { id } = req.params;
    //id_receta
    //id_receta_detalle
    //nombreAlimento
    //cantidad
    const query = `
        SELECT 
        rd.Id_Receta_Detalle AS id,
        ca.Alimento AS Nombre,
        rd.Cantidad AS Cantidad,
        rd.Id_Receta AS id_receta
      FROM receta_detalle rd
      LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
      WHERE rd.Id_Receta = ?
      ORDER BY ca.Alimento ASC;`;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error al obtener el detalle de receta:", err);
        return res.status(500).send("Error al obtener el detalle");
      }
      if (result.length === 0) {
        return res.status(404).send("Detalle de receta no encontrado");
      }
      res.json(result[0]);
    });
});

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

// Eliminar un detalle de receta (DELETE)
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM receta_detalle WHERE Id_Receta = ?";
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar el detalle de receta:", err);
        return res.status(500).send("Error al eliminar el ingrediente");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Detalle de receta no encontrado");
      }
      res.json({ message: "Ingrediente eliminado con éxito" });
    });
});

module.exports = router;
