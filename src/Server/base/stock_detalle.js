const express = require('express');
const db = require('./connection');
const router = express.Router();

// Crear un nuevo detalle de stock (POST)
router.post("/", (req, res) => {
  const { id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, total, cantidad_consumida, fecha_caducidad, es_perecedero, id_alimento, id_stock } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_unidad_medida || !cantidad || !id_usuario_alta || !fecha_alta || !total || !cantidad_consumida || !id_alimento) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar un nuevo detalle de stock
  const query = `
    INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Id_Usuario_Alta, Fecha_Alta, Total, Cantidad_Consumida, Fecha_Caducidad, Es_Perecedero, Id_Alimento, Id_Stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, total, cantidad_consumida, fecha_caducidad, es_perecedero, id_alimento, id_stock];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar detalle de stock:", err);
      return res.status(500).send("Error al agregar detalle de stock");
    }

    // Responder con el ID del nuevo registro
    res.json({ id: result.insertId, message: "Detalle de stock agregado con éxito" });
  });
});

// Obtener todos los detalles de stock activos (GET)
router.get("/", (req, res) => {
  // Consulta para obtener todos los detalles de stock activos
  const query = `
    SELECT * FROM stock_detalle 
    WHERE Activo = 1
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener detalles de stock:", err);
      return res.status(500).send("Error al obtener detalles de stock");
    }

    // Devolver todos los registros activos
    res.json(result);
  });
});

// Obtener un detalle de stock específico por ID (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Consulta para obtener el detalle de stock por ID
  const query = `
    SELECT * FROM stock_detalle 
    WHERE Id_Stock_Detalle = ? AND Activo = 1
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el detalle de stock:", err);
      return res.status(500).send("Error al obtener el detalle de stock");
    }

    if (result.length === 0) {
      return res.status(404).send("Detalle de stock no encontrado");
    }

    // Devolver el detalle de stock
    res.json(result[0]);
  });
});

// Actualizar un detalle de stock (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_modif, fecha_modif, cantidad, total, cantidad_consumida, fecha_caducidad, es_perecedero } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_modif || !fecha_modif || !cantidad || !total || !cantidad_consumida || es_perecedero === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar el detalle de stock
  const query = `
    UPDATE stock_detalle 
    SET Id_Usuario_Modif = ?, Fecha_Modif = ?, Cantidad = ?, Total = ?, Cantidad_Consumida = ?, Fecha_Caducidad = ?, Es_Perecedero = ?
    WHERE Id_Stock_Detalle = ?
  `;
  const values = [id_usuario_modif, fecha_modif, cantidad, total, cantidad_consumida, fecha_caducidad, es_perecedero, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar el detalle de stock:", err);
      return res.status(500).send("Error al actualizar el detalle de stock");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Detalle de stock actualizado con éxito" });
  });
});

// Eliminar un detalle de stock (marcar como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar el detalle de stock como inactivo (baja lógica)
  const query = `
    UPDATE stock_detalle 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ?
    WHERE Id_Stock_Detalle = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar el detalle de stock:", err);
      return res.status(500).send("Error al eliminar el detalle de stock");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Detalle de stock eliminado con éxito" });
  });
});

module.exports = router;
