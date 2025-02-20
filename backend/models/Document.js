const db = require("../db");

/**
 * Exécuter une requête SQLite en mode Promise
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
 * Récupérer une seule ligne en SQLite
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
 * Modèle de gestion des documents
 */
const Document = {
  /**
   * Créer un document dans la base de données
   * @param {string} title - Titre du document
   * @param {string} content - Contenu en JSON (si besoin)
   * @returns {Promise<number>} - ID du document créé
   */
  async create(title, content = "{}") {
    const result = await runQuery(
      "INSERT INTO documents (title, content) VALUES (?, ?)",
      [title, content]
    );
    return result.lastID;
  },

  /**
   * Récupérer un document par son ID
   * @param {number} documentId - ID du document
   * @returns {Promise<object|null>}
   */
  async getById(documentId) {
    return getQuery("SELECT * FROM documents WHERE id = ?", [documentId]);
  },

  /**
   * Mettre à jour les informations d’un document
   * @param {number} documentId - ID du document
   * @param {object} studentInfo - Informations JSON
   * @returns {Promise<void>}
   */
  async updateStudentInfo(documentId, studentInfo) {
    await runQuery("UPDATE documents SET student_info = ? WHERE id = ?", [
      JSON.stringify(studentInfo),
      documentId,
    ]);
  },

  /**
   * Ajouter une signature à un document
   * @param {number} documentId - ID du document
   * @param {number} userId - ID de l’utilisateur signataire
   * @param {string} role - Rôle du signataire
   * @returns {Promise<void>}
   */
  async sign(documentId, userId, role) {
    await runQuery(
      "INSERT INTO signatures (document_id, user_id, role, signed_at) VALUES (?, ?, ?, ?)",
      [documentId, userId, role, new Date().toISOString()]
    );
  },
};

module.exports = Document;
