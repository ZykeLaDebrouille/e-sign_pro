/**
 * Modèle pour la gestion des documents à signer
 * Fournit des méthodes pour la création, modification et signature des documents
 */
const db = require("../config/database");

/**
 * Exécute une requête SQL de modification (INSERT, UPDATE, DELETE)
 * @param {string} query - Requête SQL à exécuter
 * @param {Array} params - Paramètres pour la requête préparée
 * @returns {Promise<Object>} Résultat avec lastID et changes
 */
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this); // Contient lastID (dernier ID inséré) et changes
    });
  });
};

/**
 * Exécute une requête SQL retournant un seul résultat
 * @param {string} query - Requête SQL à exécuter
 * @param {Array} params - Paramètres pour la requête préparée
 * @returns {Promise<Object|null>} Résultat de la requête ou null
 */
const getQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row); // Peut être undefined si aucun résultat
    });
  });
};

/**
 * API d'accès aux documents dans la base de données
 */
const Document = {
  /**
   * Crée un nouveau document
   * @param {string} title - Titre du document
   * @param {string} content - Contenu du document (généralement JSON)
   * @returns {Promise<number>} ID du document créé
   */
  async create(title, content = "{}") {
    const result = await runQuery(
      "INSERT INTO documents (title, content) VALUES (?, ?)",
      [title, content]
    );
    return result.lastID;
  },

  /**
   * Récupère un document par son ID
   * @param {number} documentId - ID du document
   * @returns {Promise<Object|null>} Document trouvé ou null
   */
  async getById(documentId) {
    return getQuery("SELECT * FROM documents WHERE id = ?", [documentId]);
  },

  /**
   * Met à jour les informations d'un document
   * @param {number} documentId - ID du document
   * @param {Object} studentInfo - Informations à mettre à jour
   * @returns {Promise<void>}
   */
  async updateStudentInfo(documentId, studentInfo) {
    await runQuery(
      "UPDATE documents SET student_info = ? WHERE id = ?", 
      [JSON.stringify(studentInfo), documentId]
    );
  },

  /**
   * Ajoute une signature à un document
   * @param {number} documentId - ID du document à signer
   * @param {number} userId - ID de l'utilisateur qui signe
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
   * Récupère l'historique des signatures d'un document
   * @param {number} documentId - ID du document
   * @returns {Promise<Array>} Liste des signatures avec informations utilisateur
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
  }
  ,

  /**
   * Vérifie si toutes les signatures requises sont présentes
   * @param {number} documentId - ID du document
   * @returns {Promise<boolean>} true si le document est complètement signé
   */
  async isFullySigned(documentId) {
    const signatures = await getQuery(
      "SELECT COUNT(*) as count FROM signatures WHERE document_id = ?",
      [documentId]
    );
    return signatures.count >= 3; // Exemple: 3 signatures requises
  },

  /**
   * Met à jour le statut d'un document
   * @param {number} documentId - ID du document
   * @param {string} status - Nouveau statut (draft, pending, signed...)
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
