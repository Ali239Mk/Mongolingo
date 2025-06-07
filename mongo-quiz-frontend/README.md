# Frontend de Mongolingo

Bienvenue dans le frontend de **Mongolingo**, l'interface utilisateur interactive de ton application de quiz sur MongoDB !

Ce projet est une application web construite avec React, qui interagit avec le backend Node.js/Express.js pour gérer les données, afficher les questions de quiz, et permettre l'administration des collections MongoDB.

---

## 📚 Table des matières

- [Prérequis](#1-prérequis)
- [Démarrage](#2-démarrage)
- [Structure du projet](#3-structure-du-projet)
- [Technologies Utilisées](#4-technologies-utilisées)
- [Interactions avec le Backend](#5-interactions-avec-le-backend)
- [Améliorations](#6-améliorations)

---

## 1. Prérequis

Avant de lancer le frontend, assure-toi d'avoir les éléments suivants installés sur ta machine :

- **Node.js** (version 18 ou supérieure)
- **npm** (normalement inclus avec Node.js)
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)

Assure-toi également que le backend de **Mongolingo** est en cours d'exécution et accessible (par défaut sur `http://localhost:5000`).

---

## 2. Démarrage

### 2.1. Cloner le dépôt

Si ce n'est pas déjà fait, clone le dépôt de ton frontend et navigue dans le dossier :

```bash
git clone <URL_DEPOT>
cd mongo-quiz-frontend 
```
## 2.2. Installation des dépendances

Installe toutes les dépendances nécessaires au projet :

```bash
npm install
```

## 2.3. Lancement du frontend

Démarre l'application en mode développement :

```bash
npm run start
```

Le frontend sera normalement disponible sur : [http://localhost:3000](http://localhost:3000)  
L'application s'ouvrira automatiquement dans ton navigateur par défaut.

## 3. Structure du projet

Voici un aperçu simplifié de la structure des dossiers et fichiers clés du frontend :

mongo-quiz-frontend/
├── node_modules/
├── public/
│   ├── index.html         # Le point d'entrée principal de l'application
├── src/
│   ├── App.js             # Composant racine de l'application
│   ├── index.js           # Point d'entrée React (rend l'App.js)
│   ├── components/        # Composants React réutilisables (ex: QuestionDisplay)
│   ├── pages/             # Composants représentant des pages distinctes
│   │   ├── HomePage.js
│   │   ├── QuizPage.js
│   │   ├── DataManagement.js
│   ├── styles/            # Fichiers de styles CSS
│   │   └── App.css
├── .gitignore
├── package.json
└── README.md              # Ce fichier

## 4. Technologies Utilisées

React : Bibliothèque JavaScript pour la construction d'interfaces utilisateur interactives.

React Router DOM : Pour la gestion de la navigation et des routes dans l'application.

Axios : Client HTTP basé sur les Promesses pour effectuer des requêtes vers l'API backend.

HTML/CSS : Pour la structure et le style de l'interface utilisateur.

## 5. Interactions avec le Backend

Le frontend communique avec le backend via des requêtes HTTP (principalement GET et POST) pour :

- Récupérer les questions de quiz et soumettre les réponses.

- Importer des fichiers JSON/BSON dans des collections spécifiques (via la page de gestion des données).

- Sauvegarder les données de la base sur le serveur.

- Télécharger l'intégralité de la base de données via le navigateur aux formats JSON ou BSON.

## Améliorations
Bien que fonctionnel ce projet a été réalisé sur une courte période par manque de temps accordé dû aux nombreux travaux, oraux et examens demandés ou prévus simultanément Voici une liste de points d'amélioration que j'aurais souhaité implémenter : 
* Gestion des scores et des utilisateurs : Mettre en place un système d'authentification et de gestion des utilisateurs pour enregistrer les scores, suivre la progression des apprenants et afficher des classements.
* Historique des tentatives : Permettre aux utilisateurs de revoir leurs réponses précédentes, y compris les explications et les résultats d'exécution des requêtes.
* Modes de quiz variés :
    * Un mode "entraînement" où l'utilisateur peut choisir des questions par niveau ou par catégorie.
    * Un mode "défi" avec un temps limité ou un nombre de vies.
* Questions dynamiques / Génération : Possibilité de générer des questions à la volée basées sur des modèles ou des données, plutôt que de se limiter à des questions statiques.
* Affichage de l'exécution des requêtes, il y a cependant de nombreuses méthodes rédigées pour cela mais une faille encore non élucidée m'empêchait de récupérer le résultat de la requête. J'ai donc supprimé la partie front où elle devait apparaître, mais la requête s'exécute bien en fond. 
* Responsive Design : Assurer une parfaite adaptabilité de l'interface sur différentes tailles d'écran (mobiles, tablettes, desktops).
* Exportation sélective : Permettre l'exportation de collections spécifiques ou de données filtrées, pas seulement l'intégralité de la base de données.
* Gestion des utilisateurs : Pourvoir avoir son compte, ses informations, son nombre de points, son niveau/amélioration. La possibilité d'avoir des groupes et donc administrateurs pour changer la base de donnée, les questions...

---

© Projet Mongolingo – Frontend – 2025

