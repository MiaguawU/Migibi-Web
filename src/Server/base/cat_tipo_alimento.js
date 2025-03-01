const express = require("express");
const db = require("./connection");
const router = express.Router();

// Middleware para verificar permisos
const verificarPermisos = (req, res, next) => {
  const { id_usuario } = req.body || req.params;

  if (!id_usuario) {
    return res.status(400).send("ID de usuario requerido para la validación");
  }

  const evaluar = `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`;

  db.query(evaluar, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos:", err);
      return res.status(500).send("Error al validar permisos");
    }

    if (result.length === 0 || result[0].Id_Rol == 1) {
      return res.status(403).send("Acceso prohibido: No tienes permiso para realizar esta acción");
    }

    next(); // Si pasa la validación, continúa
  });
};

// Crear un nuevo tipo de alimento (POST)
router.post("/", verificarPermisos, (req, res) => {
  const { tipo_alimento, id_usuario } = req.body;
  const fecha_alta = new Date();

  if (!tipo_alimento || !id_usuario) {
    return res.status(400).send("Faltan datos requeridos");
  }

  const query = `
    INSERT INTO cat_tipo_alimento (Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta) 
    VALUES (?, ?, ?)
  `;
  const values = [tipo_alimento, id_usuario, fecha_alta];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar tipo de alimento:", err);
      return res.status(500).send("Error al agregar tipo de alimento");
    }
    res.json({ id: result.insertId, message: "Tipo de alimento agregado con éxito" });
  });
});

// Obtener tipos de alimento (GET)
router.get("/", (req, res) => {
  const query = `SELECT * FROM cat_tipo_alimento`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

// Actualizar un tipo de alimento (PUT)
router.put("/:id", verificarPermisos, (req, res) => {
  const { id } = req.params;
  const { tipo_alimento, id_usuario } = req.body;
  const fecha_modif = new Date();

  if (!tipo_alimento || !id_usuario) {
    return res.status(400).send("Faltan datos requeridos");
  }

  const query = `
    UPDATE cat_tipo_alimento 
    SET Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?
    WHERE Id_Tipo_Alimento = ?
  `;
  const values = [tipo_alimento, id_usuario, fecha_modif, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar tipo de alimento:", err);
      return res.status(500).send("Error al actualizar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento actualizado con éxito" });
  });
});

// Eliminar un tipo de alimento (baja lógica) (DELETE)
router.delete("/:id", verificarPermisos, (req, res) => {
  const { id } = req.params;
  const { id_usuario } = req.body;
  const fecha_baja = new Date();

  if (!id_usuario) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  const query = `
    UPDATE cat_tipo_alimento 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Tipo_Alimento = ?
  `;
  const values = [id_usuario, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar tipo de alimento:", err);
      return res.status(500).send("Error al eliminar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento eliminado con éxito" });
  });
});

module.exports = router;
