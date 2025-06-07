import axios from 'axios';

const API_BASE_URL = '/api'; // l39 dans package.json, ça pointe vers http://localhost:5000/api

const quizService = {
  // Récupère toutes les questions
  getAllQuestions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des questions :', error);
      throw error;
    }
  },

  // Récupère une question spécifique par son ID
  getQuestionById: async (numId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/${numId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la question ${numId} :`, error);
      throw error;
    }
  },

  // Soumet une réponse pour une question
  submitAnswer: async (questionNumId, selectedOptionId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz/${questionNumId}/answer`, { selectedOptionId });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la soumission de la réponse pour la question ${questionNumId} :`, error);
      throw error;
    }
  },

  // Fonctions pour gérer les données de démo (pour les tests)
  loadDemoData: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/data/load/json`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données de démonstration :', error);
      throw error;
    }
  },

  saveCurrentData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data/save/json`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données actuelles :', error);
      throw error;
    }
  }
};

export default quizService;