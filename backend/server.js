const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());
app.use(cors());

// --- Swagger Configuration ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API documentation for Register, Login, and User CRUD operations',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/*.routes.js', './routes/*.js'], // files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Routes ---
app.use('/api/users', require('./routes/userRoutes'));

// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user_management')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  })
  .catch(err => console.log(err));