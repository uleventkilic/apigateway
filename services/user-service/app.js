const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3001;

app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "Swagger API Documentation for the User Service",
    },
  },
  apis: ["./app.js"], // Comments for Swagger are located here
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root Endpoint
app.get("/", (req, res) => {
  res.send(
    "Welcome to User Service! Go to <a href='/api-docs'>/api-docs</a> for API documentation."
  );
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of users
 *     description: Retrieves the list of users and allows optional filtering by ID or name.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of the user
 *         schema:
 *           type: string
 *           example: Ali
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
 *                   name:
 *                     type: string
 *                     example: Ali
 */
app.get("/users", (req, res) => {
  const { id, name } = req.query;

  const users = [
    { id: 1, name: "Ali" },
    { id: 2, name: "Veli" },
    { id: 3, name: "Ayşe" },
  ];

  let filteredUsers = users;

  if (id) {
    filteredUsers = filteredUsers.filter(user => user.id == id);
  }
  if (name) {
    filteredUsers = filteredUsers.filter(user => user.name.toLowerCase() === name.toLowerCase());
  }

  res.json(filteredUsers);
});

app.listen(PORT, () => {
  console.log(`User Service is running at: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
