# Backend de Mongolingo

Bienvenue dans le backend de **Mongolingo**, application de quiz interactif sur MongoDB !  
Ce service est construit avec **Node.js** et **Express.js**, et utilise **Mongoose** pour interagir avec une base de données MongoDB.  
Il fournit les API nécessaires pour gérer les questions du quiz, les données des utilisateurs, des cours, des professeurs, et des notes.

---

## Table des matières

1. [Prérequis](#1-prérequis)  
2. [Démarrage](#2-démarrage)  
3. [Structure du projet](#3-structure-du-projet)  
4. [Modèles de données](#4-modèles-de-données)  
5. [API Endpoints](#5-api-endpoints)

---

## 1. Prérequis

Avant de lancer le backend, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (version 18 ou supérieure)  
- **npm** (normalement inclus dans Node.js)  
- **MongoDB Community Server** (assurez-vous qu'il tourne sur le port par défaut `27017` ou adaptez lefichier `.env`)  
- **MongoDB Database Tools** (pour `mongoimport`, si vous n'avez pas ou ne voulez pas utiliser POSTMAN ou autre')
- **axios** (librairie JavaScript pour les requêtes HTTP, utilisée par le frontend)
- **multer** (middleware Node.js pour la gestion des uploads de fichiers)

---

## 2. Démarrage

### 2.1. Cloner le dépôt

Dépot GitHud disponible au : [https://github.com/Ali239Mk/Mongolingo/tree/main/mongo-quiz-backend](https://github.com/Ali239Mk/Mongolingo/tree/main/mongo-quiz-backend)

```bash
git clone <URL_DEPOT>
cd mongo-quiz-backend
```

### 2.2. Installation des dépendances

```bash
npm install
npm install axios react-router-dom
npm install multer
```

### 2.3. Configuration des variables d'environnement

Créez un fichier nommé `.env` à la racine du dossier `mongo-quiz-backend`. Exemple :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mongoQuizDB
```

> 🔐 Ici on a ajouter `.env` au `.gitignore` pour éviter de committer des infos sensibles.

### 2.4. Lancement du serveur MongoDB

Assurez-vous que votre instance MongoDB est en cours d'exécution (via `mongod`, service, ou Docker).

```bash
mongod --dbpath=data
```

### 2.5. Importation des données de démonstration

Placez-vous dans le dossier des données de démonstration :

```bash
cd data/demo_data
```

Puis exécutez :

```bash
mongoimport --db mongoQuizDB --collection professors --file professors.json --jsonArray --drop
mongoimport --db mongoQuizDB --collection students --file students.json --jsonArray --drop
mongoimport --db mongoQuizDB --collection courses --file courses.json --jsonArray --drop
mongoimport --db mongoQuizDB --collection grades --file grades.json --jsonArray --drop
mongoimport --db mongoQuizDB --collection questions --file questions.json --jsonArray --drop
```

> 💡 Vous pouvez aussi utiliser l'endpoint `/api/data/load/json` si le backend tourne déjà.

### 2.6. Lancement du backend

```bash
npm run dev
```

Le serveur sera disponible sur : [http://localhost:5000](http://localhost:5000)  
Vous devriez voir `Connecté à MongoDB !` dans la console si tout est ok ✅

---

## 3. Structure du projet

```
mongo-quiz-backend/
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── server.js
├── data/
│   ├── demo_data/
│   └── saved_data/
├── models/
│   ├── Course.js
│   ├── Grade.js
│   ├── Professor.js
│   ├── Question.js
│   └── Student.js
├── routes/
│   ├── dataRoutes.js
│   └── quizRoutes.js
└── utils/
    └── queryExecutor.js
```

---

## 4. Modèles de données

- `Professor.js` : Informations sur les professeurs  
- `Student.js` : Informations sur les étudiants  
- `Course.js` : Détails des cours
- `Grade.js` : Notes des étudiants  
- `Question.js` : Questions du quiz, options, réponse, explication.

### Collection des étudiants : 
```js
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numId", "firstName", "lastName", "email", "coursesFollowed"],
      properties: {
        numId: {
          bsonType: "int",
          description: "doit être un entier et est requis (identifiant unique)"
        },
        firstName: {
          bsonType: "string",
          description: "doit être une chaîne de caractères et est requis"
        },
        lastName: {
          bsonType: "string",
          description: "doit être une chaîne de caractères et est requis"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "doit être une chaîne de caractères et un format d'email valide"
        },
        coursesFollowed: {
          bsonType: "array",
          items: {
            bsonType: "int"
          },
          description: "doit être un tableau d'IDs de cours suivis"
        }
      }
    }
  }
});
```

### Collection des professeurs : 
```js
db.createCollection("professors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numId", "firstName", "lastName", "email", "department", "coursesTaught"],
      properties: {
        numId: {
          bsonType: "int",
          description: "doit être un entier et est requis (identifiant unique)"
        },
        firstName: {
          bsonType: "string",
          description: "doit être une chaîne de caractères et est requis"
        },
        lastName: {
          bsonType: "string",
          description: "doit être une chaîne de caractères et est requis"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "doit être une chaîne de caractères et un format d'email valide"
        },
        department: {
          bsonType: "string",
          enum: ["Informatique", "Mathématiques", "Sciences Sociales", "Littérature", "Physique"],
          description: "doit être une chaîne de caractères et l'un des départements autorisés"
        },
        coursesTaught: {
          bsonType: "array",
          items: {
            bsonType: "int"
          },
          description: "doit être un tableau d'IDs de cours"
        }
      }
    }
  }
});
```

### Collection des cours : 
```js
db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numId", "title", "description", "professors", "durationHours"],
      properties: {
        numId: {
          bsonType: "int",
          description: "doit être un entier et est requis (identifiant unique)"
        },
        title: {
          bsonType: "string",
          minLength: 5,
          description: "doit être une chaîne de caractères et avoir au moins 5 caractères"
        },
        description: {
          bsonType: "string",
          minLength: 5,
          description: "doit être une chaîne de caractères et avoir au moins 5 caractères"
        },
        professors: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "int"
          },
          description: "doit être un tableau d'IDs de professeurs et contenir au moins un professeur"
        },
        durationHours: {
          bsonType: "int",
          minimum: 1,
          maximum: 500,
          description: "doit être un entier entre 1 et 500 heures"
        }
      }
    }
  }
});
```

### Collection des notes : 
```js
db.createCollection("grades", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["studentId", "courseId", "scores"], 
      properties: {
        studentId: {
          bsonType: "int",
          description: "doit être l'ID de l'étudiant et est requis"
        },
        courseId: {
          bsonType: "int",
          description: "doit être l'ID du cours et est requis"
        },
        scores: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["score", "dateAwarded"],
            properties: {
              score: {
                bsonType: "double",
                minimum: 0,
                maximum: 20,
                description: "doit être une note entre 0 et 20"
              },
              dateAwarded: {
                bsonType: "date",
                description: "doit être une date et est requis"
              }
            }
          },
          description: "doit être un tableau d'objets notes et date, et contenir au moins une note"
        }
      }
    }
  }
});
```

### Collection des questions du quiz : 
```js
db.createCollection("questions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numId", "description", "level", "options", "correctOptionId", "explanation"], // Ajouter numId ici
      properties: {
        numId: { 
          bsonType: "int",
          description: "doit être un entier et est requis (identifiant unique pour la question)"
        },
        description: { 
          bsonType: "string",
          minLength: 10,
          description: "doit être une chaîne de caractères et avoir au moins 10 caractères"
        },
        level: {
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "doit être un entier représentant le niveau (1 à 5)"
        },
        options: {
          bsonType: "array",
          minItems: 2,
          items: {
            bsonType: "object",
            required: ["id", "query"],
            properties: {
              id: {
                bsonType: "int",
                description: "doit être un entier unique pour l'option"
              },
              query: {
                bsonType: "string",
                description: "doit être une chaîne de caractères représentant la requête MongoDB"
              }
            }
          },
          description: "doit être un tableau d'options de requête avec un ID et la requête"
        },
        correctOptionId: {
          bsonType: "int",
          description: "doit être l'ID de l'option correcte"
        },
        explanation: {
          bsonType: "string",
          minLength: 10,
          description: "doit être une chaîne de caractères détaillant l'explication d'au moins 10 caractères"
        }
      }
    }
  }
});
```

---

## 5. API Endpoints

| Méthode | Endpoint                          | Description |
|---------|-----------------------------------|-------------|
| GET     | `/`                               | Test de disponibilité du serveur |
| GET     | `/api/quiz`                       | Récupère toutes les questions |
| GET     | `/api/quiz/:id`                   | Récupère une question par ID |
| POST    | `/api/quiz/:id/answer`            | Envoie une réponse avec `selectedOptionId` |
| POST    | `/api/data/load/json`             | Charge des données JSON dans la DB |
| POST    | `/api/data/load/bson`             | Charge des données BSON dans la DB |
| GET     | `/api/data/save/json`             | Sauvegarde les données en JSON |
| GET     | `/api/data/save/bson`             | Sauvegarde les données en BSON |

---

💡 **Tips** : Toutes les requêtes `POST` peuvent être testées avec Postman ou Insomnia. 
J'ai ici utilisé mongoimport car c'est ce qu'on a vu en cours.

📚 Ce backend est pensé pour s'intégrer facilement avec un frontend en React, Vue ou autre.

---

© Projet Mongolingo – Backend – 2025
