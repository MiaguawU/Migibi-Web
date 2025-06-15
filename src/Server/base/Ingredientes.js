const express = require('express'); 
const db = require('./connection');
const router = express.Router();
const Joi = require('joi');
const util = require("util");

// Asincronizar consultas de la base de datos
const queryAsync = util.promisify(db.query).bind(db);

// Esquema de validación con Joi
const recetaDetalleSchema = Joi.object({
    id_alimento: Joi.number().integer().required(),
    cantidad: Joi.number().positive().required(),
    id_unidad: Joi.number().integer().required(),
    Id_Usuario_Alta: Joi.number().integer().required(),
    Fecha_Alta: Joi.date().iso().required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().required()
});

// Crear un nuevo detalle de receta (POST)
router.post("/", (req, res) => {
    const { error } = recetaDetalleSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const { id_alimento, cantidad, Id_Usuario_Alta, Fecha_Alta, id_unidad } = req.body;
    const id_receta = 1; // ID temporal

    const query = `
        INSERT INTO receta_detalle (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [id_receta, id_unidad, cantidad, id_alimento, Id_Usuario_Alta, Fecha_Alta];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).send("Error al agregar ingrediente");
        res.json({ id: result.insertId, message: "Ingrediente agregado con éxito" });
    });
});

router.get("/:id/:id_usu", async (req, res) => {
  const { id, id_usu } = req.params;

  try {
    // Obtener autor de la receta
    const recetaAutorRes = await queryAsync(
      `SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`,
      [id]
    );

    if (recetaAutorRes.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

    // Obtener rol del usuario que intenta acceder
    const usuarioRes = await queryAsync(
      `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`,
      [id_usu]
    );

    if (usuarioRes.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const rol = usuarioRes[0].Id_Rol;

    // Verificar permisos:
    const esAutor = parseInt(id_usu) === idAutor;
    const esAdmin = rol === 2;
    const recetaEsPublica = idAutor === 1;

    if (!esAutor && !esAdmin && !recetaEsPublica) {
      console.log("Acceso denegado, sin permisos");
      return res.status(403).json({ error: "Acceso denegado, sin permisos" });
    }

    // Obtener datos de la receta
    const query1 = `
      SELECT 
            ca.Alimento AS Nombre,
            rd.Cantidad AS Cantidad,
            cu.Abreviatura AS Unidad,  
            rd.Id_Receta_Detalle AS id,
            rd.Activo AS Activo
        FROM receta_detalle rd
        LEFT JOIN cat_alimento ca ON rd.Id_Alimento = ca.Id_Alimento
        LEFT JOIN cat_unidad_medida cu ON rd.Id_Unidad_Medida = cu.Id_Unidad_Medida
        WHERE rd.Id_Receta = ?
        ORDER BY ca.Alimento ASC;
    `;

    const recetaInfo = await queryAsync(query1, [id]);

    if (recetaInfo.length === 0) {
      return res.status(404).json({ error: "Ingredientes no encontrados" });
    }

    res.json(recetaInfo);

  } catch (err) {
    console.error("Error al obtener ingredientes:", err);
    res.status(500).send("Error al obtener ingredientes");
  }
});


// Actualizar un detalle de receta (PUT)
router.put("/:id", (req, res) => {
    const { error: paramError } = idSchema.validate(req.params);
    if (paramError) return res.status(400).send(paramError.details[0].message);
    
    const { error: bodyError } = recetaDetalleSchema.validate(req.body);
    if (bodyError) return res.status(400).send(bodyError.details[0].message);

    const { id } = req.params;
    const { id_alimento, cantidad, id_unidad, Id_Usuario_Alta, Fecha_Alta } = req.body;

    const query = `
        UPDATE receta_detalle
        SET Id_Alimento = ?, Cantidad = ?, Id_Unidad_Medida = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
        WHERE Id_Receta = ?
    `;
    const values = [id_alimento, cantidad, id_unidad, Id_Usuario_Alta, Fecha_Alta, id];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).send("Error al actualizar el ingrediente");
        if (result.affectedRows === 0) return res.status(404).send("Detalle de receta no encontrado");
        res.json({ message: "Ingrediente actualizado con éxito" });
    });
});

// Eliminar un detalle de receta (DELETE)
router.delete("/:id", (req, res) => {
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).send(error.details[0].message);
    
    const { id } = req.params;
    const query = "DELETE FROM receta_detalle WHERE Id_Receta = ?";
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send("Error al eliminar el ingrediente");
        if (result.affectedRows === 0) return res.status(404).send("Detalle de receta no encontrado");
        res.json({ message: "Ingrediente eliminado con éxito" });
    });
});

module.exports = router;
