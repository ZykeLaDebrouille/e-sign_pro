/**
 * Module de gestion de la connexion à la base de données SQLite
 * Fournit une interface unifiée pour les opérations de base de données
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null; // Instance de connexion SQLite
  }

  /**
   * Établit la connexion à la base de données
   * @returns {Promise<Object>} Instance de la base de données connectée
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Chemin absolu vers le fichier SQLite
        const dbPath = path.resolve(__dirname, '../../database/esign.sqlite');
        
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('Erreur de connexion à la base de données:', err.message);
            reject(err);
          } else {
            console.log('Connecté à la base de données SQLite');
            this.initializeTables(); // Initialise les tables si nécessaire
            resolve(this.db);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Crée les tables si elles n'existent pas déjà
   * Assure la structure minimale nécessaire au fonctionnement
   */
  initializeTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstname TEXT,
        lastname TEXT,
        role TEXT DEFAULT 'ELEVE',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content BLOB,
        status TEXT DEFAULT 'draft',
        student_info TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS signatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER,
        user_id INTEGER,
        role TEXT,
        signature_data BLOB,
        signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
  
      `CREATE TABLE IF NOT EXISTS conventions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eleve_id INTEGER,
        entreprise_id INTEGER,
        date_debut DATE,
        date_fin DATE,
        nb_semaines INTEGER,
        status TEXT DEFAULT 'brouillon',
        sujet_stage TEXT,
        gratification_montant DECIMAL(10,2),
        gratification_periode TEXT,
        horaires_travail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        FOREIGN KEY (eleve_id) REFERENCES users (id)
      )`,
  
      `CREATE TABLE IF NOT EXISTS user_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        document_id INTEGER NOT NULL,
        can_sign BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (document_id) REFERENCES documents (id)
      )`
    ];
  
    queries.forEach(query => {
      this.db.run(query, (err) => {
        if (err) {
          console.error('Erreur lors de la création des tables:', err.message);
        }
      });
    });
  }

  /**
   * Exécute une requête renvoyant plusieurs lignes
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête préparée
   * @returns {Promise<Array>} Résultats de la requête
   */
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Erreur d\'exécution de la requête:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Exécute une requête renvoyant une seule ligne
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête préparée
   * @returns {Promise<Object>} Résultat de la requête
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Erreur d\'exécution de la requête:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Exécute une requête modifiant la base de données (INSERT, UPDATE, DELETE)
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête préparée
   * @returns {Promise<Object>} Résultat avec lastID et changes
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Erreur d\'exécution de la requête:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }
}

// Export d'une instance unique (pattern Singleton)
const database = new Database();
module.exports = database;
