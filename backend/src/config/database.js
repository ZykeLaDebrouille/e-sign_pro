const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = null;
    this.isConnected = false;
    this.dbPath = path.resolve(__dirname, '../../database/esign.sqlite');
    this.dbDir = path.dirname(this.dbPath);
  }

  /**
   * Établit la connexion à la base de données
   * - Crée le répertoire de la base de données si nécessaire
   * - Vérifie les permissions
   * - Crée/ouvre le fichier de base de données
   * - Initialise les tables si nécessaire
   * @returns {Promise<sqlite3.Database>} Instance de la base de données connectée
   */
  async connect() {
    try {
      if (this.isConnected && this.db) {
        console.log('Utilisation de la connexion existante');
        return this.db;
      }

      return new Promise((resolve, reject) => {
        console.log(`Connexion à la base de données: ${this.dbPath}`);
        
        // Ouvrir la base de données avec OPEN_READWRITE | OPEN_CREATE pour s'assurer qu'elle peut être créée si elle n'existe pas
        this.db = new sqlite3.Database(
          this.dbPath, 
          sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
          async (err) => {
            if (err) {
              console.error('Erreur lors de la connexion à la base de données:', err);
              reject(err);
              return;
            }
            
            console.log('Connecté à la base de données SQLite');
            this.isConnected = true;
            
            try {
              await this.run('PRAGMA foreign_keys = ON');
              
              await this.initializeTables();
              
              // Configuration de la gestion des erreurs
              process.on('SIGINT', async () => {
                console.log('Signal d\'interruption reçu, fermeture de la connexion...');
                await this.close();
                process.exit(0);
              });
              
              resolve(this.db);
            } catch (initError) {
              console.error('Erreur lors de l\'initialisation:', initError);
              reject(initError);
            }
          }
        );
      });
    } catch (error) {
      console.error('Erreur critique de connexion:', error);
      throw error;
    }
  }

  async initializeTables() {
    console.log('Initialisation des tables...');

    const queries = [
      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstname TEXT,
        lastname TEXT,
        userRole TEXT DEFAULT 'ELEVE',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table des documents
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
      
      // Table des signatures
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
  
      // Table des conventions
      `CREATE TABLE IF NOT EXISTS conventions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eleve_id INTEGER,
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
        FOREIGN KEY (eleve_id) REFERENCES users (id)
      )`
    ];

    await this.beginTransaction();
    try {
      for (const query of queries) {
        await this.run(query);
      }
      await this.commit();
      console.log('Toutes les tables ont été initialisées avec succès');
    } catch (error) {
      await this.rollback();
      console.error('Erreur lors de l\'initialisation des tables:', error);
      throw error;
    }
  }

  /**
   * Exécute une requête et retourne plusieurs lignes
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête
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
   * Exécute une requête et retourne une seule ligne
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête
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
   * Exécute une requête et retourne le résultat de l'opération
   * @param {string} sql - Requête SQL
   * @param {Array} params - Paramètres pour la requête
   * @returns {Promise<Object>} Résultat avec lastID et changes
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Erreur d\'exécution de la requête:', err);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  beginTransaction() {
    return this.run('BEGIN TRANSACTION');
  }

  /**
   * Valide une transaction
   * @returns {Promise<void>}
   */
  commit() {
    return this.run('COMMIT');
  }

  /**
   * Annule une transaction
   * @returns {Promise<void>}
   */
  rollback() {
    return this.run('ROLLBACK');
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close(err => {
          if (err) {
            console.error('Erreur lors de la fermeture de la connexion:', err);
            reject(err);
          } else {
            console.log('Connexion à la base de données fermée');
            this.isConnected = false;
            this.db = null;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async getStats() {
    try {
      const tables = await this.query("SELECT name FROM sqlite_master WHERE type='table'");
      const stats = {
        tables: tables.length,
        counts: {}
      };
      
      for (const table of tables) {
        if (table.name.startsWith('sqlite_')) continue;
        const count = await this.get(`SELECT COUNT(*) as count FROM ${table.name}`);
        stats.counts[table.name] = count.count;
      }
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

const database = new Database();
module.exports = database;
