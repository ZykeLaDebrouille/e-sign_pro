const db = require("../db");
const bcrypt = require("bcrypt");

/**
 * Fonction utilitaire pour exécuter une requête SQLite en mode Promise
 */
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const User = {
  /**
   * Vérifie si un utilisateur existe déjà avec cet email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<boolean>}
   */
  async exists(email) {
    const user = await getQuery("SELECT id FROM users WHERE email = ?", [email]);
    return !!user;
  },

  /**
   * Crée un nouvel utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe brut
   * @param {string} role - Rôle (user, admin) / modifier par eleve parent entreprise
   * @returns {Promise<number>} - ID du nouvel utilisateur
   */
  async create(email, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await runQuery(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );
    return result.lastID;
  },

  /**
   * Récupère un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<object|null>}
   */
  async getByEmail(email) {
    return getQuery("SELECT * FROM users WHERE email = ?", [email]);
  }
};

module.exports = User;
