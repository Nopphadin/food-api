const request = require('supertest');
const app = require('../index'); // import app express
const db = require('../db'); // import database connection

// ตัวแปรสำหรับเก็บ ID ที่ถูกสร้างขึ้น เพื่อนำไปใช้ใน step ถัดไป (เช่น Update/Delete)
let customerId;
let restaurantId;
let menuId;
let orderId;
let paymentId;
let shippingId;

// รอให้ DB connect ก่อนเริ่มเทส (Optional: ขึ้นอยู่กับความเร็วเน็ต)
beforeAll(async () => {
    // ตรวจสอบ connection
    await db.getConnection();
});

// ปิด connection หลังเทสเสร็จ
afterAll(async () => {
    await db.end();
});

describe('Food Delivery API Integration Tests', () => {

    // ==========================================
    // 1. CUSTOMERS TEST
    // ==========================================
    describe('Customers API', () => {
        it('POST /routes/customers - Should create a new customer', async () => {
            const res = await request(app).post('/routes/customers').send({
                fullname: "Test User Jest",
                address: "123 Test Street",
                phone: "0812345678",
                username: "testuser_jest",
                password: "password123",
                email: "test@jest.com"
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            customerId = res.body.id; // เก็บ ID ไว้ใช้ต่อ
        });

        it('GET /routes/customers - Should return all customers', async () => {
            const res = await request(app).get('/routes/customers');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('GET /routes/customers/:id - Should return specific customer', async () => {
            const res = await request(app).get(`/routes/customers/${customerId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.fullname).toEqual("Test User Jest");
        });

        it('PUT /routes/customers/:id - Should update customer', async () => {
            const res = await request(app).put(`/routes/customers/${customerId}`).send({
                fullname: "Updated Name",
                address: "New Address",
                phone: "0899999999",
                email: "new@jest.com"
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 2. RESTAURANTS TEST
    // ==========================================
    describe('Restaurants API', () => {
        it('POST /routes/restaurants - Should create a new restaurant', async () => {
            const res = await request(app).post('/routes/restaurants').send({
                name: "Jest Restaurant",
                address: "Test Location",
                phone: "020000000",
                description: "Testing Restaurant"
            });
            expect(res.statusCode).toEqual(201);
            restaurantId = res.body.id;
        });

        it('GET /routes/restaurants/:id - Should return restaurant', async () => {
            const res = await request(app).get(`/routes/restaurants/${restaurantId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual("Jest Restaurant");
        });

        it('PUT /routes/restaurants/:id - Should update restaurant', async () => {
            const res = await request(app).put(`/routes/restaurants/${restaurantId}`).send({
                name: "Updated Restaurant",
                address: "New Location",
                phone: "021111111",
                description: "Updated Desc"
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 3. MENUS TEST
    // ==========================================
    describe('Menus API', () => {
        it('POST /routes/menus - Should create a menu linked to restaurant', async () => {
            const res = await request(app).post('/routes/menus').send({
                restaurant_id: restaurantId,
                name: "Jest Menu",
                price: 100.00,
                category: "Test Cat",
                description: "Yummy"
            });
            expect(res.statusCode).toEqual(201);
            menuId = res.body.id;
        });

        it('GET /routes/menus/:id - Should return menu', async () => {
            const res = await request(app).get(`/routes/menus/${menuId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual("Jest Menu");
        });

        it('PUT /routes/menus/:id - Should update menu', async () => {
            const res = await request(app).put(`/routes/menus/${menuId}`).send({
                name: "Updated Menu",
                price: 150.00,
                category: "Updated Cat",
                description: "More Yummy"
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 4. ORDERS TEST
    // ==========================================
    describe('Orders API', () => {
        it('POST /routes/orders - Should create an order', async () => {
            const res = await request(app).post('/routes/orders').send({
                customer_id: customerId,
                restaurant_id: restaurantId,
                menu_id: menuId,
                qty: 2,
                total: 300.00,
                status: "pending"
            });
            expect(res.statusCode).toEqual(201);
            orderId = res.body.id;
        });

        it('GET /routes/orders/:id - Should return order', async () => {
            const res = await request(app).get(`/routes/orders/${orderId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.qty).toEqual(2);
        });

        it('PUT /routes/orders/:id - Should update order status', async () => {
            const res = await request(app).put(`/routes/orders/${orderId}`).send({
                qty: 2,
                total: 300.00,
                status: "cooking"
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 5. PAYMENTS TEST
    // ==========================================
    describe('Payments API', () => {
        it('POST /routes/payments - Should create payment record', async () => {
            const res = await request(app).post('/routes/payments').send({
                order_id: orderId,
                method: "Credit Card",
                amount: 300.00,
                status: "completed"
            });
            expect(res.statusCode).toEqual(201);
            paymentId = res.body.id;
        });

        it('GET /routes/payments/order/:orderId - Should get payment by order', async () => {
            const res = await request(app).get(`/routes/payments/order/${orderId}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('PUT /routes/payments/:id - Should update payment', async () => {
            const res = await request(app).put(`/routes/payments/${paymentId}`).send({
                status: "refunded",
                amount: 300.00
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 6. SHIPPINGS TEST
    // ==========================================
    describe('Shippings API', () => {
        it('POST /routes/shippings - Should create shipping info', async () => {
            const res = await request(app).post('/routes/shippings').send({
                order_id: orderId,
                address: "Shipping Address",
                receiver: "Receiver Name",
                phone: "0800000000",
                status: "preparing"
            });
            expect(res.statusCode).toEqual(201);
            shippingId = res.body.id;
        });

        it('PUT /routes/shippings/:id - Should update shipping status', async () => {
            const res = await request(app).put(`/routes/shippings/${shippingId}`).send({
                status: "shipped",
                receiver: "Receiver Name",
                address: "Shipping Address"
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    // ==========================================
    // 7. CLEANUP (DELETE) - ลบข้อมูลย้อนกลับเพื่อไม่ให้ติด FK Constraint
    // ==========================================
    describe('Cleanup Data (DELETE)', () => {
        it('DELETE /routes/shippings/:id', async () => {
            const res = await request(app).delete(`/routes/shippings/${shippingId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('DELETE /routes/payments/:id', async () => {
            const res = await request(app).delete(`/routes/payments/${paymentId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('DELETE /routes/orders/:id', async () => {
            const res = await request(app).delete(`/routes/orders/${orderId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('DELETE /routes/menus/:id', async () => {
            const res = await request(app).delete(`/routes/menus/${menuId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('DELETE /routes/restaurants/:id', async () => {
            const res = await request(app).delete(`/routes/restaurants/${restaurantId}`);
            expect(res.statusCode).toEqual(200);
        });

        it('DELETE /routes/customers/:id', async () => {
            const res = await request(app).delete(`/routes/customers/${customerId}`);
            expect(res.statusCode).toEqual(200);
        });
    });

});