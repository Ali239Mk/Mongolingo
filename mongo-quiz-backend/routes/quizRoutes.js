const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { runMongoDBQuery } = require('../utils/queryExecutor');

// Route pour récupérer toutes les questions 
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        console.error("Erreur GET /api/quiz:", err);
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer une question par son numId
router.get('/:numId', async (req, res) => { 
  try {
    // Utilisez findOne et recherchez par numId
    const question = await Question.findOne({ numId: Number(req.params.numId) });

    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    res.json(question);
  } catch (err) {
    console.error("Erreur GET /api/quiz/:numId:", err);
    res.status(500).json({ message: err.message });
  }
});

// Route pour soumettre une réponse au quiz
router.post('/:numId/answer', async (req, res) => { 
  try {
    // Utilise findOne et recherche par numId
    const question = await Question.findOne({ numId: Number(req.params.numId) });

    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée.' });
    }

    const { selectedOptionId } = req.body;
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    const correctOption = question.options.find(opt => opt.id === question.correctOptionId);

    if (!selectedOption) {
        return res.status(400).json({ message: 'Option sélectionnée invalide.' });
    }

    const isCorrect = (selectedOptionId === question.correctOptionId);

    let selectedOptionQueryResult = null;
    let correctOptionQueryResult = null;
    let feedbackErrorMessage = null;

    if (selectedOption && selectedOption.query) {
        try {
            selectedOptionQueryResult = await runMongoDBQuery(selectedOption.query);
        } catch (queryErr) {
            console.error(`Erreur lors de l'exécution de la requête choisie (${selectedOption.query}):`, queryErr);
            selectedOptionQueryResult = { error: "Erreur d'exécution de votre requête: " + queryErr.message };
            feedbackErrorMessage = "Une erreur est survenue lors de l'exécution de votre requête.";
        }
    } else {
        selectedOptionQueryResult = { error: "Option choisie invalide ou sans requête." };
        feedbackErrorMessage = "Option choisie invalide ou sans requête.";
    }

    if (correctOption && correctOption.query) {
        try {
            correctOptionQueryResult = await runMongoDBQuery(correctOption.query);
        } catch (queryErr) {
            console.error(`Erreur lors de l'exécution de la requête correcte (${correctOption.query}):`, queryErr);
            correctOptionQueryResult = { error: "Erreur d'exécution de la requête correcte: " + queryErr.message };
        }
    } else {
        correctOptionQueryResult = { error: "Requête correcte introuvable ou sans requête." };
    }

    res.json({
      isCorrect,
      explanation: question.explanation || "Aucune explication fournie pour cette question.",
      selectedOptionQuery: selectedOption ? selectedOption.query : 'N/A',
      correctOptionQuery: correctOption ? correctOption.query : 'N/A',
      selectedOptionQueryResult: selectedOptionQueryResult,
      correctOptionQueryResult: correctOptionQueryResult,
      message: feedbackErrorMessage
    });

  } catch (err) {
    console.error("Erreur serveur lors de la soumission de la réponse (POST /api/quiz/:numId/answer):", err);
    res.status(500).json({ message: "Erreur serveur lors de la soumission de la réponse.", details: err.message });
  }
});

module.exports = router;