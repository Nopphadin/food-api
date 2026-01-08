const express = require('express');
const router = express.Router();

// 1. GET All - ดึง Order ทั้งหมด
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_orders ORDER BY order_date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET By ID - ดึง Order ตาม ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_orders WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - สร้าง Order ใหม่
router.post('/', async (req, res) => {
    const { customer_id, restaurant_id, menu_id, qty, total, status } = req.body;
    // กำหนดค่า default status เป็น 'pending' ถ้าไม่ได้ส่งมา
    const orderStatus = status || 'pending'; 
    
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_orders (customer_id, restaurant_id, menu_id, qty, total, order_date, status) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [customer_id, restaurant_id, menu_id, qty, total, orderStatus]
        );
        res.status(201).json({ 
            message: 'Order created successfully',
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - แก้ไขรายละเอียด Order
router.put('/:id', async (req, res) => {
    const { qty, total, status } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbl_orders SET qty=?, total=?, status=? WHERE id=?',
            [qty, total, status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE - ลบ Order
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_orders WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;