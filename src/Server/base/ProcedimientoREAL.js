const express = require("express");
const Joi = require("joi"); // Asegúrate de tener Joi instalado
const db = require("./connection");
const router = express.Router();
const util = require("util");

// Asincronizar consultas de la base de datos
const queryAsync = util.promisify(db.query).bind(db);

// Esquema de validación con Joi
const instruccionSchema = Joi.object({
  instruccion: Joi.string().required(),
});

// Crear una nueva instrucción de receta (POST)
router.post("/:id", async (req, res) => {
  const { id } = req.params; // ID de la receta
  const { instruccion, Id_Usuario_Alta } = req.body;

  // Validar entrada
  const { error } = instruccionSchema.validate({ instruccion });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Fecha actual
  const hoy = new Date();
  const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

  try {

    const recetaAutorRes = await queryAsync(
      `SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`,
      [id]
    );

    if (recetaAutorRes.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

    // Obtener rol del usuario que intenta acceder
    const usuarioRes = await queryAsync(
      `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`,
      [Id_Usuario_Alta]
    );

    if (usuarioRes.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const rol = usuarioRes[0].Id_Rol;

    // Verificar permisos:
    const esAutor = parseInt(Id_Usuario_Alta) === idAutor;
    const esAdmin = rol === 2;

    if (!esAutor && !esAdmin ) {
      console.log("Acceso denegado, sin permisos");
      return res.status(403).json({ error: "Acceso denegado, sin permisos" });
    }
    // Obtener el último número de orden para esa receta
    const queryOrden = `
      SELECT Orden
      FROM receta_instrucciones
      WHERE Id_Receta = ?
      ORDER BY Orden DESC
      LIMIT 1
    `;
    const ordenResult = await queryAsync(queryOrden, [id]);
    const nuevoOrden = ordenResult.length > 0 ? ordenResult[0].Orden + 1 : 1;

    // Insertar la nueva instrucción
    const insertQuery = `
      INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertValues = [id, instruccion, nuevoOrden, Id_Usuario_Alta, Fecha_Alta];
    const result = await queryAsync(insertQuery, insertValues);

    res.json({
      id: result.insertId,
      orden: nuevoOrden,
      message: "Instrucción agregada con éxito"
    });

  } catch (err) {
    console.error("Error al insertar instrucción:", err);
    res.status(500).json({ error: "Error interno al agregar la instrucción" });
  }
});



// Obtener todas las instrucciones de una receta específica (GET)
router.get("/:id/:id_usu", async (req, res) => {
  const { id, id_usu } = req.params;

  try {
    // Obtener autor de la receta
    const recetaAutorRes = await queryAsync(
      `SELECT Id_Usuario_Alta FROM receta WHERE Id_Receta = ?`,
      [id]
    );

    if (recetaAutorRes.length === 0) {
      return res.status(404).json({ error: "Receta no encontrada" });
    }

    const idAutor = recetaAutorRes[0].Id_Usuario_Alta;

    // Obtener rol del usuario que intenta acceder
    const usuarioRes = await queryAsync(
      `SELECT Id_Rol FROM usuario WHERE Id_Usuario = ?`,
      [id_usu]
    );

    if (usuarioRes.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const rol = usuarioRes[0].Id_Rol;

    // Verificar permisos:
    const esAutor = parseInt(id_usu) === idAutor;
    const esAdmin = rol === 2;

    if (!esAutor && !esAdmin) {
      console.log("Acceso denegado, sin permisos");
      return res.status(403).json({ error: "Acceso denegado, sin permisos" });
    }

    // Obtener datos de la receta
    const query1 = `
      SELECT 
      ri.Instruccion AS Nombre,
      ri.Orden AS Orden,
      ri.Id_Receta_Instrucciones AS id,
      ri.Activo AS Activo
    FROM receta_instrucciones ri
    WHERE ri.Id_Receta = ?
    ORDER BY ri.Orden ASC;
    `;

    const recetaInfo = await queryAsync(query1, [id]);

    if (recetaInfo.length === 0) {
      return res.status(404).json({ error: "Procedimiento no encontrado" });
    }

    res.json(recetaInfo);

  } catch (err) {
    console.error("Error al obtener procedimiento:", err);
    res.status(500).send("Error al obtener procedimiento");
  }
});




// Eliminar un ingrediente de la receta
router.put("/", (req, res) => {
    const { ids } = req.body; // Obtener los IDs desde el cuerpo de la solicitud
  
    // Validar que se hayan enviado los datos necesarios
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send("Faltan los IDs o no son válidos.");
    }
  
    // Registrar resultados de las actualizaciones
    const resultados = { actualizados: [], errores: [] };
  
    // Función para procesar cada ID
    const procesarId = (id, callback) => {
      const query = `UPDATE receta_instrucciones SET Activo = 0 WHERE Id_Receta_Instrucciones = ?`;
  
      db.query(query, [id], (err, result) => {
        if (err) {
          console.error(`Error al actualizar el ID ${id}:`, err);
          resultados.errores.push({ id, error: err.message });
        } else {
          console.log(`ID ${id} actualizado correctamente.`);
          resultados.actualizados.push(id);
        }
        callback(); // Llamar al callback para continuar
      });
    };
  
    // Procesar los IDs uno por uno
    let index = 0;
    const procesarSiguiente = () => {
      if (index < ids.length) {
        const id = ids[index];
        index++;
        procesarId(id, procesarSiguiente); // Procesar el siguiente ID
      } else {
        // Finalizar cuando se procesen todos los IDs
        res.json({
          message: "Proceso de actualización finalizado.",
          resultados,
        });
      }
    };
  
    // Iniciar el procesamiento
    procesarSiguiente();
  });

// Eliminar una instrucción de receta (DELETE)
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM receta_instrucciones WHERE Id_Instruccion = ?";
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar la instrucción:", err);
        return res.status(500).send("Error al eliminar la instrucción");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Instrucción no encontrada");
      }
      res.json({ message: "Instrucción eliminada con éxito" });
    });
});

// Actualizar el orden de las instrucciones
router.put("/:id/orden", async (req, res) => {
  const { id } = req.params; // ID de la receta
  const { instrucciones } = req.body; // Lista de instrucciones con ID y orden

  if (!Array.isArray(instrucciones) || instrucciones.length === 0) {
    return res.status(400).json({ error: "Se requiere una lista de instrucciones con ID y orden." });
  }

  const query = `
    UPDATE receta_instrucciones
    SET Orden = CASE Id_Receta_Instrucciones
      ${instrucciones.map((_, i) => `WHEN ? THEN ?`).join(" ")}
    END
    WHERE Id_Receta_Instrucciones IN (${instrucciones.map(() => "?").join(", ")});
  `;

  const values = [...instrucciones.flatMap(({ id, orden }) => [id, orden]), ...instrucciones.map(({ id }) => id)];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al actualizar los órdenes:", err);
      return res.status(500).json({ error: "Error al actualizar los órdenes." });
    }
    res.json({ message: "Órdenes actualizados correctamente." });
  });
});



module.exports = router;
