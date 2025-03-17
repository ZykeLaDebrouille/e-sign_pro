/**
 * Configuration et gestion de la connexion à la base de données SQLite
 * Ce module gère la création, l'initialisation et les interactions avec la base de données
 */
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
      // Si déjà connecté, renvoie l'instance existante
      if (this.isConnected && this.db) {
        console.log('Utilisation de la connexion existante');
        return this.db;
      }

      // Préparation du répertoire de la base de données
      await this.prepareDbDirectory();

      // Connexion à la base de données
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
              // Activation des clés étrangères
              await this.run('PRAGMA foreign_keys = ON');
              
              // Initialisation des tables
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

  /**
   * Prépare le répertoire de la base de données
   * Crée le répertoire si nécessaire et vérifie les permissions
   */
  async prepareDbDirectory() {
    try {
      // Créer le répertoire s'il n'existe pas
      if (!fs.existsSync(this.dbDir)) {
        fs.mkdirSync(this.dbDir, { recursive: true });
        console.log(`Répertoire de base de données créé: ${this.dbDir}`);
      }

      // Vérifier les permissions d'écriture
      try {
        fs.accessSync(this.dbDir, fs.constants.W_OK);
        console.log(`Le répertoire ${this.dbDir} est accessible en écriture`);
      } catch (err) {
        console.warn(`Problème de permissions sur ${this.dbDir}, tentative de correction`);
        fs.chmodSync(this.dbDir, 0o777);
        console.log(`Permissions modifiées pour ${this.dbDir}`);
      }

      // Si le fichier existe, vérifier ses permissions
      if (fs.existsSync(this.dbPath)) {
        try {
          fs.accessSync(this.dbPath, fs.constants.W_OK);
          console.log(`Le fichier ${this.dbPath} est accessible en écriture`);
        } catch (err) {
          console.warn(`Problème de permissions sur ${this.dbPath}, tentative de correction`);
          fs.chmodSync(this.dbPath, 0o666);
          console.log(`Permissions modifiées pour ${this.dbPath}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la préparation du répertoire:', error);
      throw error;
    }
  }

  /**
   * Initialise les tables de la base de données
   */
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

    // Exécuter chaque requête dans une transaction
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

  /**
   * Débute une transaction
   * @returns {Promise<void>}
   */
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

  /**
   * Ferme la connexion à la base de données
   * @returns {Promise<void>}
   */
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

  /**
   * Fournit des statistiques sur la base de données
   * @returns {Promise<Object>} Statistiques
   */
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

// Exporter une instance unique (pattern Singleton)
const database = new Database();
module.exports = database;
