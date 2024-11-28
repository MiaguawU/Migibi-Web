const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const router = express.Router();

const uploadDir = path.join(__dirname, '../imagenes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    console.log("Archivo recibido:", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,  // Limite de tamaño de archivo 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG o JPEG"));
    }
    cb(null, true);
  },
});

router.post("/", (req, res, next) => {
  // Procesar la carga de la imagen antes de continuar con el resto del proceso
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error al procesar la imagen:', err);
      return res.status(500).send('Error al procesar la imagen');
    }

    // Desestructuración de los datos del body
    const { nombre, id_tipo_consumo, id_usuario_alta, fecha_alta } = req.body;

    console.log("Headers:", req.headers);
    console.log("Body recibido:", req.body);

    // Validar que los campos requeridos estén presentes
    if (!nombre || !id_tipo_consumo || !id_usuario_alta || !fecha_alta) {
      return res.status(400).send("Faltan datos requeridos");
    }

    // Establecer la imagen predeterminada si no se sube una imagen
    const imagen = req.file ? `../imagenes/${req.file.filename}` : `imagenes/defRec.png`;

    // Consulta 1: Inserción en la tabla `receta`
    const query1 = `
      INSERT INTO receta (Nombre, Id_Tipo_Consumo, Imagen_receta, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values1 = [nombre, id_tipo_consumo, imagen, id_usuario_alta, fecha_alta];

    // Ejecutar la inserción en la tabla `receta`
    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al insertar en receta:", err1);
        return res.status(500).send("Error al agregar receta");
      }

      // Obtener el id de la receta recién insertada
      const idReceta = result1.insertId;

      const query = `
      UPDATE receta_detalle
      SET Id_Receta = ?
      WHERE Id_Receta_Detalle = ?
    `;
    const values = [idReceta];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar el detalle de receta:", err);
        return res.status(500).send("Error al actualizar el ingrediente");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Detalle de receta no encontrado");
      }
      res.json({ message: "Ingrediente actualizado con éxito" });
    });

    const query5 = `
      UPDATE receta_instrucciones
      SET Id_Receta = ?
      WHERE Id_Receta_Instrucciones = ?
    `;
    const values5 = [idReceta];

    db.query(query5, values5, (err5, result5) => {
      if (err) {
        console.error("Error al actualizar la instrucción:", err5);
        return res.status(500).send("Error al actualizar la instrucción");
      }
      if (result5.affectedRows === 0) {
        return res.status(404).send("Instrucción no encontrada");
      }
      res.json({ message: "Instrucción actualizada con éxito" });
    });

      res.json({ id: idReceta, message: "Receta y detalles agregados con éxito" });
    });
  });
});

// Ruta para obtener una receta y sus detalles
router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    // Consulta para obtener los detalles de la receta
    const query1 = `
      SELECT * FROM receta WHERE Id_Receta = ?
    `;
    
    db.query(query1, [id], (err1, result1) => {
      if (err1) {
        console.error("Error al obtener receta:", err1);
        return res.status(500).send("Error al obtener receta");
      }
  
      if (result1.length === 0) {
        return res.status(404).send("Receta no encontrada");
      }
  
      // Obtener los ingredientes asociados a esta receta
      const query2 = `
        SELECT rd.*, i.Nombre AS Ingrediente, um.Nombre AS Unidad_Medida
        FROM receta_detalle rd
        JOIN ingrediente i ON rd.Id_Ingrediente = i.Id_Ingrediente
        JOIN unidad_medida um ON rd.Id_Unidad_Medida = um.Id_Unidad_Medida
        WHERE rd.Id_Receta = ?
      `;
      
      db.query(query2, [id], (err2, result2) => {
        if (err2) {
          console.error("Error al obtener detalles de receta:", err2);
          return res.status(500).send("Error al obtener detalles de receta");
        }
  
        // Responder con los datos de la receta y los detalles
        res.json({
          receta: result1[0],
          ingredientes: result2
        });
      });
    });
  });

  // Ruta para actualizar una receta y sus detalles
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, id_tipo_consumo, id_usuario_alta, fecha_alta, ingredientes } = req.body;
  
    // Validar los campos requeridos
    if (!nombre || !id_tipo_consumo || !id_usuario_alta || !fecha_alta) {
      return res.status(400).send("Faltan datos requeridos");
    }
  
    // Consulta para actualizar la receta
    const query1 = `
      UPDATE receta 
      SET Nombre = ?, Id_Tipo_Consumo = ?, Id_Usuario_Alta = ?, Fecha_Alta = ? 
      WHERE Id_Receta = ?
    `;
    const values1 = [nombre, id_tipo_consumo, id_usuario_alta, fecha_alta, id];
  
    db.query(query1, values1, (err1, result1) => {
      if (err1) {
        console.error("Error al actualizar receta:", err1);
        return res.status(500).send("Error al actualizar receta");
      }
  
      // Actualizar los detalles de la receta
      if (ingredientes && Array.isArray(ingredientes)) {
        // Primero eliminamos los detalles de receta existentes
        const deleteQuery = `DELETE FROM receta_detalle WHERE Id_Receta = ?`;
        db.query(deleteQuery, [id], (err2) => {
          if (err2) {
            console.error("Error al eliminar detalles de receta:", err2);
            return res.status(500).send("Error al actualizar detalles de receta");
          }
  
          // Insertar los nuevos ingredientes
          const insertQuery = `
            INSERT INTO receta_detalle (Id_Receta, Id_Ingrediente, Cantidad, Id_Unidad_Medida) 
            VALUES (?, ?, ?, ?)
          `;
  
          ingredientes.forEach(ingrediente => {
            const { id_ingrediente, cantidad, id_unidad } = ingrediente;
            const values2 = [id, id_ingrediente, cantidad, id_unidad];
  
            db.query(insertQuery, values2, (err3) => {
              if (err3) {
                console.error("Error al insertar en receta_detalle:", err3);
                return res.status(500).send("Error al actualizar ingredientes");
              }
            });
          });
        });
      }
  
      res.json({ message: "Receta actualizada con éxito" });
    });
  });

  
  // Ruta para eliminar una receta y sus detalles
router.delete("/:id", (req, res) => {
    const { id } = req.params;
  
    // Eliminar los detalles de receta
    const deleteDetailsQuery = `DELETE FROM receta_detalle WHERE Id_Receta = ?`;
    db.query(deleteDetailsQuery, [id], (err1) => {
      if (err1) {
        console.error("Error al eliminar detalles de receta:", err1);
        return res.status(500).send("Error al eliminar detalles de receta");
      }
  
      // Eliminar la receta
      const deleteRecipeQuery = `DELETE FROM receta WHERE Id_Receta = ?`;
      db.query(deleteRecipeQuery, [id], (err2) => {
        if (err2) {
          console.error("Error al eliminar receta:", err2);
          return res.status(500).send("Error al eliminar receta");
        }
  
        res.json({ message: "Receta y detalles eliminados con éxito" });
      });
    });
  });
  

module.exports = router;
