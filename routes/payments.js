const express = require('express');
const router = express.Router();

// 1. GET All
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_payments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET By Order ID - ดูประวัติการจ่ายเงินของ Order นั้นๆ
router.get('/order/:orderId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_payments WHERE order_id = ?', [req.params.orderId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - บันทึกการจ่ายเงิน
router.post('/', async (req, res) => {
    const { order_id, method, amount, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tbl_payments (order_id, method, amount, status) VALUES (?, ?, ?, ?)',
            [order_id, method, amount, status]
        );
        res.status(201).json({ 
            message: 'Payment recorded successfully',
            id: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT - อัปเดตสถานะการจ่ายเงิน
router.put('/:id', async (req, res) => {
    const { status, amount } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE tbl_payments SET status=?, amount=? WHERE id=?',
            [status, amount, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        res.json({ message: 'Payment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM tbl_payments WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;