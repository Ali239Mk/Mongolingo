require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors()); // Permet les requêtes du frontend
app.use(express.json()); // Pour les requêtes JSON 

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB !');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1); // Arrête l'application en cas d'erreur de connexion
  });

// Importation des routes 
const quizRoutes = require('./routes/quizRoutes');
const dataRoutes = require('./routes/dataRoutes'); // Pour importer/exporter les données de démo

// Utilisation des routes
app.use('/api/quiz', quizRoutes);
app.use('/api/data', dataRoutes);

// Route de test simple
app.get('/', (req, res) => {
  res.send('API du Quiz MongoDB en cours d\'exécution !');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});