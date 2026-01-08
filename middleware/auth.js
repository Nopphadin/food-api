// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // ดึง Token จาก Header "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    // ตรวจสอบความถูกต้องของ Token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token' });
        }
        // ถ้าผ่าน ให้เก็บข้อมูล User ไว้ใน req.user เพื่อใช้ต่อ
        req.user = user;
        next();
    });
};