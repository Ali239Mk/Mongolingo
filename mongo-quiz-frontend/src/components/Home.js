import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const buttonBackgroundColor = '#6db193';
  const buttonHoverColor = '#569e80';
  const buttonBoxShadow = '0 4px 14px rgba(109, 177, 147, 0.3)';

  return (
    <div style={{
      fontFamily: 'Inter, Segoe UI, sans-serif',
      background: '#6db193',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
    }}>
      <div style={{
        backgroundColor: '#fefefe',
        padding: '50px',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.75rem',
          marginBottom: '25px',
          color: '#3e3e3e',
        }}>
          Bienvenue sur <span style={{ color: '#6db193' }}>Mongolingo</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#3e3e3e',
          marginBottom: '18px',
          lineHeight: '1.8',
        }}>
          Apprenez à manipuler <strong>MongoDB</strong> à travers des scénarios réels
          en explorant une base de données universitaire simulée.
        </p>

        <p style={{
          fontSize: '1.1rem',
          color: '#3e3e3e',
          marginBottom: '35px',
          lineHeight: '1.7',
        }}>
          Entraînez-vous sur des cas concrets : étudiants, professeurs, cours et notes — et maîtrisez les opérations <strong>CRUD</strong> et les requêtes complexes.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <Link
            to="/quiz"
            style={{
              padding: '14px 32px',
              backgroundColor: buttonBackgroundColor,
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: buttonBoxShadow,
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonBackgroundColor}
          >
            ✨ Commencer le Quiz
          </Link>

          <Link
            to="/data-overview"
            style={{
              padding: '14px 32px',
              backgroundColor: buttonBackgroundColor,
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: buttonBoxShadow,
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonBackgroundColor}
          >
            🔍 Explorer les Données
          </Link>

          {/* Nouveau bouton pour la gestion des données */}
          <Link
            to="/data-management" // Nouvelle route pour la page de gestion des données
            style={{
              padding: '14px 32px',
              backgroundColor: buttonBackgroundColor,
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: buttonBoxShadow,
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonBackgroundColor}
          >
            💾 Gérer les Données
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;