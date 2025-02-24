const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const ApiError = require('../utils/ApiError');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.role = userData.role;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Méthodes statiques pour la gestion des utilisateurs
  static async create({ email, password, firstname, lastname, role = 'user' }) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await database.get(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (existingUser) {
        throw new ApiError(409, 'Cet email est déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur
      const result = await database.run(
        `INSERT INTO users (email, password, firstname, lastname, role)
         VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, firstname, lastname, role]
      );

      // Récupérer l'utilisateur créé
      const newUser = await database.get(
        'SELECT * FROM users WHERE id = ?',
        [result.id]
      );

      return new User(newUser);
    } catch (error) {
      throw new ApiError(500, 'Erreur lors de la création de l\'utilisateur');
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
      // Récupérer l'utilisateur avec son mot de passe
      const user = await database.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!user) {
        throw new ApiError(401, 'Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Email ou mot de passe incorrect');
      }

      // Générer les tokens
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
        role: user.role 
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

  // Méthodes d'instance
  async update(updateData) {
    try {
      const allowedUpdates = ['firstname', 'lastname', 'email'];
      const updates = {};
      
      // Filtrer les mises à jour autorisées
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

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

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await User.findById(this.id);
      Object.assign(this, updatedUser);

      return this;
    } catch (error) {
      throw new ApiError(500, 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // Vérifier l'ancien mot de passe
      const user = await database.get(
        'SELECT password FROM users WHERE id = ?',
        [this.id]
      );

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Mot de passe actuel incorrect');
      }

      // Hasher et enregistrer le nouveau mot de passe
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

  // Méthode pour obtenir un objet utilisateur sans données sensibles
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;
