require('dotenv').config(); // Assurez-vous d'installer dotenv : npm install dotenv

const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersRoutes = require('./routes/users');
const documentsRoutes = require('./routes/documents');
<<<<<<< Updated upstream
const PORT = process.env.PORT || 5000;
=======

const setupSwagger = require("./swagger");

>>>>>>> Stashed changes

const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app);

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);


<<<<<<< Updated upstream
app.get('/', (req, res) => {
  res.send('ON EST DANS LE ROUTE HOME!')
  });

=======
>>>>>>> Stashed changes
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
