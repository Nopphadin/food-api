const express = require('express');
const router = express.Router();

// 1. GET All
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_shippings');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET By ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_shippings WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shipping info not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - เพิ่มข้อมูลจัดส่ง
router.post('/', async (req, res) => {
    const { order_id, address, receiver, phone, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_shippings (order_id, address, receiver, phone, status) VALUES (?, ?, ?, ?, ?)',
            [order_id, address, receiver, phone, status]
        );
        res.status(201).json({ 
            message: 'Shipping info created',
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - อัปเดตสถานะจัดส่ง
router.put('/:id', async (req, res) => {
    const { status, receiver, address } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbl_shippings SET status=?, receiver=?, address=? WHERE id=?',
            [status, receiver, address, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shipping info not found' });
        }
        res.json({ message: 'Shipping status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_shippings WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shipping info deleted' });
        }
        res.json({ message: 'Shipping info deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;