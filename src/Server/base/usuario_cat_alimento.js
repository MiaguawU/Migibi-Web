import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario_cat_alimento');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM usuario_cat_alimento WHERE Id_Usuario_Cat_Alimento = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { Id_Usuario, Id_Alimento, Puede_Comer } = req.body;
  if (Id_Usuario == null || Id_Alimento == null || Puede_Comer == null) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO usuario_cat_alimento (Id_Usuario, Id_Alimento, Puede_Comer) VALUES (?, ?, ?)',
      [Id_Usuario, Id_Alimento, Puede_Comer]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Id_Usuario, Id_Alimento, Puede_Comer } = req.body;
  if (Id_Usuario == null || Id_Alimento == null || Puede_Comer == null) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE usuario_cat_alimento SET Id_Usuario = ?, Id_Alimento = ?, Puede_Comer = ? WHERE Id_Usuario_Cat_Alimento = ?',
      [Id_Usuario, Id_Alimento, Puede_Comer, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json({ message: 'Registro actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM usuario_cat_alimento WHERE Id_Usuario_Cat_Alimento = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
