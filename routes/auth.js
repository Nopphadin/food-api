// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. ค้นหา User จาก username
        const [users] = await db.query('SELECT * FROM tbl_customers WHERE username = ?', [username]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // 2. ตรวจสอบรหัสผ่าน
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // 3. สร้าง Token (อายุ 1 ชั่วโมง)
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user_id: user.id,
            fullname: user.fullname
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;