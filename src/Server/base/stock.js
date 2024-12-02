const express = require('express');
const db = require('./connection');
const router = express.Router();

// Crear un nuevo registro en el stock (POST)
router.post("/", (req, res) => {
  const { id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar un nuevo registro en stock
  const query = `
    INSERT INTO stock (Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?)
  `;
  const values = [id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar stock:", err);
      return res.status(500).send("Error al agregar stock");
    }

    // Responder con el ID del nuevo registro
    res.json({ id: result.insertId, message: "Stock agregado con éxito" });
  });
});

// Obtener todos los registros de stock activos (GET)
router.get("/", (req, res) => {
  // Consulta para obtener todos los registros de stock activos
  const query = `
    SELECT * FROM stock 
    WHERE Activo = 1
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener registros de stock:", err);
      return res.status(500).send("Error al obtener registros de stock");
    }

    // Devolver todos los registros activos
    res.json(result);
  });
});

// Obtener un registro de stock por ID (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para obtener el registro de stock por ID
  const query = `
    SELECT * FROM stock 
    WHERE Id_Stock = ? AND Activo = 1
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el registro de stock:", err);
      return res.status(500).send("Error al obtener el registro de stock");
    }

    if (result.length === 0) {
      return res.status(404).send("Registro de stock no encontrado");
    }

    // Devolver el registro de stock
    res.json(result[0]);
  });
});

// Actualizar un registro de stock (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_modif, fecha_modif } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_modif || !fecha_modif) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar el registro de stock
  const query = `
    UPDATE stock 
    SET Id_Usuario_Modif = ?, Fecha_Modif = ?
    WHERE Id_Stock = ?
  `;
  const values = [id_usuario_modif, fecha_modif, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar el stock:", err);
      return res.status(500).send("Error al actualizar el stock");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Stock actualizado con éxito" });
  });
});

// Eliminar un registro de stock (marcar como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar el registro de stock como inactivo (baja lógica)
  const query = `
    UPDATE stock 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ?
    WHERE Id_Stock = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar el stock:", err);
      return res.status(500).send("Error al eliminar el stock");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Stock eliminado con éxito" });
  });
});

module.exports = router;
