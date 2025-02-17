const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role: 
 *                 type: 
 *                 example:
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur dans la requête
 */

// Route pour créer un nouvel utilisateur
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  console.log("Données reçues :", { email, password, role }); // Debug
  
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, mot de passe ou rôle manquant" });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role], function(err) {
      if (err) {
        return res.status(400).json({ error: "Email, mot de passe ou role manquant" });
      }
      res.status(201).json({ id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour la connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
        res.json({token});
      } else {
        res.status(400).json({ error: 'Mot de passe incorrect' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;
