const express = require("express");
const db = require("./connection"); // Assuming this is your database connection
const Joi = require("joi");
const validator = require('validator'); // <--- ADD THIS LINE
const router = express.Router();

const alimentoSchema = Joi.object({
  Alimento: Joi.string().min(2).max(100).required(),
  Id_Tipo_Alimento: Joi.number().integer().required(),
  Es_Perecedero: Joi.boolean().required(),
  // For POST/PUT/DELETE, the actioning user ID should also be present in the validation
  id_usuario_accion: Joi.number().integer().required(), // Added for consistency
});

// For the DELETE operation, if it has different fields or only needs id_usuario_baja
const bajaSchema = Joi.object({
  id_usuario_baja: Joi.number().integer().required(),
});


const verificarPermisos = (id_usuario, res, callback) => {
  if (!id_usuario) {
    return res.status(400).json({ error: "ID de usuario para verificación de permisos es requerido." });
  }

  const query = 'SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?';
  db.query(query, [id_usuario], (err, result) => {
    if (err) {
      console.error("Error al evaluar permisos", err);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }
    // Assuming Id_Rol = 1 is a regular user and cannot perform these actions
    // Adjust the role check based on your actual role definitions
    if (!result.length || result[0].Id_Rol == 1) {
      return res.status(403).json({ error: "Acceso prohibido: No tienes permiso para realizar esta acción" });
    }
    callback(); // If authorized, proceed with the route logic
  });
};

router.get("/nombres", (req, res) => { // Get admin ID from query parameter

    const query = `SELECT Id_Alimento, Alimento, Activo, Es_Perecedero FROM cat_alimento WHERE Activo = 1;`;
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al obtener nombres de alimento:", err);
        return res.status(500).json({ error: "Error al obtener nombres de alimento" }); // Consistent JSON response
      }
      res.json(result);
    });
  });

