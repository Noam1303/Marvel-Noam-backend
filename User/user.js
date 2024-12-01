// Importation des modules nécessaires
const express = require('express');
const cors = require("cors");
require('dotenv').config();  // Chargement des variables d'environnement

const User = require("./Model/User");  // Importation du modèle User

// Initialisation du routeur Express
const router = express.Router();
const SHA256 = require('crypto-js/sha256');  // Utilisation de SHA256 pour le hachage des mots de passe
const encBase64 = require('crypto-js/enc-base64');
const uid2 = require("uid2");  // Utilisation de uid2 pour générer des tokens uniques

// Route pour récupérer tous les utilisateurs
router.get('/users', (req, res) => {
    res.json({ message: 'all users' });
});

// Route pour l'inscription de l'utilisateur
router.post('/signup', async(req, res) => {
    try {
        let { email, username, password, checked } = req.body;
        if (email && username && password) {
            if (checked === "on") checked = true;
            else checked = false;

            // Vérification si l'email est déjà utilisé
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email already exists' });

            // Génération du token et du salt pour le mot de passe
            const token = uid2(16);
            const salt = uid2(16);
            const hashedPassword = SHA256(password + salt).toString(encBase64);

            // Création d'un nouvel utilisateur
            const user = await new User({
                email: email,
                newsletter: checked,
                token: token,
                hash: hashedPassword,
                salt: salt,
                account: { username, avatar: null },
            });

            // Sauvegarde de l'utilisateur dans la base de données
            await user.save();
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route pour la connexion de l'utilisateur
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Please provide an email and a password" });

        // Vérification de l'existence de l'utilisateur
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        // Vérification du mot de passe haché
        const hashedPassword = SHA256(password + user.salt).toString(encBase64);
        if (hashedPassword !== user.hash) return res.status(401).json({ message: "Invalid email or password" });

        // Renvoi de l'utilisateur en cas de succès
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route pour récupérer un utilisateur par ID
router.get('/user', async(req, res) => {
    try {
        const id = req.query.id;
        if (id === undefined) res.status(404).json({ message: "user not connected" });

        const user = await User.findById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: "user not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
