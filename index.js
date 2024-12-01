// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Chargement des variables d'environnement depuis un fichier .env

// Importation des routes des utilisateurs, des comics et des favoris
const userRoute = require('./User/user');
const comicsRoute = require('./Comics/comics');
const FavorisRoute = require('./Favoris/favoris');

// Connexion à la base de données MongoDB via Mongoose
mongoose.connect(process.env.MONGODB_URI);

// Initialisation de l'application Express
const app = express();

// Middleware pour gérer les requêtes JSON et activer CORS
app.use(express.json());
app.use(cors());

// Définition des routes
app.use(userRoute);
app.use(comicsRoute);
app.use(FavorisRoute);

// Route pour les autres chemins non définis
app.all('*', (req, res) => {
    res.json({message: "all routes"});
});

// Lancement du serveur sur le port 8000
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 8000");
});
