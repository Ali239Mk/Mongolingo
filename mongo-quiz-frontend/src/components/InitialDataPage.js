// src/components/InitialDataPage.js
import React from 'react';
import { Link } from 'react-router-dom';

// --- Données en dur ---
const coursesData = [
  {
    "numId": 201,
    "title": "Introduction à MongoDB",
    "description": "Apprenez les bases de MongoDB et du NoSQL.",
    "professors": [101],
    "durationHours": 20
  },
  {
    "numId": 202,
    "title": "Algorithmes avancés",
    "description": "Approfondissez les structures de données et les algorithmes complexes.",
    "professors": [102, 104],
    "durationHours": 35
  },
  {
    "numId": 203,
    "title": "Sociologie numérique",
    "description": "Explorez l'impact du numérique sur la société.",
    "professors": [103],
    "durationHours": 15
  },
  {
    "numId": 204,
    "title": "Développement Web avec React",
    "description": "Construisez des applications web interactives avec React.",
    "professors": [101, 104],
    "durationHours": 40
  },
  {
    "numId": 205,
    "title": "Analyse de données avec Python",
    "description": "Introduction à l'analyse de données avec Python.",
    "professors": [101],
    "durationHours": 25
  }
];

const gradesData = [
  {
    "studentId": 301,
    "courseId": 201,
    "scores": [
      { "score": 15.5, "dateAwarded": { "$date": "2024-03-15T10:00:00Z" } },
      { "score": 17.0, "dateAwarded": { "$date": "2024-05-01T14:30:00Z" } }
    ]
  },
  {
    "studentId": 301,
    "courseId": 204,
    "scores": [
      { "score": 13.0, "dateAwarded": { "$date": "2024-04-20T09:00:00Z" } }
    ]
  },
  {
    "studentId": 302,
    "courseId": 201,
    "scores": [
      { "score": 18.5, "dateAwarded": { "$date": "2024-03-20T11:00:00Z" } }
    ]
  },
  {
    "studentId": 302,
    "courseId": 202,
    "scores": [
      { "score": 9.5, "dateAwarded": { "$date": "2024-05-10T16:00:00Z" } }
    ]
  },
  {
    "studentId": 303,
    "courseId": 203,
    "scores": [
      { "score": 14.0, "dateAwarded": { "$date": "2024-04-01T13:00:00Z" } }
    ]
  },
  {
    "studentId": 304,
    "courseId": 202,
    "scores": [
      { "score": 11.0, "dateAwarded": { "$date": "2024-05-12T10:00:00Z" } }
    ]
  },
  {
    "studentId": 305,
    "courseId": 201,
    "scores": [
      { "score": 16.0, "dateAwarded": { "$date": "2024-03-25T08:00:00Z" } }
    ]
  }
];

const professorsData = [
  {
    "numId": 101,
    "firstName": "Alice",
    "lastName": "Durand",
    "email": "alice.durand@example.com",
    "department": "Informatique",
    "coursesTaught": []
  },
  {
    "numId": 102,
    "firstName": "Bob",
    "lastName": "Martin",
    "email": "bob.martin@example.com",
    "department": "Mathématiques",
    "coursesTaught": []
  },
  {
    "numId": 103,
    "firstName": "Carole",
    "lastName": "Lefebvre",
    "email": "carole.lefebvre@example.com",
    "department": "Sciences Sociales",
    "coursesTaught": []
  },
  {
    "numId": 104,
    "firstName": "David",
    "lastName": "Dubois",
    "email": "david.dubois@example.com",
    "department": "Informatique",
    "coursesTaught": []
  }
];

const studentsData = [
  {
    "numId": 301,
    "firstName": "Emma",
    "lastName": "Petit",
    "email": "emma.petit@example.com",
    "coursesFollowed": [201, 204]
  },
  {
    "numId": 302,
    "firstName": "Lucas",
    "lastName": "Roux",
    "email": "lucas.roux@example.com",
    "coursesFollowed": [201, 202]
  },
  {
    "numId": 303,
    "firstName": "Manon",
    "lastName": "Lambert",
    "email": "manon.lambert@example.com",
    "coursesFollowed": [203]
  },
  {
    "numId": 304,
    "firstName": "Tom",
    "lastName": "Dupont",
    "email": "tom.dupont@example.com",
    "coursesFollowed": [202, 204]
  },
  {
    "numId": 305,
    "firstName": "Léa",
    "lastName": "Bernard",
    "email": "lea.bernard@example.com",
    "coursesFollowed": [201, 205]
  }
];


