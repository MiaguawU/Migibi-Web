const express = require("express");
const db = require("./connection");
const Joi = require("joi");
const router = express.Router();

const schema = Joi.object({
  nombre: Joi.string().min(3).max(50).required(),
  id_usuario: Joi.number().integer().positive().required(),
});

const schema2 = Joi.object({
  id_usuario_baja: Joi.number().integer().positive().required(),
});

// In your backend file
const verificarPermisos = (userId, res, callback) => { // userId will be the number
  if (!userId) {
    return res.status(400).send("ID de usuario requerido para la validación");
  }

  const evaluar = `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`;
  db.query(evaluar, [userId], (err, result) => { // Use userId directly
    if (err) {
      console.error("Error al evaluar permisos:", err);
      return res.status(500).send("Error al validar permisos");
    }
    if (result.length === 0 || result[0].Id_Rol === 1) { // Assuming Id_Rol=1 is non-admin
      return res.status(403).send("Acceso prohibido: No tienes permiso para realizar esta acción");
    }
    callback(); // Execute the callback after successful check
  });
};

router.post("/", (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { nombre, id_usuario } = req.body;
  verificarPermisos(id_usuario, res, () => {
  const fecha_alta = new Date();
  const query = `INSERT INTO cat_tipo_alimento (Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta) VALUES (?, ?, ?)`;
  const values = [nombre, id_usuario, fecha_alta];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar tipo de alimento:", err);
      return res.status(500).send("Error al agregar tipo de alimento");
    }
    res.json({ id: result.insertId, message: "Tipo de alimento agregado con éxito" });
  });
  });
});

router.put("/:id", (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { nombre, id_usuario } = req.body;
  verificarPermisos(id_usuario, res, () => {
  const fecha_modif = new Date();
  const query = `UPDATE cat_tipo_alimento SET Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Alimento = ?`;
  const values = [nombre, id_usuario, fecha_modif, id];
  console.log(values)

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar tipo de alimento:", err);
      return res.status(500).send("Error al actualizar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento actualizado con éxito" });
  });
});
});

router.get("/", (req, res) => {
  const query = `SELECT * FROM cat_tipo_alimento WHERE Activo=1`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

router.get("/cat", (req, res) => {
  const query = `SELECT * FROM cat_tipo_alimento`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  const {id} = req.params;
  const query = `SELECT Tipo_Alimento FROM cat_tipo_alimento WHERE Id_Tipo_Alimento=?`;

  db.query(query,[id], (err, result) => {
    if (err) {
      console.error("Error al obtener tipos de alimento:", err);
      return res.status(500).send("Error al obtener tipos de alimento");
    }
    res.json(result);
  });
});

router.delete("/:id", (req, res) => {
  const idSchema = Joi.object({
    id_usuario_baja: Joi.number().integer().positive().required(),
  });
  const { error } = idSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { id_usuario_baja } = req.body;

  verificarPermisos(id_usuario_baja, res, () => {
  const fecha_baja = new Date();
  const query = `UPDATE cat_tipo_alimento SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ? WHERE Id_Tipo_Alimento = ?`;
  const values = [id_usuario_baja, fecha_baja, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al eliminar tipo de alimento:", err);
      return res.status(500).send("Error al eliminar tipo de alimento");
    }
    res.json({ message: "Tipo de alimento eliminado con éxito" });
  });
});
});

router.put("/activar/:id", (req, res) => { // Aquí se corrigió: ya no se pasa verificarPermisos como middleware
  const idSchema = Joi.object({
    id_usuario: Joi.number().integer().positive().required(),
  });
  const { error } = idSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const { id_usuario } = req.body; // Extraemos id_usuario del body

  // Llamamos a verificarPermisos como una función, pasando los parámetros correctos
  verificarPermisos(id_usuario, res, () => {
    const fecha_modif = new Date(); // Usamos fecha_modif para activar
    const query = `UPDATE cat_tipo_alimento SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Tipo_Alimento = ?`;
    const values = [id_usuario, fecha_modif, id];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al activar tipo de alimento:", err);
        return res.status(500).send("Error al activar tipo de alimento");
      }
      res.json({ message: "Tipo de alimento activado con éxito" });
    });
  });
});


module.exports = router;
