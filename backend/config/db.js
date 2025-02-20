const { createPool } = require('mysql2/promise');
const { logger } = require('./logger');

// Configuration centralisée
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrapper de requête sécurisé
const query = async (sql, params) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    logger.error('Erreur base de données', { 
      sql: sql.substring(0, 100), 
      error: error.message 
    });
    throw new DatabaseError('Database operation failed');
  } finally {
    connection.release();
  }
};

module.exports = { query };