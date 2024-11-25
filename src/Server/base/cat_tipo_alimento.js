const express = require('express');
const db = require('./connection');

const router = express.Router();

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM cat_tipo_alimento';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener los alimentos');
    } else {
      res.json(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM cat_tipo_alimento WHERE Id_Alimento = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener el alimento');
    } else {
      res.json(result);
    }
  });
});

router.post('/', (req, res) => {
  const {
    Id_Tipo_Alimento,
    Alimento,
    Activo,
    Id_Usuario_Alta,
    Fecha_Alta,
    Es_Perecedero
  } = req.body;

  const sql = `
    INSERT INTO cat_tipo_alimento (
      Id_Tipo_Alimento, Alimento, Activo, Id_Usuario_Alta, Fecha_Alta, Es_Perecedero
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [Id_Tipo_Alimento, Alimento, Activo, Id_Usuario_Alta, Fecha_Alta, Es_Perecedero], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al agregar el alimento');
    } else {
      res.json(result);
    }
  });
});

router.put('/:id', (req, res) => {
  const {
    Id_Tipo_Alimento,
    Alimento,
    Activo,
    Id_Usuario_Modif,
    Fecha_Modif,
    Es_Perecedero
  } = req.body;

  const sql = `
    UPDATE cat_alimento 
    SET Id_Tipo_Alimento = ?, Alimento = ?, Activo = ?, Id_Usuario_Modif = ?, Fecha_Modif = ?, Es_Perecedero = ?
    WHERE Id_Alimento = ?
  `;

  db.query(sql, [Id_Tipo_Alimento, Alimento, Activo, Id_Usuario_Modif, Fecha_Modif, Es_Perecedero, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el alimento');
    } else {
      res.json(result);
    }
  });
});

router.delete('/:id', (req, res) => {
  const { Id_Usuario_Baja, Fecha_Baja } = req.body;

  const sql = `
    UPDATE cat_alimento 
    SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ?
    WHERE Id_Alimento = ?
  `;

  db.query(sql, [Id_Usuario_Baja, Fecha_Baja, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el alimento');
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
