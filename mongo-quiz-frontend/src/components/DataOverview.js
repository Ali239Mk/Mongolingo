// src/components/DataOverview.js
import React from 'react';
import { Link } from 'react-router-dom';

const DataOverview = () => {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '50px auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#2d2d2d',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#50a684',
        marginBottom: '30px'
      }}>
        Exploration des Données : Mongolingo Campus
      </h1>

      <p style={{
        fontSize: '1.1em',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#555'
      }}>
        Plongez au cœur de la base de données MongoDB de l'université Mongolingo. Cette page détaille
        la structure de chaque collection, les relations entre elles et les contraintes de validation
        pour vous aider à maîtriser les requêtes.
      </p>

      {/* Sections */}
      <Section title="Étudiants" codeLabel="students" content={studentContent} />
      <Section title="Professeurs" codeLabel="professors" content={professorContent} />
      <Section title="Cours" codeLabel="courses" content={courseContent} />
      <Section title="Notes" codeLabel="grades" content={gradesContent} />

      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: '1px solid #e4dfd7',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
      }}>
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
                transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3c8f6f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#50a684'}
            >
            Retour à l'accueil
        </Link>
        <Link
            to="/initial-data"
            style={{
                textDecoration: 'none',
                padding: '14px 28px',
                backgroundColor: '#50a684',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1em',
                transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3c8f6f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#50a684'}
            >
            Voir les données initiales
        </Link>
        <Link
          to="/quiz"
          style={{
            textDecoration: 'none',
            padding: '14px 28px',
            backgroundColor: '#50a684',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1.1em',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#3c8f6f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#50a684'}
        >
        Aller au Quiz !
        </Link>
    </div>
    </div>
  );
};

const Section = ({ title, codeLabel, content }) => (
  <div style={sectionStyle}>
    <h2 style={headingStyle}>{title} (<code style={codeInlineStyle}>{codeLabel}</code>)</h2>
    {content}
  </div>
);

// Styles
const sectionStyle = {
  marginBottom: '40px',
  padding: '25px',
  backgroundColor: '#f6f2ec',
  borderRadius: '10px',
  border: '1px solid #e8e2d9'
};

const headingStyle = {
  color: '#50a684',
  fontSize: '1.6em',
  marginBottom: '15px'
};

const codeInlineStyle = {
  backgroundColor: '#e5f3ee',
  color: '#2d6655',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace'
};

const strongStyle = {
  color: '#3c8f6f' // Un vert un peu plus foncé pour le gras
};

const preStyle = {
  backgroundColor: '#f1f1f1',
  padding: '15px',
  borderRadius: '6px',
  overflowX: 'auto',
  fontSize: '0.95em',
  marginTop: '10px',
  marginBottom: '20px',
  border: '1px solid #e0e0e0' // Ajout d'une petite bordure pour la clarté
};

// --- Contenus HTML DÉTAILLÉS pour chaque section ---
const studentContent = (
  <>
    <p>
      Cette collection gère les informations de base de nos étudiants. Chaque étudiant est identifié
      par un <strong style={strongStyle}>identifiant numérique unique</strong>, le champ <strong style={strongStyle}><code>numId</code></strong>.
    </p>
    <pre style={preStyle}>
{`{
  "numId": 301, // Numéro d'identification unique de l'étudiant (nombre entier)
  "firstName": "Emma", // Prénom de l'étudiant (chaîne de caractères)
  "lastName": "Petit", // Nom de famille de l'étudiant (chaîne de caractères)
  "email": "emma.petit@example.com", // Email unique de l'étudiant
  "coursesFollowed": [201, 204] // Tableau des numId des cours que l'étudiant suit
}`}
    </pre>
    <h3>Contraintes et Relations :</h3>
    <ul>
      <li><strong style={strongStyle}><code>numId</code></strong>: Doit être un nombre entier, <strong style={strongStyle}>requis</strong> et <strong style={strongStyle}>unique</strong> pour chaque étudiant.</li>
      <li><strong style={strongStyle}><code>firstName</code></strong>, <strong style={strongStyle}><code>lastName</code></strong>: Chaînes de caractères <strong style={strongStyle}>requises</strong>.</li>
      <li><strong style={strongStyle}><code>email</code></strong>: Chaîne de caractères <strong style={strongStyle}>requise</strong>, <strong style={strongStyle}>unique</strong> et respectant un <strong style={strongStyle}>format email valide</strong>.</li>
      <li><strong style={strongStyle}><code>coursesFollowed</code></strong>: Tableau de nombres. Chaque nombre est un <strong style={strongStyle}><code>numId</code></strong> qui fait référence à un cours dans la collection <code style={codeInlineStyle}>courses</code>. Cela modélise une relation <strong style={strongStyle}>"plusieurs-à-plusieurs"</strong> (un étudiant peut suivre plusieurs cours, un cours peut être suivi par plusieurs étudiants).</li>
    </ul>
  </>
);

const professorContent = (
  <>
    <p>
      Cette collection contient les détails sur les professeurs de l'université, incluant leurs spécialisations.
      Comme les étudiants, les professeurs sont identifiés par un <strong style={strongStyle}><code>numId</code> unique</strong>.
    </p>
    <pre style={preStyle}>
{`{
  "numId": 101, // Numéro d'identification unique du professeur (nombre entier)
  "firstName": "Alice", // Prénom du professeur (chaîne de caractères)
  "lastName": "Durand", // Nom de famille du professeur (chaîne de caractères)
  "email": "alice.durand@example.com", // Email unique du professeur
  "department": "Informatique", // Département d'enseignement
  "coursesTaught": [201, 204, 205] // Tableau des numId des cours que ce professeur enseigne
}`}
    </pre>
    <h3>Contraintes et Relations :</h3>
    <ul>
      <li><strong style={strongStyle}><code>numId</code></strong>: Doit être un nombre entier, <strong style={strongStyle}>requis</strong> et <strong style={strongStyle}>unique</strong> pour chaque professeur.</li>
      <li><strong style={strongStyle}><code>firstName</code></strong>, <strong style={strongStyle}><code>lastName</code></strong>: Chaînes de caractères <strong style={strongStyle}>requises</strong>.</li>
      <li><strong style={strongStyle}><code>email</code></strong>: Chaîne de caractères <strong style={strongStyle}>requise</strong>, <strong style={strongStyle}>unique</strong> et respectant un <strong style={strongStyle}>format email valide</strong>.</li>
      <li><strong style={strongStyle}><code>department</code></strong>: Chaîne de caractères <strong style={strongStyle}>requise</strong>, avec une <strong style={strongStyle}>énumération</strong> (valeurs prédéfinies) parmi : "Informatique", "Mathématiques", "Sciences Sociales", "Littérature", "Physique".</li>
      <li><strong style={strongStyle}><code>coursesTaught</code></strong>: Tableau de nombres. Chaque nombre est un <strong style={strongStyle}><code>numId</code></strong> qui fait référence à un cours dans la collection <code style={codeInlineStyle}>courses</code>. Cette relation est aussi <strong style={strongStyle}>"plusieurs-à-plusieurs"</strong>.</li>
    </ul>
  </>
);

const courseContent = (
  <>
    <p>
      La collection des cours détaille les différentes matières enseignées à l'université.
      Chaque cours est identifié par son <strong style={strongStyle}><code>numId</code> unique</strong>.
    </p>
    <pre style={preStyle}>
{`{
  "numId": 201, // Numéro d'identification unique du cours (nombre entier)
  "title": "Introduction à MongoDB", // Titre du cours (chaîne de caractères)
  "description": "Apprenez les bases de MongoDB et du NoSQL.", // Description détaillée du cours
  "professors": [101], // Tableau des numId des professeurs habilités à enseigner ce cours
  "duration": 20 // Durée du cours en heures (nombre entier)
}`}
    </pre>
    <h3>Contraintes et Relations :</h3>
    <ul>
      <li><strong style={strongStyle}><code>numId</code></strong>: Doit être un nombre entier, <strong style={strongStyle}>requis</strong> et <strong style={strongStyle}>unique</strong> pour chaque cours.</li>
      <li><strong style={strongStyle}><code>title</code></strong>, <strong style={strongStyle}><code>description</code></strong>: Chaînes de caractères <strong style={strongStyle}>requises</strong>, avec une longueur minimale de 5 caractères.</li>
      <li><strong style={strongStyle}><code>professors</code></strong>: Tableau de nombres. Chaque nombre est un <strong style={strongStyle}><code>numId</code></strong> qui fait référence à un professeur dans la collection <code style={codeInlineStyle}>professors</code>. Ce tableau est <strong style={strongStyle}>requis et ne doit pas être vide</strong> (un cours doit avoir au moins un professeur assigné).</li>
      <li><strong style={strongStyle}><code>duration</code></strong>: Nombre entier <strong style={strongStyle}>requis</strong>, représentant la durée en heures, avec une valeur minimale de 1 et maximale de 500.</li>
    </ul>
  </>
);

const gradesContent = (
  <>
    <p>
      Cette collection enregistre les notes obtenues par les étudiants dans chaque cours.
      Elle établit une connexion directe entre un étudiant et un cours via leurs identifiants,
      permettant de suivre l'historique des évaluations.
    </p>
    <pre style={preStyle}>
{`{
  "studentId": 301, // numId de l'étudiant concerné par cette note
  "courseId": 201, // numId du cours pour lequel la note est attribuée
  "grades": [ // Tableau des notes pour ce cours et cet étudiant
    {
      "grade": 15.5, // Note obtenue (nombre, de 0 à 20)
      "dateAwarded": { "$date": "2024-03-15T10:00:00Z" } // Date d'attribution de la note
    },
    {
      "grade": 17.0,
      "dateAwarded": { "$date": "2024-05-01T14:30:00Z" }
    }
  ]
}`}
    </pre>
    <h3>Contraintes et Relations :</h3>
    <ul>
      <li><strong style={strongStyle}><code>studentId</code></strong>: Nombre entier <strong style={strongStyle}>requis</strong>, faisant référence à un étudiant existant dans la collection <code style={codeInlineStyle}>students</code>.</li>
      <li><strong style={strongStyle}><code>courseId</code></strong>: Nombre entier <strong style={strongStyle}>requis</strong>, faisant référence à un cours existant dans la collection <code style={codeInlineStyle}>courses</code>.</li>
      <li><strong style={strongStyle}><code>grades</code></strong>: Tableau d'objets. Chaque objet `grade` doit contenir :
        <ul>
          <li><strong style={strongStyle}><code>grade</code></strong>: Nombre entier <strong style={strongStyle}>requis</strong>, représentant la note. La note doit être comprise entre 0 et 20 (inclus).</li>
          <li><strong style={strongStyle}><code>dateAwarded</code></strong>: Date <strong style={strongStyle}>requise</strong>, par défaut la date actuelle si non spécifiée.</li>
        </ul>
      </li>
      <li>Notez que cette collection modélise une relation <strong style={strongStyle}>"un-à-plusieurs"</strong> de <code style={codeInlineStyle}>students</code> vers <code style={codeInlineStyle}>grades</code> (un étudiant peut avoir plusieurs entrées de notes) et de <code style={codeInlineStyle}>courses</code> vers <code style={codeInlineStyle}>grades</code> (un cours peut avoir plusieurs notes attribuées).</li>
    </ul>
  </>
);

export default DataOverview;