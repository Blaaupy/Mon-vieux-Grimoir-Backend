const jwt = require('jsonwebtoken');
require('dotenv').config(); // charge les variables d'environnement

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // Utilise le secret stocké dans .env
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};
