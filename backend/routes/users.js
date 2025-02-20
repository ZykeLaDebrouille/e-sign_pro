const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt";

/**
 * Fonction utilitaire pour exécuter une requête SQLite en mode asynchrone (Promise)
 * @param {string} query - La requête SQL à exécuter
 * @param {Array} params - Les paramètres de la requête
 * @returns {Promise<any>} - Résultat de la requête
 */
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

/**
 * Fonction utilitaire pour récupérer un seul résultat en SQLite
 * @param {string} query - La requête SQL à exécuter
 * @param {Array} params - Les paramètres de la requête
 * @returns {Promise<object|null>} - Un objet avec les données ou null si aucun résultat
 */
const getQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

/**
 * Vérifie si une adresse email est valide
 * @param {string} email - L'email à valider
 * @returns {boolean} - True si valide, False sinon
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur dans la requête
 */

// Route pour enregistrer un nouvel utilisateur
router.post("/register", async (req, res) => {
  let { email, password, role } = req.body;
  console.log("Données reçues :", { email, password, role });

  // Vérification des champs obligatoires
  if (!email || !password) {
    return res.status(400).json({ error: "L'email et le mot de passe sont requis" });
  }

  // Vérifier que l'email est bien une chaîne valide
  if (typeof email !== "string" || !isValidEmail(email)) {
    return res.status(400).json({ error: "Adresse email invalide" });
  }

  // Vérifier que le mot de passe est suffisamment sécurisé
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  // Définir une valeur par défaut pour `role`
  const allowedRoles = ["admin", "user"];
  role = allowedRoles.includes(role) ? role : "user";

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await getQuery("SELECT id FROM users WHERE email = ?", [email]);

    if (userExists) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur avec un `role` contrôlé
    const result = await runQuery(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès", id: result.lastID });

  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
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
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *       400:
 *         description: "Erreur dans la requête (ex: mauvais identifiants)"
 */

// Route pour la connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Vérification des entrées
  if (!email || !password) {
    return res.status(400).json({ error: "L'email et le mot de passe sont requis" });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await getQuery("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;
