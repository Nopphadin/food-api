// routes/customers.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/auth'); // เรียกใช้ Middleware

// 1. GET ALL - ต้อง Login (เพิ่ม authenticateToken)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, fullname, address, phone, username, email FROM tbl_customers');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. GET BY ID - ต้อง Login
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbl_customers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. POST - ลงทะเบียน (ไม่ต้อง Login ใครก็สมัครได้)
router.post('/', async (req, res) => {
    const { fullname, address, phone, username, password, email } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.query(
            'INSERT INTO tbl_customers (fullname, address, phone, username, password, email) VALUES (?, ?, ?, ?, ?, ?)',
            [fullname, address, phone, username, hashedPassword, email]
        );
        res.status(201).json({ id: result.insertId, message: "Customer registered successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. PUT - แก้ไขข้อมูล (ต้อง Login)
router.put('/:id', authenticateToken, async (req, res) => {
    const { fullname, address, phone, email } = req.body;
    try {
        await db.query(
            'UPDATE tbl_customers SET fullname=?, address=?, phone=?, email=? WHERE id=?',
            [fullname, address, phone, email, req.params.id]
        );
        res.json({ message: "Customer updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. DELETE - ลบข้อมูล (ต้อง Login)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.query('DELETE FROM tbl_customers WHERE id=?', [req.params.id]);
        res.json({ message: "Customer deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;