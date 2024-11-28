const express = require('express');
const db = require('./connection');
const router = express.Router();

// Crear una nueva instrucción de receta (POST)
router.post("/", (req, res) => {
  const { id_receta, instruccion, orden, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !instruccion || !orden || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar una nueva instrucción de receta
  const query = `
    INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [id_receta, instruccion, orden, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al agregar instrucción de receta:", err);
      return res.status(500).send("Error al agregar instrucción de receta");
    }

    // Responder con el ID de la nueva instrucción de receta
    res.json({ id: result.insertId, message: "Instrucción de receta agregada con éxito" });
  });
});

// Obtener instrucciones de receta por receta (GET)
router.get("/receta/:id_receta", (req, res) => {
  const { id_receta } = req.params;

  // Consulta para obtener las instrucciones de la receta por ID de receta
  const query = `
    SELECT * FROM receta_instrucciones 
    WHERE Id_Receta = ? AND Activo = 1
    ORDER BY Orden
  `;
  db.query(query, [id_receta], (err, result) => {
    if (err) {
      console.error("Error al obtener instrucciones de receta:", err);
      return res.status(500).send("Error al obtener instrucciones de receta");
    }

    // Devolver las instrucciones de la receta
    res.json(result);
  });
});

// Actualizar una instrucción de receta (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_receta, instruccion, orden, id_usuario_modif, fecha_modif } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_receta || !instruccion || !orden || !id_usuario_modif || !fecha_modif) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar una instrucción de receta
  const query = `
    UPDATE receta_instrucciones 
    SET Id_Receta = ?, Instruccion = ?, Orden = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?
    WHERE Id_Receta_Instrucciones = ?
  `;
  const values = [id_receta, instruccion, orden, id_usuario_modif, fecha_modif, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar instrucción de receta:", err);
      return res.status(500).send("Error al actualizar instrucción de receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Instrucción de receta actualizada con éxito" });
  });
});

// Eliminar una instrucción de receta (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar la instrucción de receta como inactiva (baja lógica)
  const query = `
    UPDATE receta_instrucciones 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Receta_Instrucciones = ?
  `;
  const values = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar instrucción de receta:", err);
      return res.status(500).send("Error al eliminar instrucción de receta");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Instrucción de receta eliminada con éxito" });
  });
});

module.exports = router;
