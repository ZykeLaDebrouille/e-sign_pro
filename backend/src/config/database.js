// backend/src/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  connect() {
    // Si déjà connecté, renvoyer la connexion existante
    if (this.isConnected && this.db) {
      return Promise.resolve(this.db);
    }

    return new Promise((resolve, reject) => {
      try {
        // Assurer que le répertoire de la base de données existe
        const dbDir = path.resolve(__dirname, '../../database');
        const dbPath = path.join(dbDir, 'esign.sqlite');
        
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
          console.log(`Répertoire de base de données créé: ${dbDir}`);
        }
        
        // Vérifier les permissions du répertoire
        try {
          fs.accessSync(dbDir, fs.constants.W_OK);
          console.log(`Le répertoire ${dbDir} est accessible en écriture`);
        } catch (err) {
          console.error(`Problème de permissions sur le répertoire: ${dbDir}`);
          try {
            fs.chmodSync(dbDir, 0o777);
            console.log(`Permissions modifiées pour: ${dbDir}`);
          } catch (chmodErr) {
            console.error(`Impossible de modifier les permissions du répertoire: ${chmodErr.message}`);
          }
        }
        
        // Ouvrir la connexion à la base de données
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
          if (err) {
            console.error('Erreur de connexion à la base de données:', err.message);
            reject(err);
          } else {
            console.log('Connecté à la base de données SQLite');
            this.isConnected = true;
            this.initializeTables()
              .then(() => resolve(this.db))
              .catch((initError) => {
                console.error('Erreur lors de l\'initialisation des tables:', initError);
                reject(initError);
              });
          }
        });

        // Gestion propre de la fermeture 
        process.on('SIGINT', () => {
          this.close().then(() => {
            console.log('Connexion à la base de données fermée proprement');
            process.exit(0);
          });
        });
      } catch (error) {
        console.error('Erreur lors de la création de la connexion:', error);
        reject(error);
      }
    });
  }

  // Méthode pour fermer proprement la connexion
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err);
            reject(err);
          } else {
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
   * Crée les tables si elles n'existent pas déjà
   */
  async initializeTables() {
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
  
    // Exécuter chaque requête de création de table
    for (const query of queries) {
      try {
        await this.run(query);
      } catch (error) {
        console.error(`Erreur lors de la création de table: ${error.message}`);
        throw error;
      }
    }
    
    console.log('Toutes les tables ont été initialisées avec succès');
  }

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

  // Méthodes de transaction pour la cohérence des données
  beginTransaction() {
    return this.run('BEGIN TRANSACTION');
  }

  commit() {
    return this.run('COMMIT');
  }

  rollback() {
    return this.run('ROLLBACK');
  }
}

// Export d'une instance unique (pattern Singleton)
const database = new Database();
module.exports = database;