router.post("/:id_usuario_accion", (req, res) => {
  const { id_usuario_accion } = req.params; // Get admin ID from URL parameter for permission check
  const { Alimento, Id_Tipo_Alimento, Es_Perecedero } = req.body; // Data for insertion

  console.log("POST Request Body:", req.body); // Log the request body to debug
  console.log("POST id_usuario_accion from params:", id_usuario_accion);

  verificarPermisos(id_usuario_accion, res, () => { // Pass id_usuario_accion from params for verification
    const { error } = alimentoSchema.validate({ Alimento, Id_Tipo_Alimento, Es_Perecedero, id_usuario_accion: parseInt(id_usuario_accion) }); // Validate with the actual ID
    if (error) return res.status(400).json({ error: error.details[0].message });

    const hoy = new Date();
    const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

    const query1 = `
      INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta, Es_Perecedero)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values1 = [Alimento, Id_Tipo_Alimento, id_usuario_accion, Fecha_Alta, Es_Perecedero];

    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al insertar alimento:", err1);
        return res.status(500).json({ error: "Error al agregar alimento" });
      }
      res.json({ id: result1.insertId, message: "Alimento agregado con éxito" });
    });
  });
});

router.put("/:id_alimento_actualizar", (req, res) => {
  const { id_alimento_actualizar } = req.params;
  // Ensure the keys here match the frontend's PUT payload
  const { nombre, Id_Tipo_Alimento, id_usuario_accion, Es_Perecedero } = req.body;

  console.log("PUT Request Body:", req.body); // Log the request body
  console.log("PUT id_alimento_actualizar from params:", id_alimento_actualizar);

  verificarPermisos(id_usuario_accion, res, async () => {
    // Validate the incoming body against the schema (using 'Alimento' from schema)
    const { error } = alimentoSchema.validate({
      Alimento: nombre, // Map 'nombre' from body to 'Alimento' for Joi validation
      Id_Tipo_Alimento,
      Es_Perecedero,
      id_usuario_accion // The actioning user ID
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (!validator.isNumeric(id_alimento_actualizar)) {
      return res.status(400).json({ error: 'El ID del alimento a actualizar debe ser numérico' });
    }

    const Fecha_Modif = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      let query1 = `
        UPDATE cat_alimento
        SET Alimento = ?, Id_Tipo_Alimento = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Es_Perecedero = ?
        WHERE Id_Alimento = ?
      `;
      const values1 = [nombre, Id_Tipo_Alimento, id_usuario_accion, Fecha_Modif, Es_Perecedero, id_alimento_actualizar];

      db.query(query1, values1, (err1, result1) => {
        if (err1) {
          console.error("Error al actualizar alimento:", err1);
          return res.status(500).json({ error: "Error al actualizar alimento" });
        }
        if (result1.affectedRows === 0) {
          return res.status(404).json({ error: "Alimento no encontrado para actualizar" });
        }
        res.json({ message: "Alimento actualizado con éxito" });
      });
    } catch (error) {
      console.error("Error interno del servidor al actualizar alimento:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

router.delete("/:id_alimento_eliminar", (req, res) => {
  const { id_alimento_eliminar } = req.params;
  const { id_usuario_baja } = req.body; // Admin ID for verification comes from body

  console.log("DELETE Request Body:", req.body); // Log the request body
  console.log("DELETE id_alimento_eliminar from params:", id_alimento_eliminar);

  verificarPermisos(id_usuario_baja, res, () => {
    const { error } = bajaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (!validator.isNumeric(id_alimento_eliminar)) {
      return res.status(400).json({ error: "El ID del alimento a eliminar debe ser numérico" });
    }

    const Fecha_Baja = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query1 = `
      UPDATE cat_alimento
      SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ?
      WHERE Id_Alimento = ?
    `;
    const values1 = [id_usuario_baja, Fecha_Baja, id_alimento_eliminar];

    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al eliminar alimento:", err1);
        return res.status(500).json({ error: "Error al eliminar alimento" });
      }
      if (result1.affectedRows === 0) {
        return res.status(404).json({ error: "Alimento no encontrado o ya inactivo" });
      }
      res.json({ message: "Alimento eliminado con éxito" });
    });
  });
});

router.get("/unic/:id_alimento", (req, res) => { // Changed path to /unic/:id_alimento
  const { id_alimento } = req.params;
  const { id_usuario_admin } = req.query; // Get admin ID from query parameter

  console.log("GET /unic/:id_alimento id_alimento:", id_alimento);
  console.log("GET /unic/:id_alimento id_usuario_admin:", id_usuario_admin);


  verificarPermisos(id_usuario_admin, res, () => {
    if (!validator.isNumeric(id_alimento)) {
      return res.status(400).json({ error: "ID de alimento válido es requerido." });
    }

    const query = `SELECT * FROM cat_alimento WHERE Id_Alimento = ?`;

    db.query(query, [id_alimento], (err, result) => {
      if (err) {
        console.error("Error al obtener alimento:", err);
        return res.status(500).json({ error: "Error al obtener alimento" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Alimento no encontrado." });
      }
      res.json(result[0]); // Return the single object
    });
  });
});

router.get("/:id_usuario_admin", (req, res) => {
  const { id_usuario_admin } = req.params;

  if (!id_usuario_admin || isNaN(parseInt(id_usuario_admin))) {
    return res.status(400).json({ error: 'ID de usuario administrador válido es requerido en la URL.' });
  }

  verificarPermisos(id_usuario_admin, res, () => {
    const query = `SELECT
                      Id_Alimento,
                      Id_Tipo_Alimento,
                      Alimento,
                      Activo,
                      Id_Usuario_Alta,
                      Fecha_Alta,
                      Es_Perecedero,
                      Id_Usuario_Modif,
                      Fecha_Modif,
                      Id_Usuario_Baja,
                      Fecha_Baja
                    FROM cat_alimento`; // Removed WHERE Activo = 1 to get all, you can add it back if needed

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error al obtener alimentos:", err);
        return res.status(500).json({ error: "Error al obtener alimentos" });
      }
      res.json(result);
    });
  });
});

router.put("/activar/:id", (req, res) => {
  const { error } = bajaSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { id } = req.params;
  const { id_usuario_baja } = req.body;
  verificarPermisos(id_usuario_baja, res, () => {
    const fecha_baja = new Date();
    const query = `UPDATE cat_alimento SET Activo = 1, Id_Usuario_Modif = ?, Fecha_Modif = ? WHERE Id_Alimento = ?`;
    db.query(query, [id_usuario_baja, fecha_baja, id], (err) => {
      if (err) return res.status(500).send("Error al activar unidad de medida");
      res.json({ message: "Unidad de medida activada con éxito" });
    });
  });
});

module.exports = router;