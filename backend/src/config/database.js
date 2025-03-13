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
    return new Promise((resolve, reject) => {
      try {
        const dbPath = path.resolve(__dirname, '../../database/esign.sqlite');
        console.log(`Chemin de la base de données: ${dbPath}`);
        
        // Vérifier si le répertoire parent existe
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        
        console.log(`Le répertoire ${dbDir} est accessible en écriture`);
        
        // Création synchrone de la db pour éviter des problèmes de timing
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.error('Erreur de connexion à la base de données:', err.message);
            reject(err);
            return;
          }
          
          console.log('Connecté à la base de données SQLite');
          this.isConnected = true;
          
          // Création minimale de tables pour tester
          this.createUsersTable()
            .then(() => {
              resolve(this.db);
            })
            .catch(error => {
              console.error('Erreur lors de la création des tables:', error);
              reject(error);
            });
        });
      } catch (error) {
        console.error('Erreur critique lors de la connexion:', error);
        reject(error);
      }
    });
  }

  // Méthode simplifiée pour créer uniquement la table users
  createUsersTable() {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstname TEXT,
          lastname TEXT,
          role TEXT DEFAULT 'ELEVE',
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      this.db.run(sql, (err) => {
        if (err) {
          console.error('Erreur lors de la création de la table users:', err);
          reject(err);
        } else {
          console.log('Table users créée ou existante');
          resolve();
        }
      });
    });
  }

  // Initialisation complète des tables après le succès de la table users
  async initializeRemainingTables() {
    try {
      const tables = [
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
      
      for (const sql of tables) {
        await this.run(sql);
      }
      
      console.log('Toutes les tables supplémentaires ont été créées avec succès');
    } catch (error) {
      console.error('Erreur lors de la création des tables supplémentaires:', error);
    }
  }

  // Exécution de requête avec promesse
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Erreur d\'exécution:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Méthode get pour une seule ligne
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Erreur d\'exécution:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Méthode all pour plusieurs lignes
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Erreur d\'exécution:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Fermeture de la connexion
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Erreur lors de la fermeture:', err);
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
}

const database = new Database();
module.exports = database;
