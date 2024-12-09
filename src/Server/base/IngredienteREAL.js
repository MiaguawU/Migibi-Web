const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const Joi = require("joi");
const router = express.Router();

// Esquema de validación con Joi
const ingredienteSchema = Joi.object({
  nombre: Joi.string().required(),
  cantidad: Joi.number().required(),
  id_unidad: Joi.number().required(),
});

// Crear una nuevo ingrediente
router.post("/:id", async (req, res) => {
  const { id } = req.params; // Id de la receta
  const { nombre, cantidad, id_unidad, Id_Usuario_Alta } = req.body;

  // Validar entrada
  const { error } = ingredienteSchema.validate({ nombre, cantidad, id_unidad });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Fecha actual
  const hoy = new Date();
  const Fecha_Alta = hoy.toISOString().slice(0, 19).replace("T", " ");

  try {
    // Verificar si el alimento existe
    const alimentoQuery = "SELECT Id_Alimento FROM cat_alimento WHERE Alimento = ?";
    const [alimentoResult] = await db.promise().query(alimentoQuery, [nombre]);

    let Id_Alimento;

    if (alimentoResult.length === 0) {
      // Crear un nuevo alimento si no existe
      const alimentoInsertQuery = `
        INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Imagen_alimento, Activo, Id_Usuario_Alta, Fecha_Alta)
        VALUES (?, 1, 0, '/imagenes/defIng.png', 0, ?, ?)
      `;
      const [insertResult] = await db.promise().query(alimentoInsertQuery, [nombre, Id_Usuario_Alta, Fecha_Alta]);
      Id_Alimento = insertResult.insertId;

      // Insertar en `stock_detalle`
      const stockDetalleQuery = `
        INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Id_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta)
        VALUES (?, ?, ?, 0, ?, ?)
      `;
      await db.promise().query(stockDetalleQuery, [id_unidad, cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta]);
    } else {
      // Obtener el ID del alimento existente
      Id_Alimento = alimentoResult[0].Id_Alimento;
    }

    // Agregar a `receta_detalle`
    const recetaDetalleQuery = `
      INSERT INTO receta_detalle (Id_Receta, Id_Alimento, Cantidad, Id_Unidad_Medida, Id_Usuario_Alta, Fecha_Alta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(recetaDetalleQuery, [id, Id_Alimento, cantidad, id_unidad, Id_Usuario_Alta, Fecha_Alta]);

    res.json({ message: "Ingrediente agregado exitosamente." });
  } catch (err) {
    console.error("Error en la operación:", err);
    res.status(500).json({ error: "Error interno al procesar la solicitud." });
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
    const query = `UPDATE receta_detalle SET Activo = 0 WHERE Id_Receta_Detalle = ?`;

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




module.exports = router;
