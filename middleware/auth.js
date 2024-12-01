// Importation des modules nécessaires
const User = require('../User/Model/User');

// Middleware d'authentification
const auth = async(req, res, next) => {            
    if (req.headers.authorization) {
        // Si le token existe dans l'en-tête Authorization
        const user = await User.findOne({
            token: req.headers.authorization.replace('Bearer ', '')  // Extraction du token
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });  // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 401
        } else {
            req.user = user;  // Ajouter l'utilisateur à la requête pour l'utiliser dans les prochaines étapes
            return next();  // Passer à la prochaine étape du traitement
        }
    } else {
        return res.status(401).json({ message: "Unauthorized" });  // Si aucun token n'est fourni, renvoyer une erreur 401
    }
};

module.exports = auth;
