const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Token d\'accès requis'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Token invalide ou expiré'
            });
        }

        req.user = user;
        next();
    });
};

// Middleware pour vérifier que l'utilisateur est organisateur
const requireOrganizer = (req, res, next) => {
    if (req.user.role !== 'organisateur') {
        return res.status(403).json({
            status: 'error',
            message: 'Accès réservé aux organisateurs'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireOrganizer
};