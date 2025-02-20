const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
};

module.exports = errorHandler;
