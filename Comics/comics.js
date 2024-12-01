// Importation des modules nécessaires
const express = require('express');
const cors = require("cors");
require('dotenv').config();  // Chargement des variables d'environnement
const axios = require('axios');  // Utilisation de Axios pour faire des requêtes HTTP

const router = express.Router();
router.use(cors());  // Activation de CORS pour ces routes

// Route pour récupérer la liste des comics
router.get('/comics', async(req, res) => {
    let { skip, title } = req.query;
    if (skip === undefined) skip = 0;
    if (title === undefined) title = "";

    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API}&title=${title}&limit=100&skip=${skip}`);
    res.json(response.data);  // Retourner les résultats des comics
});

// Route pour récupérer un comic par ID
router.get('/comics/:characterid', async(req, res) => {
    const id = req.params.characterid;
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comics/${id}?apiKey=${process.env.API}`);
    res.json(response.data);
});

// Route pour récupérer les personnages
router.get('/characters', async(req, res) => {
    let { skip, title } = req.query;
    if (skip === undefined) skip = 0;
    if (title === undefined) title = "";
    
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API}&name=${title}&limit=100&skip=${skip}`);
    res.json(response.data);
});

// Route pour récupérer un comic spécifique par ID
router.get('/comic/:comicid', async(req, res) => {
    const id = req.params.comicid;
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comic/${id}?apiKey=${process.env.API}`);
    res.json(response.data);
});

// Route pour obtenir le nombre total de pages de comics
router.get('/comicsPage', async(req, res) => {
    let { title } = req.query;
    if (title === undefined) title = "";
    
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API}&title=${title}&limit=100`);
    const result = Math.ceil(response.data.count / 100);  // Calculer le nombre total de pages
    res.json(result);
});

// Route pour obtenir le nombre total de pages de personnages
router.get('/charPage', async(req, res) => {
    let { title } = req.query;
    if (title === undefined) title = "";
    
    const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API}&name=${title}&limit=100`);
    const result = Math.ceil(response.data.count / 100);  // Calculer le nombre total de pages
    res.json(result);
});

module.exports = router;
