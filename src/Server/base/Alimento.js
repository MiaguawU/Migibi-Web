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

// Agregar un alimento
router.post("/", (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error al procesar la imagen:', err);
      return res.status(500).send('Error al procesar la imagen');
    }

    const { nombre, tipo, id_unidad, es_perecedero, cantidad, fecha_caducidad, Id_Usuario_Alta, Fecha_Alta } = req.body;

    console.log("Headers:", req.headers); 
    console.log("Body recibido:", req.body);

    if (!nombre || !tipo || !id_unidad || !es_perecedero || !cantidad) {
      return res.status(400).send("Faltan datos requeridos");
    }

    const imagen = req.file ? `../imagenes/${req.file.filename}` : `../imagenes/defIng.png`;

    const query1 = `
      INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values1 = [nombre, tipo, es_perecedero, imagen, Id_Usuario_Alta, Fecha_Alta];

    const query2 = `
      INSERT INTO stock_detalle (Id_Tipo_Alimento, Id_Unidad_Medida, Fecha_Caducidad, Id_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    let values2 = [tipo, id_unidad, fecha_caducidad, null, es_perecedero, Id_Usuario_Alta, Fecha_Alta];

    db.query(query1, values1, (err, result1) => {
      if (err) {
        console.error("Error al insertar en cat_alimento:", err);
        return res.status(500).send("Error al agregar alimento");
      }

      const idAlimento = result1.insertId;
      values2[3] = idAlimento;

      db.query(query2, values2, (err2, result2) => {
        if (err2) {
          console.error("Error al insertar en stock_detalle:", err2);
          return res.status(500).send("Error al agregar stock");
        }

        res.json({ id: idAlimento, message: "Alimento agregado con éxito" });
      });
    });
  });
});

router.get("/", (req, res) => {
  const query1 = `
    SELECT 
      ca.Alimento AS Nombre,
      sd.Total AS Cantidad,
      cum.Abreviatura AS Unidad,
      ca.Imagen_alimento AS Imagen,
      sd.Fecha_Caducidad
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    WHERE ca.Es_Perecedero = 1
    ORDER BY sd.Fecha_Caducidad ASC;`;

  const query2 = `
    SELECT 
      ca.Alimento AS Nombre,
      sd.Total AS Cantidad,
      cum.Abreviatura AS Unidad,
      ca.Imagen_alimento AS Imagen
    FROM stock_detalle sd
    LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
    LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
    WHERE ca.Es_Perecedero = 0
    ORDER BY ca.Alimento ASC;`;

  db.query(query1, (err, result1) => {
    if (err) {
      console.error("Error en query1:", err);
      return res.status(500).json({ error: "Error al obtener alimentos perecederos" });
    }

    db.query(query2, (err2, result2) => {
      if (err2) {
        console.error("Error en query2:", err2);
        return res.status(500).json({ error: "Error al obtener alimentos no perecederos" });
      }

      res.json({ Perecedero: result1, NoPerecedero: result2 });
    });
  });
});



// Actualizar un alimento
router.put("/:id", upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, id_unidad, es_perecedero, cantidad, fecha_caducidad, Id_Usuario_Alta, Fecha_Alta } = req.body;
  
  const imagen = req.file ? `../imagenes/${req.file.filename}` : `imagenes/defIng.png`;
  
  if (!nombre || !tipo || !id_unidad || !es_perecedero || !cantidad) {
    return res.status(400).send("Faltan datos requeridos");
  }

  // Si no se carga una nueva imagen, se mantiene la actual
  if (!imagen) {
    const queryImagen = 'SELECT Imagen_alimento FROM cat_alimento WHERE Id_Alimento = ?';
    db.query(queryImagen, [id], (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).send("Alimento no encontrado");
      }
      imagen = result[0].Imagen_alimento; // Mantener la imagen actual
      updateAlimento();
    });
  } else {
    updateAlimento();
  }

  // Actualizar el alimento
  function updateAlimento() {
    const query1 = `
      UPDATE cat_alimento SET Alimento = ?, Id_Tipo_Alimento = ?, Es_Perecedero = ?, Imagen_alimento = ?, 
      Id_Usuario_Alta = ?, Fecha_Alta = ? WHERE Id_Alimento = ?
    `;
    const values1 = [nombre, tipo, es_perecedero, imagen, Id_Usuario_Alta, Fecha_Alta, id];

    db.query(query1, values1, (err, result1) => {
      if (err) {
        return res.status(500).send("Error al actualizar el alimento");
      }

      // Actualizar stock_detalle si se proporcionan datos de stock
      const query2 = `
        UPDATE stock_detalle SET Id_Unidad_Medida = ?, Fecha_Caducidad = ?, Es_Perecedero = ?, 
        Id_Usuario_Alta = ?, Fecha_Alta = ? WHERE Id_Alimento = ?
      `;
      const values2 = [id_unidad, fecha_caducidad, es_perecedero, Id_Usuario_Alta, Fecha_Alta, id];

      db.query(query2, values2, (err2, result2) => {
        if (err2) {
          return res.status(500).send("Error al actualizar stock");
        }

        res.json({ id, message: "Alimento actualizado con éxito" });
      });
    });
  }
});

// Eliminar un alimento
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Eliminar primero los registros en stock_detalle
  const query2 = 'DELETE FROM stock_detalle WHERE Id_Alimento = ?';
  db.query(query2, [id], (err2) => {
    if (err2) {
      console.error("Error al eliminar stock:", err2);
      return res.status(500).send("Error al eliminar stock");
    }

    // Luego eliminar el alimento
    const query1 = 'DELETE FROM cat_alimento WHERE Id_Alimento = ?';
    db.query(query1, [id], (err1) => {
      if (err1) {
        console.error("Error al eliminar alimento:", err1);
        return res.status(500).send("Error al eliminar alimento");
      }

      res.json({ message: "Alimento eliminado con éxito" });
    });
  });
});

module.exports = router;
