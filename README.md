# Mongolingo : Maîtrise MongoDB avec un Quiz Interactif

## 🚀 Introduction au Projet
Bienvenue sur Mongolingo ! Cette application web, développée en React, a été conçue dans le cadre de l'unité d'enseignement R403 "Qualité et au-delà du relationnel" de ma 2ème année de BUT Informatique (BUT2). L'objectif principal de ce projet est de fournir une plateforme interactive, inspirée du principe des quiz de Duolingo, pour s'exercer et perfectionner ses compétences en requêtes MongoDB (NoSQL).

Étudiante de BUT Informatique, j'ai travaillé sur la conception de bases de données NoSQL, l'implémentation de schémas de validation, la gestion des données, et le développement d'une interface utilisateur dynamique avec React.

## Fonctionnalités Clés
Mongolingo offre une expérience d'apprentissage complète grâce aux fonctionnalités suivantes :

    Quiz Interactif MongoDB :
        Plus de 30 (10 implémentées de base (backend/data/demo), 20 à importer via Mongolingo (front/resources)) requêtes MongoDB de 5 niveaux de difficulté (simples à très complexes) sont proposées sous forme de défis. 
        Chaque question permet à l'utilisateur de saisir sa propre requête.
        La solution attendue est expliquée en détail après chaque tentative.
        La requête de l'utilisateur est exécutée en direct sur une base de données MongoDB, et le résultat est comparé à la solution attendue pour valider la réponse.
    Compréhension des Données :
        Une section dédiée explique en détail la structure de chaque collection utilisée dans la base de données.
        Les relations entre les collections et les contraintes de validation de schéma sont clairement présentées pour aider l'utilisateur à construire ses requêtes.
        Une page "Aperçu des Données Initiales" permet de visualiser les documents de chaque collection sous forme de cartes, offrant une compréhension rapide du jeu de données.
    Gestion des Données :
        L'application permet aux utilisateurs de charger des données dans la base de données.
        Des fonctionnalités de sauvegarde des données sont disponibles aux formats JSON et BSON, offrant flexibilité et robustesse pour la gestion de la base de données.

## Technologies Utilisées
    Frontend : React.js
    Backend : Node.js (Express.js)
    Base de Données : MongoDB

## Installation et Lancement
Pour installer et lancer Mongolingo sur votre machine (testé sur Ubuntu récente) :
    Prérequis :
        Assurez-vous d'avoir Node.js (avec npm ou yarn) et MongoDB installés et fonctionnels sur votre système.
        
        Tout est indiqué plus en détail dans les readme de chaque partie avec un schéma de chaque structure.
    
    Clonage du Dépôt :
```bash
    git clone https://votre-lien-du-depot/mongolingo.git
    cd mongolingo
```

Configuration de la Base de Données :
    Créez une base de données MongoDB nommée mongoQuizDB (ou configurez le nom dans votre fichier .env si un autre nom est utilisé).
    Lancez votre serveur MongoDB.
    Les scripts de chargement de données initiales sont disponibles dans le dossier data/demo_data. Vous pouvez utiliser mongoimport.

## 🎥 Démonstration Vidéo

Une vidéo de démonstration de 2 minutes est disponible pour vous donner un aperçu rapide du fonctionnement de Mongolingo :
Installation : https://youtu.be/BJ3R9YMyiQw
Utilisation, fonctionnalités : https://youtu.be/KC7cMCvZftg


## 📂 Structure du Projet

Le projet est organisé comme suit :
    mongo-quiz-backend/ : Contient le code du serveur Node.js (API, modèles Mongoose, logique d'exécution des requêtes MongoDB).
    mongo-quiz-frontend/ : Contient le code de l'application React.

© Projet Mongolingo – 2025
