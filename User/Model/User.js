// Importation de Mongoose
const mongoose = require('mongoose');

// Définition du modèle User avec les champs nécessaires
const User = mongoose.model('User', {
    email: String,
    newsletter: Boolean,
    token: String,
    hash: String,
    salt: String,
    account: {
        username: String,
        avatar: Object, // Objet pour l'avatar de l'utilisateur
    },
    favorites: [{
        articleId: String,
        iscomics: Boolean,
    }],
});

module.exports = User;
