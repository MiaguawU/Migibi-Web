const express = require('express');
const db = require('./connection');
const router = express.Router();
const Joi = require("joi");
const util = require("util");

// Asincronizar consultas de la base de datos
const queryAsync = util.promisify(db.query).bind(db);

// Esquema de validación con Joi
const recetaInstruccionSchema = Joi.object({
  id_receta: Joi.number().integer().required(),
  instruccion: Joi.string().trim().min(3).required(),
  orden: Joi.number().integer().min(1).required(),
  Id_Usuario_Alta: Joi.number().integer().required(),
  Fecha_Alta: Joi.date().iso().required()
});

// Esquema para actualizar
const updateSchema = Joi.object({
  instruccion: Joi.string().trim().min(3).required(),
  orden: Joi.number().integer().min(1).required(),
  Id_Usuario_Alta: Joi.number().integer().required(),
  Fecha_Alta: Joi.date().iso().required()
});

// Crear una nueva instrucción de una receta
router.post("/", (req, res) => {
  const id_receta = 1; // Temporal, reemplazar con el real

  // Validar con Joi
  const { error, value } = recetaInstruccionSchema.validate({ ...req.body, id_receta });
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { instruccion, orden, Id_Usuario_Alta, Fecha_Alta } = value;

  const query = `
    INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [id_receta, instruccion, orden, Id_Usuario_Alta, Fecha_Alta], (err, result) => {
    if (err) {
      console.error("Error al insertar instrucción:", err);
      return res.status(500).send("Error al agregar instrucción");
    }
    res.json({ id: result.insertId, message: "Instrucción agregada con éxito" });
  });
});

// Obtener todas las instrucciones de una receta específica
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
      ri.Instruccion AS Nombre,
      ri.Orden AS Orden,
      ri.Id_Receta_Instrucciones AS id,
      ri.Activo AS Activo
    FROM receta_instrucciones ri
    WHERE ri.Id_Receta = ?
    ORDER BY ri.Orden ASC;
    `;

    const recetaInfo = await queryAsync(query1, [id]);

    if (recetaInfo.length === 0) {
      return res.status(404).json({ error: "Procedimiento no encontrado" });
    }

    res.json(recetaInfo);

  } catch (err) {
    console.error("Error al obtener procedimiento:", err);
    res.status(500).send("Error al obtener procedimiento");
  }
});


// Actualizar una instrucción de receta
router.put("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { instruccion, orden, Id_Usuario_Alta, Fecha_Alta } = value;

  const query = `
    UPDATE receta_instrucciones
    SET Instruccion = ?, Orden = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
    WHERE Id_Receta_Instrucciones = ?
  `;
  db.query(query, [instruccion, orden, Id_Usuario_Alta, Fecha_Alta, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la instrucción:", err);
      return res.status(500).send("Error al actualizar la instrucción");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Instrucción no encontrada");
    }
    res.json({ message: "Instrucción actualizada con éxito" });
  });
});

// Eliminar una instrucción de receta
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).send("ID inválido");

  const query = "DELETE FROM receta_instrucciones WHERE Id_Receta_Instrucciones = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar la instrucción:", err);
      return res.status(500).send("Error al eliminar la instrucción");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Instrucción no encontrada");
    }
    res.json({ message: "Instrucción eliminada con éxito" });
  });
});

module.exports = router;
