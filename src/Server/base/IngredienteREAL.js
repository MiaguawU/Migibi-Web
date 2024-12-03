const express = require('express'); 
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();



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

//agregar un ingrediente a la receta
router.post("/", (req, res) => {
  
});


module.exports = router;