// --- Composants de carte génériques ---
const Card = ({ title, children }) => (
  <div style={{
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <h3 style={{ color: '#3c8f6f', marginBottom: '15px' }}>{title}</h3>
    <div style={{ fontSize: '0.95em', color: '#4a4a4a' }}>
      {children}
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <Card title={`Cours: ${course.title} (ID: ${course.numId})`}>
    <p><strong>Description:</strong> {course.description}</p>
    <p><strong>Professeurs ID:</strong> {course.professors.join(', ')}</p>
    <p><strong>Durée:</strong> {course.durationHours} heures</p>
  </Card>
);

const StudentCard = ({ student }) => (
  <Card title={`Étudiant: ${student.firstName} ${student.lastName} (ID: ${student.numId})`}>
    <p><strong>Email:</strong> {student.email}</p>
    <p><strong>Cours Suivis ID:</strong> {student.coursesFollowed.length > 0 ? student.coursesFollowed.join(', ') : 'Aucun'}</p>
  </Card>
);

const ProfessorCard = ({ professor }) => (
  <Card title={`Professeur: ${professor.firstName} ${professor.lastName} (ID: ${professor.numId})`}>
    <p><strong>Email:</strong> {professor.email}</p>
    <p><strong>Département:</strong> {professor.department}</p>
    <p><strong>Cours Enseignés ID:</strong> {professor.coursesTaught.length > 0 ? professor.coursesTaught.join(', ') : 'Aucun'}</p>
  </Card>
);

const GradeCard = ({ grade }) => (
  <Card title={`Notes Étudiant ${grade.studentId} - Cours ${grade.courseId}`}>
    <p><strong>Notes:</strong></p>
    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
      {grade.scores.map((score, index) => (
        <li key={index} style={{ marginBottom: '5px' }}>
          - {score.score}/20 (le {new Date(score.dateAwarded.$date).toLocaleDateString()})
        </li>
      ))}
    </ul>
  </Card>
);


const InitialDataPage = () => {
  return (
    <div style={{
      maxWidth: '1200px', // Largeur un peu plus grande pour les cartes
      margin: '50px auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#2d2d2d',
      backgroundColor: '#f8f8f8', // Couleur de fond légèrement différente
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#50a684',
        marginBottom: '30px'
      }}>
        Aperçu des Données Initiales du Campus Mongolingo
      </h1>

      <p style={{
        fontSize: '1.1em',
        marginBottom: '40px',
        textAlign: 'center',
        color: '#555'
      }}>
        Découvrez les données de base pré-remplies dans votre base de données MongoDB, organisées par collection.
        <br></br>Chaque carte représente une entrée.
      </p>


      {/* Section Cours */}
      <h2 style={{ color: '#50a684', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', marginBottom: '30px' }}>
        Les cours "courses"
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Grille responsive
        gap: '25px',
        marginBottom: '50px'
      }}>
        {coursesData.map(course => (
          <CourseCard key={course.numId} course={course} />
        ))}
      </div>


      {/* Section Étudiants */}
      <h2 style={{ color: '#50a684', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', marginBottom: '30px' }}>
        Les étudiants "students"
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        {studentsData.map(student => (
          <StudentCard key={student.numId} student={student} />
        ))}
      </div>

      {/* Section Professeurs */}
      <h2 style={{ color: '#50a684', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', marginBottom: '30px' }}>
        Les professeurs "professors"
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        {professorsData.map(professor => (
          <ProfessorCard key={professor.numId} professor={professor} />
        ))}
      </div>


      {/* Section Notes */}
      <h2 style={{ color: '#50a684', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', marginBottom: '30px' }}>
        Les notes "grades"
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        {gradesData.map((grade, index) => (
          <GradeCard key={index} grade={grade} /> 
        ))}
      </div>

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
                    to="/data-overview"
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
                    Retourner au schéma des données
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
          Prêt à tester vos connaissances ? Aller au Quiz !
        </Link>
      </div>
    </div>
  );
};

export default InitialDataPage;