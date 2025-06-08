import React, { useState, useEffect } from 'react';

const Question = ({
  question,
  onSubmitAnswer,
  selectedAnswerId, // L'ID de l'option déjà sélectionnée
  isPreviouslyCorrect, // Si la réponse précédente était correcte
  previousExplanation, // L'explication de la réponse précédente
  previouslySubmitted, // Si la question a déjà été soumise
  submittedQuery, 
  correctQuery 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); 
  const [explanation, setExplanation] = useState('');
  const [submitted, setSubmitted] = useState(false); 
  const [localSubmittedQuery, setLocalSubmittedQuery] = useState('');
  const [localCorrectQuery, setLocalCorrectQuery] = useState('');

  useEffect(() => {
    setSelectedOption(selectedAnswerId || null);
    setSubmitted(previouslySubmitted || false); // Pré-sélectionner si une réponse existe
    setShowExplanation(previouslySubmitted || false); // Afficher l'explication si la question a déjà été soumise
    // Initialiser l'état de l'explication avec les données précédentes
    if (previouslySubmitted) {
      setIsCorrect(isPreviouslyCorrect);
      setExplanation(previousExplanation);
      setLocalSubmittedQuery(submittedQuery || '');
      setLocalCorrectQuery(correctQuery || '');
    } else {
      setIsCorrect(null);
      setExplanation('');
      setLocalSubmittedQuery('');
      setLocalCorrectQuery('');
    }
  }, [question, selectedAnswerId, isPreviouslyCorrect, previousExplanation, previouslySubmitted, submittedQuery, correctQuery]);


  const handleOptionChange = (event) => {
    if (!submitted) {
        setSelectedOption(parseInt(event.target.value));
        setShowExplanation(false);
        setIsCorrect(null);
        setExplanation('');
        setLocalSubmittedQuery('');
        setLocalCorrectQuery('');
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert("Veuillez sélectionner une option avant de soumettre.");
      return;
    }

    if (submitted) {
      return;
    }

    // Avant de soumettre, trouver la requête associée à l'option sélectionnée
    const selectedOptionObject = question.options.find(opt => opt.id === selectedOption);
    const correctOptionObject = question.options.find(opt => opt.id === question.correctOptionId);

    // Mettre à jour les requêtes locales pour l'affichage 
    setLocalSubmittedQuery(selectedOptionObject ? selectedOptionObject.query : 'N/A');
    setLocalCorrectQuery(correctOptionObject ? correctOptionObject.query : 'N/A');

    const result = await onSubmitAnswer(question.numId, selectedOption);
    setIsCorrect(result.isCorrect);
    setExplanation(result.explanation);
    setShowExplanation(true);
    setSubmitted(true); // Marquer la question comme soumise
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h2 style={{ color: '#333' }}>{question.description}</h2>
      <div style={{ marginTop: '15px' }}>
        {question.options.map((option) => (
          <div key={option.id} style={{ marginBottom: '10px' }}>
            <input
              type="radio"
              id={`option-${option.id}`}
              name={`question-${question.numId}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={handleOptionChange}
              disabled={submitted} // Désactiver après soumission
              style={{ marginRight: '10px', transform: 'scale(1.2)' }}
            />
            <label htmlFor={`option-${option.id}`} style={{ fontSize: '1.1em' }}>
              <code>{option.query}</code>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || submitted} // Désactiver si aucune option choisie ou déjà soumise
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '15px',
          fontSize: '1em',
          opacity: (selectedOption === null || submitted) ? 0.6 : 1,
        }}
      >
        Soumettre la réponse
      </button>

      {showExplanation && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
          color: isCorrect ? '#155724' : '#721c24',
          borderColor: isCorrect ? '#c3e6cb' : '#f5c6cb',
          border: '1px solid',
        }}>
            <h3 style={{ marginTop: '0' }}>{isCorrect ? 'Correct ! 🎉' : 'Incorrect. 😕'}</h3>
                <p>
                    Votre requête : <code>{localSubmittedQuery}</code>
                </p>
                <p>
                    Requête correcte : <code>{localCorrectQuery}</code>
                </p>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    Explication : {explanation}
                </p>
        </div>
      )}
    </div>
  );
};

export default Question;