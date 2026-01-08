const express = require('express');
const router = express.Router();

// 1. GET All - ดึงเมนูทั้งหมด (หรือกรองตาม restaurant_id ผ่าน query params เช่น ?restaurant_id=1)
router.get('/', async (req, res) => {
    try {
        const { restaurant_id } = req.query;
        let sql = 'SELECT * FROM tbl_menus';
        let params = [];
        
        if (restaurant_id) {
            sql += ' WHERE restaurant_id = ?';
            params.push(restaurant_id);
        }
        
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET By ID - ดึงเมนูตาม ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_menus WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - เพิ่มเมนูใหม่
router.post('/', async (req, res) => {
    const { restaurant_id, name, price, category, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_menus (restaurant_id, name, price, category, description) VALUES (?, ?, ?, ?, ?)',
            [restaurant_id, name, price, category, description]
        );
        res.status(201).json({ 
            message: 'Menu created successfully',
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - แก้ไขเมนู
router.put('/:id', async (req, res) => {
    const { name, price, category, description } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbl_menus SET name=?, price=?, category=?, description=? WHERE id=?',
            [name, price, category, description, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json({ message: 'Menu updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE - ลบเมนู
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_menus WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json({ message: 'Menu deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;