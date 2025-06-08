import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../services/quizService';
import Question from './Question';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

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
      const question = questions.find(q => q.numId === questionNumId);
      const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
      const correctOption = question.options.find(opt => opt.id === question.correctOptionId);

      const result = await quizService.submitAnswer(questionNumId, selectedOptionId);
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionNumId]: {
          selectedOptionId: selectedOptionId,
          isCorrect: result.isCorrect,
          explanation: result.explanation,
          submitted: true, // Marquer comme soumise
          submittedQuery: selectedOption ? selectedOption.query : 'N/A', // La requête soumise
          correctQuery: correctOption ? correctOption.query : 'N/A' // La requête correcte
        }
      }));
      return result;
    } catch (err) {
      console.error('Erreur lors de la soumission de la réponse:', err);
      // Gérer l'erreur, afficher un message à l'utilisateur
      return { isCorrect: false, explanation: "Une erreur est survenue lors de la soumission." };
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };


  // Styles communs pour les boutons 
  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: 'red', 
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none', 
    display: 'inline-block', 
    textAlign: 'center',
    lineHeight: 'normal',
    fontFamily: 'Arial, sans-serif', 
    fontSize: '16px',            
    fontWeight: 'bold', 
  };

  // Styles spécifiques pour le bouton "Question suivante"
  const nextQuestionButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745', 
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Chargement du quiz...</div>;
  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>
      Erreur: {error}
      <br />
      <Link to="/" style={buttonStyle}>Retour à l'accueil</Link> 
    </div>
  );
  if (questions.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      Aucune question trouvée. Veuillez charger les données de démonstration.
      <br />
      <Link to="/" style={buttonStyle}>Retour à l'accueil</Link> 
    </div>
  );
  if (quizFinished) return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Quiz terminé ! Merci d'avoir participé ! 🎉</h2>
      <Link to="/" style={buttonStyle}>Retour à l'accueil</Link> 
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerData = userAnswers[currentQuestion.numId] || {};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Quiz MongoDB</h1>
      <p>Question {currentQuestionIndex + 1} sur {questions.length}</p>
      <Question
        question={currentQuestion}
        onSubmitAnswer={handleSubmitAnswer}
        selectedAnswerId={currentAnswerData.selectedOptionId}
        isPreviouslyCorrect={currentAnswerData.isCorrect}
        previousExplanation={currentAnswerData.explanation}
        previouslySubmitted={currentAnswerData.submitted}
        submittedQuery={currentAnswerData.submittedQuery}
        correctQuery={currentAnswerData.correctQuery}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Link to="/" style={buttonStyle}>Retour à l'accueil</Link>
        <button
          onClick={handlePreviousQuestion}
          style={nextQuestionButtonStyle}
          disabled={currentQuestionIndex === 0}
        >
          Question précédente
        </button>
        <button
          onClick={handleNextQuestion}
          style={nextQuestionButtonStyle}
        >
          Question suivante
        </button>
      </div>
    </div>
  );
};

export default Quiz;