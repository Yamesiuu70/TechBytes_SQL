import { sql, connectMssqlDB } from '../config/db.js';

export async function getAllCategories(req, res) {
  try {
    const pool = await connectMssqlDB();
    const result = await pool.request()
      .query('SELECT id, name FROM Categories ORDER BY name');
    
    res.json({ 
      success: true, 
      data: result.recordset 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const pool = await connectMssqlDB();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, name FROM Categories WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: result.recordset[0] 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}