import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DataManagement = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [collectionToImport, setCollectionToImport] = useState('courses'); 

  const pageContainerStyle = {
    maxWidth: '900px',
    margin: '50px auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#2d2d2d',
    backgroundColor: '#fdfaf5',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
  };

  const sectionStyle = {
    marginBottom: '30px',
    padding: '25px',
    backgroundColor: '#f6f2ec',
    borderRadius: '10px',
    border: '1px solid #e8e2d9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };

  const headingStyle = {
    color: '#50a684',
    fontSize: '1.8em',
    marginBottom: '20px',
    borderBottom: '2px solid #50a684',
    paddingBottom: '10px'
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '12px 25px',
    backgroundColor: '#50a684',
    color: 'white',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1em',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginRight: '15px'
  };

  const buttonHoverStyle = {
    backgroundColor: '#3c8f6f'
  };

  const fileInputStyle = {
    display: 'block',
    marginTop: '10px',
    marginBottom: '20px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const messageStyle = {
    padding: '10px 15px',
    borderRadius: '5px',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '1em'
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  

  const handleCollectionChange = (event) => {
    setCollectionToImport(event.target.value);
  };

  const handleImportData = async () => {
    if (!selectedFile || !collectionToImport) {
      alert('Veuillez sélectionner un fichier et une collection.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`http://localhost:5000/api/data/import/${collectionToImport}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      console.log('Import successful:', response.data);
    } catch (error) {
      alert(`Erreur lors de l'importation: ${error.response?.data?.message || error.message}`);
      console.error('Import error:', error.response?.data || error);
    }
  };

  const handleDownload = async (format, type) => {
    let endpoint = '';
    let successMessage = '';
    let fileName = '';

    if (type === 'server') {
      endpoint = `http://localhost:5000/api/data/save/${format}`;
      successMessage = `Données sauvegardées en ${format} avec succès sur le serveur.`;
    } else if (type === 'browser') {
      endpoint = `http://localhost:5000/api/data/download/${format}`;
      successMessage = `Données exportées en ${format} et téléchargées dans votre navigateur.`;
    }

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue du serveur.' }));
        throw new Error(errorData.message || `Erreur lors de l'exportation des données.`);
      }

      if (type === 'browser') {
        const blob = await response.blob();
        // Extract filename from Content-Disposition header if possible, otherwise use a generic name
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition && contentDisposition.includes('filename=')) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
                fileName = filenameMatch[1];
            }
        }
        if (!fileName) { // Fallback if filename not in header
            fileName = `mongolingo_full_data.${format}`;
        }

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up the URL object
        setMessage(successMessage);
        setIsError(false);
      } else { // type === 'server'
        const data = await response.json();
        setMessage(data.message || successMessage);
        setIsError(false);
      }
    } catch (error) {
      console.error('Erreur d\'exportation:', error);
      setMessage(`Erreur d'exportation: ${error.message}`);
      setIsError(true);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={{ ...headingStyle, textAlign: 'center', borderBottom: 'none' }}>
        Gestion des données
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: '#555' }}>
        Chargez et sauvegardez les données de votre base MongoDB aux formats JSON et BSON.
        Cette page vous permettra d'importer de nouvelles collections ou d'exporter les existantes.
      </p>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Chargement de données dans une collection</h2>
        <p>
          Sélectionnez un fichier JSON ou BSON pour charger les données dans votre base de données.
          <br />
          Choisissez la collection dans laquelle vous souhaitez importer vos données. Attention votrefichier doit respecter les critères mentionnés sur la page d'information.
        </p>
        <select value={collectionToImport} onChange={handleCollectionChange}>
            <option value="professors">Professeurs</option>
            <option value="students">Étudiants</option>
            <option value="courses">Cours</option>
            <option value="grades">Notes</option>
            <option value="questions">Questions</option>
        </select>
        <input type="file" id="file-input" style={fileInputStyle} accept=".json,.bson" onChange={handleFileChange} />
        <button
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
          onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
          onClick={handleImportData}
        >
          Charger les données de démo
        </button>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Exportation & Sauvegarde de données</h2>
        <p>
          Choisissez comment vous souhaitez exporter les données de toutes vos collections :
          <br />
          1. Sauvegarde sur le Serveur : Les données seront exportées et enregistrées sous forme de fichiers (un par collection) dans le dossier `mongo-quiz-backend/data/saved_data` de votre serveur.
          <br />
          2. Téléchargement Direct : Toutes les données de la base seront regroupées dans un seul fichier JSON ou BSON, puis téléchargées directement dans votre navigateur.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
            <div>
                <h3>Sauvegarder sur le serveur :</h3>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => handleDownload('json', 'server')}
                >
                    JSON (Sur Serveur)
                </button>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => handleDownload('bson', 'server')}
                >
                    BSON (Sur Serveur)
                </button>
            </div>
            <div>
                <h3>Télécharger directement :</h3>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => handleDownload('json', 'browser')}
                >
                    JSON (Navigateur)
                </button>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => handleDownload('bson', 'browser')}
                >
                    BSON (Navigateur)
                </button>
            </div>
        </div>
      </div>

      {message && (
        <div style={{
          ...messageStyle,
          backgroundColor: isError ? '#ffe0e0' : '#e0ffe0',
          color: isError ? '#c00' : '#060'
        }}>
          {message}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e4dfd7' }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            padding: '14px 28px',
            backgroundColor: '#50a684',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.1em',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#3c8f6f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#50a684'}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default DataManagement;