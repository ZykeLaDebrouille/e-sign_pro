const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { validateEmail, validatePassword } = require('../utils/validators');

class UserController {
  // Inscription d'un nouvel utilisateur
  async register(req, res, next) {
    try {
      const { email, password, firstname, lastname, role, companyName } = req.body;

      // Validation des données
      if (!email || !password) {
        throw new ApiError(400, 'Email et mot de passe requis');
      }

      // Valider le format de l'email
      if (!validateEmail(email)) {
        throw new ApiError(400, 'Format d\'email invalide');
      }

      // Valider le mot de passe
      if (!validatePassword(password)) {
        throw new ApiError(400, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

  // Créer l'utilisateur
  const userData = {
    email,
    password,
    firstname,
    lastname,
    role: role || 'ELEVE'
  };

  const user = await User.create(userData);

  // Générer les tokens
  const accessToken = User.generateAccessToken(user);
  const refreshToken = User.generateRefreshToken(user);

  // Définir les cookies
  this.setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: 'success',
    data: {
      user: user.toJSON(),
      accessToken
    }
  });
  console.log('Utilisateur créé avec succès:', user);
  } catch (error) {
  console.error('Erreur lors de l\'inscription:', error);
  next(error);
  }
}


  // Connexion utilisateur
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email et mot de passe requis');
      }

      // Authentifier l'utilisateur
      const { user, accessToken, refreshToken } = await User.authenticate(email, password);

      // Définir les cookies
      this.setTokenCookies(res, accessToken, refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          user: user.toJSON(),
          accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

// Vérification de l'authentification
async checkAuth(req, res) {
  try {
    // L'utilisateur est déjà vérifié par le middleware auth
    // req.user est défini par le middleware
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  } catch (error) {
    console.error('Erreur checkAuth:', error);
    res.status(401).json({
      status: 'error',
      message: 'Non authentifié'
    });
  }
}


  // Déconnexion
  async logout(req, res, next) {
    try {
      // Supprimer les cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({
        status: 'success',
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir le profil utilisateur
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id; // Fourni par le middleware d'authentification
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { firstname, lastname, email } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }

      // Si l'email est modifié, vérifier son format
      if (email && !validateEmail(email)) {
        throw new ApiError(400, 'Format d\'email invalide');
      }

      const updatedUser = await user.update({
        firstname,
        lastname,
        email
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Changer le mot de passe
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Mot de passe actuel et nouveau mot de passe requis');
      }

      // Valider le nouveau mot de passe
      if (!validatePassword(newPassword)) {
        throw new ApiError(400, 'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }

      await user.changePassword(currentPassword, newPassword);

      res.status(200).json({
        status: 'success',
        message: 'Mot de passe modifié avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  // Rafraîchir le token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new ApiError(401, 'Token de rafraîchissement non fourni');
      }

      // Vérifier et décoder le refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }

      // Générer un nouveau access token
      const newAccessToken = User.generateAccessToken(user);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Méthode utilitaire pour définir les cookies de token
  setTokenCookies(res, accessToken, refreshToken) {
    // Cookie pour le access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 heure
    });

    // Cookie pour le refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000 // 7 jours
    });
  }
}

module.exports = new UserController();
