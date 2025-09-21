const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // charge les variables d'environnement

const User = require('../models/User');


exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // --- Vérification email avec regex ---
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email invalide" });
    }

    // --- Vérification longueur mot de passe ---
    if (password.length < 10) {
        return res.status(400).json({ message: "Mot de passe trop court (10 caractères min)" });
    }

    // --- Hashage du mot de passe ---
    bcrypt.hash(password, 10)
        .then(hash => {
        const user = new User({
            email: email,
            password: hash
        });
        return user.save();
        })
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, 
                            process.env.RANDOM_TOKEN_SECRET, // <-- utilisation du secret du .env
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
