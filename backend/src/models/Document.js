const db = require("../config/database");

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
  /**
   * Récupérer l'historique des signatures d'un document
   * @param {number} documentId - ID du document
   * @returns {Promise<Array>} Liste des signatures
   */
    async getSignatureHistory(documentId) {
      return getQuery(
      `SELECT signatures.*, users.firstname, users.lastname 
        FROM signatures 
        JOIN users ON signatures.user_id = users.id 
        WHERE document_id = ? 
        ORDER BY signed_at DESC`,
      [documentId]
    );
  },

  /**
   * Vérifier si un document est complètement signé
   * @param {number} documentId - ID du document
   * @returns {Promise<boolean>}
   */
  async isFullySigned(documentId) {
    const signatures = await getQuery(
      "SELECT COUNT(*) as count FROM signatures WHERE document_id = ?",
      [documentId]
    );
    return signatures.count >= 3; // Exemple: 3 signatures requises
  },

  /**
   * Mettre à jour le statut d'un document
   * @param {number} documentId - ID du document
   * @param {string} status - Nouveau statut
   * @returns {Promise<void>}
   */
  async updateStatus(documentId, status) {
    await runQuery(
      "UPDATE documents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, documentId]
    );
  }

};

module.exports = Document;
