// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ตรวจสอบการเชื่อมต่อ (Optional: เพื่อให้รู้ว่าต่อติดไหมตอนรัน)
pool.getConnection()
    .then(conn => {
        console.log("Database connected successfully!");
        conn.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

module.exports = pool;