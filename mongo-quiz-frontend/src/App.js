import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DataOverview from './components/DataOverview';
import Quiz from './components/Quiz'; 
import DataManagement from './components/DataManagement'; 
import InitialDataPage from './components/InitialDataPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-overview" element={<DataOverview />} />
        <Route path="/quiz" element={<Quiz />} /> 
        <Route path="/data-management" element={<DataManagement />} /> 
        <Route path="/initial-data" element={<InitialDataPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;