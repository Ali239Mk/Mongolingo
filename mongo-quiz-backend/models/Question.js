const { query } = require('express');
const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
    numId: { type: Number, required: true, unique: true }, // ID unique pour chaque question
    description: { type: String, required: true, minlength: 10 }, // Enoncé
    level: { type: Number, required: true, min: 1, max: 5 }, // Niveau de difficulté de la question (1 à 5)
    options: {
        type: [{ 
            id: { type: Number, required: true }, // ID unique pour chaque option
            query: { type: String, required: true, minlength: 1 } // Texte de l'option de réponse
        }], // Tableau d'options de réponse
        validate: { 
            validator: function(v) {
                return v && v.length >= 2; // Vérifie qu'il y a au moins 2 options
            },
            message: props => `Une question doit avoir au moins deux options de réponse !`
        },
        required: true 
    }, 
    correctOptionId: { type: Number, required: true}, // Numéro de la bonne réponse
    explanation: { type: String, required: true, minlength: 10 }, // Explication de la réponse correcte
});

module.exports = mongoose.model('Question', questionsSchema);