import React, { useState, useEffect } from 'react';
import quizService from '../services/quizService';
import Question from './Question';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await quizService.getAllQuestions();
        //Tri, à modifier quand il y aura plus de niveaux/questions
        setQuestions(data.sort((a, b) => a.level - b.level));
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les questions du quiz.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmitAnswer = async (questionNumId, selectedOptionId) => {
    try {
      const result = await quizService.submitAnswer(questionNumId, selectedOptionId);
      return result;
    } catch (err) {
      console.error('Erreur lors de la soumission de la réponse:', err);
      // Gérer l'erreur, afficher un message à l'utilisateur
      return { isCorrect: false, explanation: "Une erreur est survenue lors de la soumission." };
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement du quiz...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Erreur: {error}</div>;
  if (questions.length === 0) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Aucune question trouvée. Veuillez charger les données de démonstration.</div>;
  if (quizFinished) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Quiz terminé ! Merci d'avoir participé ! 🎉</h2></div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Quiz MongoDB</h1>
      <p>Question {currentQuestionIndex + 1} sur {questions.length}</p>
      <Question
        question={currentQuestion}
        onSubmitAnswer={handleSubmitAnswer}
      />
      <button
        onClick={handleNextQuestion}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Question suivante
      </button>
    </div>
  );
};

export default Quiz;