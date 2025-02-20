const sqlite3 = require('sqlite3').verbose();

const dbFile = process.env.DB_FILE || "./esign.sqlite"; // Utilise la base mémoire si spécifié
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.message);
  } else {
    console.log("✅ Connecté à la base de données SQLite:", dbFile);
  }
});

module.exports = db;

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      firstname TEXT,
      lastname TEXT,
      role TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content BLOB,
      status TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS signatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER,
      user_id INTEGER,
      signed_at DATETIME,
      FOREIGN KEY (document_id) REFERENCES documents (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
  });
  