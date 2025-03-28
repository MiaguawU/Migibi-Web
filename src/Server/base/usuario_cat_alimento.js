const express = require('express');
const db = require('./connection');
const router = express.Router();

// Crear una relación usuario-alimento (POST)
router.post("/", (req, res) => {
  const { id_usuario, id_alimento, puede_comer } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario || !id_alimento || (puede_comer === undefined)) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar la relación usuario-alimento
  const query = `
    INSERT INTO usuario_cat_alimento (Id_Usuario, Id_Alimento, Puede_Comer) 
    VALUES (?, ?, ?)
  `;
  const values = [id_usuario, id_alimento, puede_comer];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar relación usuario-alimento:", err);
      return res.status(500).send("Error al agregar relación usuario-alimento");
    }

    // Responder con el ID del nuevo registro
    res.json({ id: result.insertId, message: "Relación usuario-alimento agregada con éxito" });
  });
});

// Obtener todas las relaciones usuario-alimento (GET)
router.get("/", (req, res) => {
  // Consulta para obtener todas las relaciones usuario-alimento
  const query = `
    SELECT * FROM usuario_cat_alimento
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener relaciones usuario-alimento:", err);
      return res.status(500).send("Error al obtener relaciones usuario-alimento");
    }

    // Devolver todas las relaciones
    res.json(result);
  });
});

// Obtener las relaciones de un usuario específico (GET)
router.get("/usuario/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;

  // Consulta para obtener las relaciones de un usuario por su ID
  const query = `
    SELECT * FROM usuario_cat_alimento 
    WHERE Id_Usuario = ?
  `;
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al obtener las relaciones del usuario:", err);
      return res.status(500).send("Error al obtener las relaciones del usuario");
    }

    if (result.length === 0) {
      return res.status(404).send("No se encontraron relaciones para este usuario");
    }

    // Devolver las relaciones del usuario
    res.json(result);
  });
});

// Actualizar la relación usuario-alimento (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { puede_comer } = req.body;

  // Validar que los campos requeridos estén presentes
  if (puede_comer === undefined) {
    return res.status(400).send("Falta el campo 'puede_comer'");
  }

  // Consulta para actualizar la relación usuario-alimento
  const query = `
    UPDATE usuario_cat_alimento 
    SET Puede_Comer = ? 
    WHERE Id_Usuario_Cat_Alimento = ?
  `;
  const values = [puede_comer, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar la relación usuario-alimento:", err);
      return res.status(500).send("Error al actualizar la relación usuario-alimento");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Relación usuario-alimento actualizada con éxito" });
  });
});

// Eliminar la relación usuario-alimento (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para eliminar la relación usuario-alimento
  const query = `
    DELETE FROM usuario_cat_alimento 
    WHERE Id_Usuario_Cat_Alimento = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar la relación usuario-alimento:", err);
      return res.status(500).send("Error al eliminar la relación usuario-alimento");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Relación usuario-alimento eliminada con éxito" });
  });
});

module.exports = router;
