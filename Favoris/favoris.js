// Importation des modules nécessaires
const express = require('express');
const cors = require("cors");
require('dotenv').config();  // Chargement des variables d'environnement

const User = require("../User/Model/User");  // Importation du modèle User

const auth = require('../middleware/auth');  // Middleware d'authentification

// Initialisation du routeur Express
const router = express.Router();

// Route pour récupérer les favoris de l'utilisateur
router.get('/favoris', auth, async(req, res) => {
    try {
        const findUser = await User.findOne({ token: req.user.token });

        if (findUser.length === 0) return res.status(400).json({ message: "User has not been found" });
        const findFavoris = await User.find({ _id: findUser._id });

        if (!findFavoris[0].favorites.length === 0) return res.status(400).json({ message: "User has no favorite thing 😢" });
        return res.status(200).json(findFavoris[0].favorites);  // Retourner les favoris de l'utilisateur
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route pour ajouter ou supprimer un favori
router.post('/favoris', auth, async(req, res) => {
    try {
        const { id, iscomics } = req.body;
        if (!req.user.token || !id) return res.status(400).json({ message: "Some Information are missing" });

        const user = await User.findOne({ token: req.user.token });

        if (user.length === 0) return res.status(400).json({ message: "User is not connected" });

        // Vérifier si l'article est déjà un favori
        const findFavoris = await User.findOne({ _id: user._id, favorites: { $elemMatch: { articleId: id } } });
        if (findFavoris) {
            const deleteFavoris = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    $set: {
                        favorites: user.favorites.filter(item => item.articleId !== id),  // Suppression du favori
                    }
                },
                { new: true }
            );
            return res.status(201).send(deleteFavoris);  // Retourner les nouveaux favoris
        }

        // Ajouter un nouvel article aux favoris
        const result = await User.findOneAndUpdate({
            _id: user._id,
            $set: {
                favorites: [...user.favorites, { articleId: id, iscomics: iscomics }]
            }
        });

        result.save();
        return res.status(200).json(result);  // Retourner les favoris mis à jour
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
