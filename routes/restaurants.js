const express = require('express');
const router = express.Router();

// 1. GET All - ดึงข้อมูลร้านอาหารทั้งหมด
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_restaurants');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET By ID - ดึงข้อมูลร้านอาหารตาม ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_restaurants WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - เพิ่มร้านอาหารใหม่
router.post('/', async (req, res) => {
    const { name, address, phone, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_restaurants (name, address, phone, description) VALUES (?, ?, ?, ?)',
            [name, address, phone, description]
        );
        res.status(201).json({ 
            message: 'Restaurant created successfully',
            id: result.insertId,
            data: req.body 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - แก้ไขข้อมูลร้านอาหาร
router.put('/:id', async (req, res) => {
    const { name, address, phone, description } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbl_restaurants SET name=?, address=?, phone=?, description=? WHERE id=?',
            [name, address, phone, description, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant not found or no changes made' });
        }
        res.json({ message: 'Restaurant updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE - ลบร้านอาหาร
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_restaurants WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;