const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const amqp = require("amqplib"); // Required for RabbitMQ

const app = express();
app.use(express.json());

const PORT = 3003;
const RABBITMQ_URL = "amqp://rabbitmq"; // RabbitMQ URL

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Service API",
      version: "1.0.0",
      description: "API documentation for the Payment Service",
    },
    servers: [{ url: "http://localhost:3003" }],
  },
  apis: ["./app.js"], // Reads Swagger comments from this file
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Function to Send a Message to RabbitMQ Queue
async function sendToQueue(queueName, message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    console.log(`Message sent to queue ${queueName}:`, message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error occurred while sending message to RabbitMQ:", error.message);
  }
}

// Root Route: Informational Message
app.get("/", (req, res) => {
  res.send(
    "Welcome to Payment Service! Go to <a href='/api-docs'>/api-docs</a> for API documentation."
  );
});

// Payment Endpoint
/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Initiates a new payment process
 *     description: Sends payment information to the RabbitMQ queue.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - paymentType
 *               - cardNo
 *             properties:
 *               user:
 *                 type: string
 *                 example: ali@gmail.com
 *               paymentType:
 *                 type: string
 *                 example: credit
 *               cardNo:
 *                 type: string
 *                 example: "1234123412341234"
 *     responses:
 *       200:
 *         description: Payment successfully sent to the queue.
 *       500:
 *         description: An error occurred.
 */
app.post("/payments", async (req, res) => {
  const paymentInfo = req.body;
  console.log("Payment received:", paymentInfo);

  if (!paymentInfo.user || !paymentInfo.paymentType || !paymentInfo.cardNo) {
    return res.status(400).json({ error: "Missing payment information" });
  }

  try {
    await sendToQueue("NotificationQueue", paymentInfo);
    res.json({ status: "Payment processed and sent to queue", ...paymentInfo });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the payment" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Payment Service is running at: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
