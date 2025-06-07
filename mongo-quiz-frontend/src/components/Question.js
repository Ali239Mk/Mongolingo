import React, { useState, useEffect } from 'react';

const Question = ({ question, onSubmitAnswer }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedback, setFeedback] = useState(null); // Pour afficher les info

  useEffect(() => {
    // Réinitialise les états chaque fois que 'question.numId' change
    setSelectedOptionId(null); // Réinitialise l'option sélectionnée
    setFeedback(null); // Cache la réponse
  }, [question.numId]);

  const handleSubmit = async () => {
    if (selectedOptionId === null) {
      alert('Veuillez sélectionner une option !');
      return;
    }

    try {
        const result = await onSubmitAnswer(question.numId, selectedOptionId);
        setFeedback(result);
    }
    catch (error) {
        console.error('Erreur lors de la soumission de la réponse:', error);
        setFeedback({ isCorrect: false, explanation: "Une erreur est survenue lors de la soumission." });
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2>Question Niveau {question.level}:</h2>
      <p>{question.description}</p>
      <div>
        {question.options.map((option) => (
          <div key={option.id}>
            <input
              type="radio"
              id={`option-${option.id}`}
              name="quiz-option"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => setSelectedOptionId(option.id)}
              disabled={feedback !== null} // Désactiver les options après la soumission pour pas répondre plrs fois
            />
            <label htmlFor={`option-${option.id}`}>{option.query}</label>
          </div>
        ))}
      </div>
      {!feedback && (
        <button onClick={handleSubmit} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Valider
        </button>
      )}

      {feedback && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: feedback.isCorrect ? '#d4edda' : '#f8d7da', borderColor: feedback.isCorrect ? '#28a745' : '#dc3545', color: feedback.isCorrect ? '#155724' : '#721c24', borderRadius: '5px' }}>
          <h3>Résultat : {feedback.isCorrect ? 'Correct ! 🎉' : 'Incorrect. 😕'}</h3>
          <p>
            Votre requête : <code>{feedback.selectedOptionQuery}</code>
          </p>
          <p>
            Requête correcte : <code>{feedback.correctOptionQuery}</code>
          </p>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            Explication : {feedback.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;