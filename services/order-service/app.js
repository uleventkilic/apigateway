const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3002;

app.use(express.json());

// Swagger Settings
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "Swagger API Documentation for the Order Service",
    },
  },
  apis: ["./app.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Order Service! Go to <a href='/api-docs'>/api-docs</a> for API documentation.");
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Returns the list of orders
 *     description: Retrieves the list of orders and allows optional filtering by ID or product name.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The ID of the order
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: item
 *         required: false
 *         description: The name of the ordered product
 *         schema:
 *           type: string
 *           example: Laptop
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   item:
 *                     type: string
 *                     example: Laptop
 */
app.get("/orders", (req, res) => {
  const { id, item } = req.query;

  const orders = [
    { id: 1, item: "Laptop" },
    { id: 2, item: "Phone" },
    { id: 3, item: "Tablet" },
  ];

  let filteredOrders = orders;

  if (id) {
    filteredOrders = filteredOrders.filter(order => order.id == id);
  }
  if (item) {
    filteredOrders = filteredOrders.filter(order => order.item.toLowerCase() === item.toLowerCase());
  }

  res.json(filteredOrders);
});

app.listen(PORT, () => {
  console.log(`Order Service is running at: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
