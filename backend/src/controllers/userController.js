const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { validateEmail, validatePassword } = require('../utils/validators');
const jwt = require('jsonwebtoken');

class UserController {
  async register(req, res, next) {
    try {
      const { email, password, firstname, lastname, userRole } = req.body;

      if (!email || !password || !userRole) {
        throw new ApiError(400, 'Email, mot de passe et rôle utilisateur sont requis');
      }
      if (!validateEmail(email)) {
        throw new ApiError(400, 'Format d\'email invalide');
      }
      if (!validatePassword(password)) {
        throw new ApiError(400, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

      const userData = {
        email,
        password,
        firstname,
        lastname,
        userRole: userRole || 'ELEVE'
      };

      const user = await User.create(userData);

      const accessToken = User.generateAccessToken(user);
      const refreshToken = User.generateRefreshToken(user);

      this.setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        status: 'success',
        data: {
          user: user.toJSON(),
          accessToken
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email et mot de passe requis');
      }

      const { user, accessToken, refreshToken } = await User.authenticate(email, password);

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

  async checkAuth(req, res) {
    try {
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

  async logout(req, res, next) {
    try {
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

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
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

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { firstname, lastname, email } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }

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

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Mot de passe actuel et nouveau mot de passe requis');
      }

      if (!validatePassword(newPassword)) {
        throw new ApiError(400, 'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
      }

      const user = await User.findById(userId);
      
	  if (!user) throw new ApiError(404,'Utilisateur non trouvé')

	  await user.changePassword(currentPassword,newPassword)

	  res.status(200).json({status:"success",message:'Mot de passe modifié avec succès'})
	}catch(error){
	next(error)
	}
	}
	
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        throw new ApiError(401, 'Token de rafraîchissement non fourni');
      }
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        throw new ApiError(404, 'Utilisateur non trouvé');
      }
  
      const newAccessToken = User.generateAccessToken(user);
  
      res.status(200).json({
        status: 'success',
        data: { accessToken: newAccessToken }
      });
    } catch (error) {
      next(error);
    }
  }
  

    setTokenCookies(res, accessToken, refreshToken) {
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 3600000
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800000
      });
    }
  }
  
  module.exports = new UserController();
