const express = require("express");
const Joi = require("joi"); // Asegúrate de tener Joi instalado
const db = require("./connection");
const router = express.Router();

// Esquema de validación con Joi
const instruccionSchema = Joi.object({
  instruccion: Joi.string().required(),
  orden: Joi.number().required(),
});

// Crear una nueva instrucción de receta (POST)
router.post("/:id", async (req, res) => {
  const { id } = req.params; // Id de la receta
  const { instruccion, orden, Id_Usuario_Alta } = req.body;

  // Validar entrada
  const { error } = instruccionSchema.validate({ instruccion, orden });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Fecha actual
  const hoy = new Date();
  const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

  // Query SQL para insertar una nueva instrucción
  const query = `
    INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [id, instruccion, orden, Id_Usuario_Alta, Fecha_Alta];

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al insertar instrucción:", err);
      return res.status(500).json({ error: "Error al agregar la instrucción" });
    }
    res.json({ id: result.insertId, message: "Instrucción agregada con éxito" });
  });
});


// Obtener todas las instrucciones de una receta específica (GET)
router.get("/:id", (req, res) => {
  const { id } = req.params; // Cambiado a "id", que es lo que llega en la URL
  
  const query = `
    SELECT 
      ri.Instruccion AS Nombre,
      ri.Orden AS Orden,
      ri.Id_Receta_Instrucciones AS id,
      ri.Activo AS Activo
    FROM receta_instrucciones ri
    WHERE ri.Id_Receta = ?
    ORDER BY ri.Orden ASC;
  `;

  db.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error al obtener instrucciones de receta:", err);
          return res.status(500).send("Error al obtener las instrucciones");
      }
      res.json(results);
  });
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

module.exports = router;
