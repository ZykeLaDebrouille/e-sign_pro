const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const ApiError = require('../utils/ApiError');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.userRole = userData.userRole;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  static async create({ email, password, firstname, lastname, userRole }) {
    try {
      const existingUser = await database.get(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );
      if (existingUser) {
        throw new ApiError(409, 'Cet email est déjà utilisé');
      }
      const { ROLES } = require('../config/roles');
      const validRoles = Object.values(ROLES);
      userRole = (userRole && validRoles.includes(userRole)) ? userRole : ROLES.ELEVE;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await database.run(
        `INSERT INTO users (email, password, firstname, lastname, userRole)
        VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, firstname, lastname, userRole]
      );
    // debug console.log('Résultat de l\'insertion:', result);
      const newUser = await database.get(
        'SELECT * FROM users WHERE id = ?',
        [result.lastID]
      );

      if (!newUser) {
        throw new Error('Utilisateur non trouvé après création');
      }
  
      return new User(newUser);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Erreur lors de la création de l\'utilisateur: ' + error.message);
    }
  }

  static async findByEmail(email) {
    try {
      const user = await database.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return user ? new User(user) : null;
    } catch (error) {
      throw new ApiError(500, 'Erreur lors de la recherche de l\'utilisateur');
    }
  }

  static async findById(id) {
    try {
      const user = await database.get(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return user ? new User(user) : null;
    } catch (error) {
      throw new ApiError(500, 'Erreur lors de la recherche de l\'utilisateur');
    }
  }

  static async authenticate(email, password) {
    try {
      const user = await database.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      if (!user) {
        throw new ApiError(401, 'Email ou mot de passe incorrect');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Email ou mot de passe incorrect');
      }
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        user: new User(user),
        accessToken,
        refreshToken
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erreur lors de l\'authentification');
    }
  }

  static generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        userRole: user.userRole 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  async update(updateData) {
    try {
      const allowedUpdates = ['firstname', 'lastname', 'email'];
      
      const updates = Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});
  
      if (Object.keys(updates).length === 0) {
        return this;
      }
  
      // Construire la requête de mise à jour
      const updateFields = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(', ');
        
      const values = [...Object.values(updates), this.id];
  
      await database.run(
        `UPDATE users SET ${updateFields}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        values
      );

      const updatedUser = await User.findById(this.id);
      
    Object.assign(this.updatedUser)
  
    return this;
    }catch(error){
    throw new ApiError(500,'Erreur lors mise à jour utilisateur')
    }
    }

  async changePassword(currentPassword, newPassword) {
    try {
      const user = await database.get(
        'SELECT password FROM users WHERE id = ?',
        [this.id]
      );
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Mot de passe actuel incorrect');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await database.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, this.id]
      );

      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erreur lors du changement de mot de passe');
    }
  }

/**
 * Exécute une requête renvoyant plusieurs lignes (alias de query)
 * @param {string} sql - Requête SQL
 * @param {Array} params - Paramètres pour la requête préparée
 * @returns {Promise<Array>} Résultats de la requête
 */
all(sql, params = []) {
  return this.query(sql, params);
}

async deactivateAccount() {
  try {
    await database.run(
      'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [this.id]
    );
  } catch (error) {
    throw new ApiError(500, 'Erreur lors de la désactivation du compte');
  }
}

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      userRole: this.userRole,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
