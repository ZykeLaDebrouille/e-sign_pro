const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Génération des tokens
        const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "60m" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // Stocker les tokens dans les cookies
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

        res.status(200).json({ message: "Connexion réussie", userId: user.id });

    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Déconnexion réussie" });
};

const refreshToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token manquant" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Token rafraîchi" });

    } catch (error) {
        res.status(403).json({ message: "Refresh token invalide ou expiré" });
    }
};

module.exports = { login, logout, refreshToken };
