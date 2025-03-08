const db = require('../../../config/database');

const up = async () => {
  // Ajouter les nouvelles colonnes aux tables existantes
  await db.run(`
    ALTER TABLE documents 
    ADD COLUMN status TEXT DEFAULT 'draft'
  `);

  await db.run(`
    ALTER TABLE documents 
    ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  `);

  await db.run(`
    ALTER TABLE users 
    ADD COLUMN is_active BOOLEAN DEFAULT 1
  `);

  // Créer la nouvelle table de relations
  await db.run(`
    CREATE TABLE IF NOT EXISTS user_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      document_id INTEGER NOT NULL,
      can_sign BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (document_id) REFERENCES documents(id)
    )
  `);
};

const down = async () => {
  // Code pour annuler les modifications si nécessaire
  await db.run(`DROP TABLE IF EXISTS user_documents`);
  
  // Note: SQLite ne supporte pas DROP COLUMN, 
  // il faudrait recréer les tables pour supprimer les colonnes
};

module.exports = { up, down };
