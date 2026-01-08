// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Import Database Connection
const db = require('./db');

// Import Middleware (ตัวตรวจสอบ Token)
const authenticateToken = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set Global DB Variable 
global.db = db;

// Welcome Page
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding-top: 50px;">
            <h1>🚀 Food Delivery API is Running!</h1>
            <p>Welcome to the backend service.</p>
            <p>
                👉 <a href="/api-docs" style="color: blue; font-weight: bold; text-decoration: none; font-size: 1.2em;">
                    Open Swagger UI (Default)
                </a>
            </p>
            <p>
                👉 <a href="/docs" style="color: green; font-weight: bold; text-decoration: none; font-size: 1.2em;">
                    Open Swagger HTML (Vercel Fix)
                </a>
            </p>
        </div>
    `);
});

// --- Routes Registration ---

// 1. Auth Route (Login) - เปิดสาธารณะ
app.use('/routes/auth', require('./routes/auth'));

// 2. Customers Route (การล็อกแยกอยู่ในไฟล์ customers.js)
app.use('/routes/customers', require('./routes/customers'));

// 3. Public Routes (ร้านค้าและเมนู ดูได้ไม่ต้อง Login)
app.use('/routes/restaurants', require('./routes/restaurants'));
app.use('/routes/menus', require('./routes/menus'));

// 4. Protected Routes (ต้อง Login ถึงจะเข้าได้)
app.use('/routes/orders', authenticateToken, require('./routes/orders'));
app.use('/routes/payments', authenticateToken, require('./routes/payments'));
app.use('/routes/shippings', authenticateToken, require('./routes/shippings'));

// --- Swagger Configuration ---

// 1. สร้าง Endpoint สำหรับส่งไฟล์ JSON ดิบๆ (จำเป็นสำหรับ swagger.html)
app.get('/swagger.json', (req, res) => {
    res.json(swaggerDocument);
});

// 2. Swagger UI แบบ Default (เพิ่ม CSS CDN แก้ปัญหาหน้าขาวบน Vercel)
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCssUrl: CSS_URL
}));

// 3. Serve Swagger HTML Static Page (หน้าเว็บสำรอง)
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.html'));
});

// Export app logic
module.exports = app;

// Start Server Check
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}