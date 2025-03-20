const express = require("express");
const db = require("./connection");
const router = express.Router();

// Middleware para verificar permisos
const verificarPermisos = (req, res, next) => {
  const { id } = req.body || req.params; // Se obtiene el ID del usuario

  if (!id) {
    return res.status(400).send("ID de usuario requerido para la validación");
  }

  const evaluar = `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`;

  db.query(evaluar, [id], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos:", err);
      return res.status(500).send("Error al validar permisos");
    }

    if (result.length === 0 || result[0].Id_Rol == 1) {
      return res.status(403).send("Acceso prohibido: No tienes permiso para realizar esta acción");
    }

    next(); // Si pasa la validación, sigue con la siguiente función
  });
};

// 📌 **Ruta para agregar un alimento**
router.post("/", verificarPermisos, (req, res) => {
  const { nombre, id_tipo, id, es_pe } = req.body;
  const Fecha_Alta = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!nombre || !id_tipo || !id) {
    return res.status(400).send("Faltan datos requeridos");
  }

  const query1 = `
    INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta, Es_Perecedero) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values1 = [nombre, id_tipo, id, Fecha_Alta, es_pe];

  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al insertar alimento:", err1);
      return res.status(500).send("Error al agregar alimento");
    }
    res.json({ id: result1.insertId, message: "Alimento agregado con éxito" });
  });
});

// 📌 **Ruta para obtener alimentos**
router.get("/:id", verificarPermisos, (req, res) => {
  const query = `SELECT * FROM cat_alimento`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener alimentos:", err);
      return res.status(500).send("Error al obtener alimentos");
    }
    res.json(result);
  });
});

// 📌 **Ruta para actualizar un alimento**
router.put("/:id", verificarPermisos, (req, res) => {
  const { nombre, id_tipo, id, es_pe } = req.body;
  const id_al = req.params.id;
  const Fecha_Modif = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!nombre || !id_tipo || !id) {
    return res.status(400).send("Faltan datos requeridos");
  }

  const query1 = `
    UPDATE cat_alimento 
    SET Alimento = ?, Id_Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Es_Perecedero = ?
    WHERE Id_Alimento = ?
  `;
  const values1 = [nombre, id_tipo, id, Fecha_Modif, es_pe, id_al];

  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al actualizar alimento:", err1);
      return res.status(500).send("Error al actualizar alimento");
    }
    res.json({ message: "Alimento actualizado con éxito" });
  });
});

// 📌 **Ruta para eliminar un alimento (baja lógica)**
router.delete("/:id", verificarPermisos, (req, res) => {
  const id_al = req.params.id;
  const { id_usuario_baja } = req.body;
  const Fecha_Baja = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!id_usuario_baja) {
    return res.status(400).send("Faltan datos requeridos para la baja");
  }

  const query1 = `
    UPDATE cat_alimento 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? 
    WHERE Id_Alimento = ?
  `;
  const values1 = [id_usuario_baja, Fecha_Baja, id_al];

  db.query(query1, values1, (err1, result1) => {
    if (err1) {
      console.error("Error al eliminar alimento:", err1);
      return res.status(500).send("Error al eliminar alimento");
    }
    res.json({ message: "Alimento eliminado con éxito" });
  });
});

module.exports = router;
