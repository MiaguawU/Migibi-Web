const express = require('express');
const db = require('./connection');
const router = express.Router();

// Crear un nuevo detalle de receta (POST)
router.post("/", (req, res) => {
  const { id_receta, id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, id_alimento } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_unidad_medida || !cantidad || !id_usuario_alta || !fecha_alta || !id_alimento) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar un nuevo detalle de receta
  const query = `
    INSERT INTO receta_detalle (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Usuario_Alta, Fecha_Alta, Id_Alimento) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [id_receta, id_unidad_medida, cantidad, id_usuario_alta, fecha_alta, id_alimento];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar detalle de receta:", err);
      return res.status(500).send("Error al agregar detalle de receta");
    }

    // Responder con el ID del nuevo detalle de receta
    res.json({ id: result.insertId, message: "Detalle de receta agregado con éxito" });
  });
});

// Obtener detalles de receta por receta (GET)
router.get("/receta/:id_receta", (req, res) => {
  const { id_receta } = req.params;

  // Consulta para obtener los detalles de la receta por ID de receta
  const query = `
    SELECT * FROM receta_detalle 
    WHERE Id_Receta = ? AND Activo = 1
  `;
  db.query(query, [id_receta], (err, result) => {
    if (err) {
      console.error("Error al obtener detalles de receta:", err);
      return res.status(500).send("Error al obtener detalles de receta");
    }

    // Devolver los detalles de la receta
    res.json(result);
  });
});

// Actualizar un detalle de receta (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_receta, id_unidad_medida, cantidad, id_usuario_modif, fecha_modif, id_alimento, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !id_unidad_medida || !cantidad || !id_usuario_modif || !fecha_modif || !id_alimento || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar un detalle de receta
  const query = `
    UPDATE receta_detalle 
    SET Id_Receta = ?, Id_Unidad_Medida = ?, Cantidad = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Id_Alimento = ?, Activo = ?
    WHERE Id_Receta_Detalle = ?
  `;
  const values = [id_receta, id_unidad_medida, cantidad, id_usuario_modif, fecha_modif, id_alimento, activo, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar detalle de receta:", err);
      return res.status(500).send("Error al actualizar detalle de receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Detalle de receta actualizado con éxito" });
  });
});

// Eliminar un detalle de receta (marcarlo como inactivo) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar el detalle de receta como inactivo (baja lógica)
  const query = `
    UPDATE receta_detalle 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Receta_Detalle = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar detalle de receta:", err);
      return res.status(500).send("Error al eliminar detalle de receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Detalle de receta eliminado con éxito" });
  });
});

module.exports = router;
