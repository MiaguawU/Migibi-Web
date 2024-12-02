const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

// Ruta para crear el directorio de imágenes si no existe
const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Crear una nueva compra (POST)
router.post("/", (req, res, next) => {
  const { id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_alta, fecha_alta } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_compra || !id_unidad_medida || !fecha_compra || cantidad === undefined || !id_usuario_alta || !fecha_alta) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para insertar una nueva compra
  const query1 = `
    INSERT INTO compras (Id_Usuario_Compra, Id_Unidad_Medida, Fecha_Compra, Cantidad, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values1 = [id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_alta, fecha_alta];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al insertar compra:", err1);
      return res.status(500).send("Error al agregar compra");
    }

    // Responder con el ID de la nueva compra
    res.json({ id: result1.insertId, message: "Compra agregada con éxito" });
  });
});

// Obtener compras (GET)
router.get("/", (req, res) => {
  const { activo } = req.query;

  // Construir la consulta SQL
  let query = `SELECT * FROM compras WHERE 1`;

  const params = [];
  if (activo !== undefined) {
    query += ` AND Activo = ?`;
    params.push(activo);
  }

  // Ejecutar la consulta
  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al obtener compras:", err);
      return res.status(500).send("Error al obtener compras");
    }

    // Devolver las compras encontradas
    res.json(result);
  });
});

// Actualizar una compra (PUT)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_modif, fecha_modif, activo } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_compra || !id_unidad_medida || !fecha_compra || cantidad === undefined || !id_usuario_modif || !fecha_modif || activo === undefined) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Consulta para actualizar una compra
  const query1 = `
    UPDATE compras 
    SET Id_Usuario_Compra = ?, Id_Unidad_Medida = ?, Fecha_Compra = ?, Cantidad = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Activo = ?
    WHERE Id_Compras = ?
  `;
  const values1 = [id_usuario_compra, id_unidad_medida, fecha_compra, cantidad, id_usuario_modif, fecha_modif, activo, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al actualizar compra:", err1);
      return res.status(500).send("Error al actualizar compra");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Compra actualizada con éxito" });
  });
});

// Eliminar una compra (marcarla como inactiva) (DELETE)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario_baja, fecha_baja } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_usuario_baja || !fecha_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  // Consulta para marcar la compra como inactiva (baja lógica)
  const query1 = `
    UPDATE compras 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Compras = ?
  `;
  const values1 = [id_usuario_baja, fecha_baja, id];

  // Ejecutar la consulta
  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al eliminar compra:", err1);
      return res.status(500).send("Error al eliminar compra");
    }

    // Responder con un mensaje de éxito
    res.json({ message: "Compra eliminada con éxito" });
  });
});

module.exports = router;
