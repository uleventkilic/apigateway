const express = require("express");
const axios = require("axios");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

app.use(express.json()); // JSON Body Middleware

// Swagger Ayarları
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Gateway Documentation",
            version: "1.0.0",
            description: "API Gateway for Microservices Architecture",
        },
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    apis: ["./app.js"], // Swagger açıklamalarını buradan okuyacak
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Kök Endpoint
app.get("/", (req, res) => {
    res.send("Welcome to Service!  Go to <a href='/api-docs'>/api-docs</a> for API documentation.");
  });
  

// User Service
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of users from the User Service
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: User Service Error
 */
app.get("/api/users", async (req, res) => {
    try {
        const response = await axios.get("http://user-service:3001/users");
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "User Service Error" });
    }
});

// Order Service
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of orders from the Order Service
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Order Service Error
 */
app.get("/api/orders", async (req, res) => {
    try {
        const response = await axios.get("http://order-service:3002/orders");
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Order Service Error" });
    }
});

// Payment Service
/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment
 *     description: Send a payment request to the Payment Service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "ali@gmail.com"
 *               paymentType:
 *                 type: string
 *                 example: "credit"
 *               cardNo:
 *                 type: string
 *                 example: "1234-5678-9012-3456"
 *     responses:
 *       200:
 *         description: Payment sent to queue successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Payment sent to queue"
 *                 user:
 *                   type: string
 *                   example: "ali@gmail.com"
 *                 paymentType:
 *                   type: string
 *                   example: "credit"
 *                 cardNo:
 *                   type: string
 *                   example: "1234-5678-9012-3456"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Payment Service Error
 */
app.post("/api/payments", async (req, res) => {
    try {
        console.log("API Gateway Received Body:", req.body);
        const response = await axios.post("http://payment-service:3003/payments", req.body, {
            headers: { "Content-Type": "application/json" }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Payment Service Error:", error.message);
        res.status(500).json({ error: "Payment Service Error" });
    }
});

// API Gateway Başlatma
app.listen(PORT, () => {
    console.log(`API Gateway çalışıyor: http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
