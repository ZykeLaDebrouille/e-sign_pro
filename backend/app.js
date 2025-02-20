require('dotenv').config(); // Assurez-vous d'installer dotenv : npm install dotenv

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const db = require('./db');
const usersRoutes = require('./routes/users');
const documentsRoutes = require('./routes/documents');
const setupSwagger = require("./swagger");
const errorHandler = require("./middleware/errorHandler");
const compression = require("compression");
const morgan = require("morgan");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/server.log" }),
  ],
});


const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors({ origin: "http://localhost:3000", credentials: true }));  // Pour autoriser les requêtes depuis le frontend
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use(compression());
app.use(morgan("combined"));

setupSwagger(app);

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);


app.get('/api/hello', (req, res) => {
  res.send('Hello from /API/HELLO Backend!');
});

// Gestion d'erreur globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
