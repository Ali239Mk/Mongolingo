const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { EJSON, BSON } = require('bson'); 
const mongoose = require('mongoose');
const multer = require('multer');

// Importer Mongoose models
const Professor = require('../models/Professor');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Grade = require('../models/Grade');
const Question = require('../models/Question');

// Define the path data folders
const DEMO_DATA_DIR = path.join(__dirname, '../data/demo_data'); // Données de démo
const SAVE_DATA_DIR = path.join(__dirname, '../data/saved_data'); // Sauvegarde
const upload = multer({ storage: multer.memoryStorage() });

if (!fs.existsSync(SAVE_DATA_DIR)) {
  fs.mkdirSync(SAVE_DATA_DIR, { recursive: true });
}
const modelsMap = {
  'professors': Professor,
  'students': Student,
  'courses': Course,
  'grades': Grade,
  'questions': Question
};

// Function to load data from JSON file
const loadCollectionFromJson = async (model, filename) => {
  const filePath = path.join(DEMO_DATA_DIR, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  await model.insertMany(data);
};

// Function to load data from BSON file
const loadCollectionFromBson = async (model, filename) => {
  const filePath = path.join(DEMO_DATA_DIR, filename); 
  const bsonData = fs.readFileSync(filePath);
  const documents = [];
  let offset = 0;
  while (offset < bsonData.length) {
    const doc = BSON.deserialize(bsonData.subarray(offset));
    documents.push(doc);
    offset += BSON.deserialize.bytesRead;
  }
  await model.insertMany(documents);
};


// --- API Routes ---

/**
 * @route POST /api/data/import/:collectionName
 * @desc Imports data from an uploaded JSON or BSON file into a specific collection.
 * The collection name is determined by the URL parameter.
 * Does NOT clear existing data. Attempts to insert new documents.
 */
router.post('/import/:collectionName', upload.single('file'), async (req, res) => {
  const { collectionName } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier n\'a été uploadé.' });
  }

  // Obtenir le modèle Mongoose correspondant
  const Model = modelsMap[collectionName.toLowerCase()];
  if (!Model) {
    return res.status(400).json({ message: `Collection '${collectionName}' non reconnue.` });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  let dataToImport;

  try {
    if (fileExtension === '.json') {
      dataToImport = JSON.parse(req.file.buffer.toString('utf8'));
    } else if (fileExtension === '.bson') {
      const bsonData = req.file.buffer;
      dataToImport = [];
      let offset = 0;
      while (offset < bsonData.length) {
        const doc = BSON.deserialize(bsonData.subarray(offset));
        dataToImport.push(doc);
        offset += BSON.deserialize.bytesRead;
      }
    } else {
      return res.status(400).json({ message: 'Format de fichier non supporté. Veuillez uploader un fichier .json ou .bson.' });
    }

    if (!Array.isArray(dataToImport)) {
        return res.status(400).json({ message: 'Le fichier JSON/BSON doit contenir un tableau de documents.' });
    }

    // Tente d'insérer les documents. utilise `validateBeforeSave: false` et `ordered: false`
    // `ordered: false` signifie que si un document échoue (ex: `numId` dupliqué), les autres continueront d'être insérés.
    const result = await Model.insertMany(dataToImport, { validateBeforeSave: true, ordered: false }); 
    console.log(`Importé ${result.insertedCount} documents dans la collection '${collectionName}'.`);
    res.status(200).json({ 
      message: `Données importées avec succès dans la collection '${collectionName}'.`,
      insertedCount: result.insertedCount,
      errors: result.writeErrors || [] 
    });

  } catch (err) {
    // Gérer les erreurs de validation ou de duplication de clé unique (E11000)
    if (err.code === 11000) {
        console.error(`Erreur de duplication lors de l'importation dans '${collectionName}':`, err.message);
        return res.status(409).json({ 
            message: `Erreur de duplication lors de l'importation dans '${collectionName}'. Certains documents n'ont pas été insérés.`, 
            error: err.message 
        });
    }
    console.error(`Erreur lors de l'importation du fichier dans '${collectionName}':`, err);
    res.status(500).json({ message: `Erreur lors de l'importation du fichier dans '${collectionName}'`, error: err.message });
  }
});


/**
 * @route GET /api/data/save/json
 * @desc Saves current database data to JSON files.
 */
router.get('/save/json', async (req, res) => {
  try {
    console.log('Starting JSON data save...');

    const professors = await Professor.find().lean();
    const students = await Student.find().lean();
    const courses = await Course.find().lean();
    const grades = await Grade.find().lean();
    const questions = await Question.find().lean();

    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'professors_saved.json'), EJSON.stringify(professors, null, 2));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'students_saved.json'), EJSON.stringify(students, null, 2));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'courses_saved.json'), EJSON.stringify(courses, null, 2));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'grades_saved.json'), EJSON.stringify(grades, null, 2));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'questions_saved.json'), EJSON.stringify(questions, null, 2));

    res.status(200).json({ message: 'Données sauvegardées en JSON avec succès dans le dossier de sauvegarde !' });
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des données JSON :', err);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde des données JSON', error: err.message });
  }
});

/**
 * @route GET /api/data/save/bson
 * @desc Saves current database data to BSON files.
 */
router.get('/save/bson', async (req, res) => {
  try {
    console.log('Starting BSON data save...');

    const professors = await Professor.find().lean();
    const students = await Student.find().lean();
    const courses = await Course.find().lean();
    const grades = await Grade.find().lean();
    const questions = await Question.find().lean();

    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'professors_saved.bson'), BSON.serialize(professors));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'students_saved.bson'), BSON.serialize(students));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'courses_saved.bson'), BSON.serialize(courses));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'grades_saved.bson'), BSON.serialize(grades));
    fs.writeFileSync(path.join(SAVE_DATA_DIR, 'questions_saved.bson'), BSON.serialize(questions));

    res.status(200).json({ message: 'Données sauvegardées en BSON avec succès dans le dossier de sauvegarde !' });
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des données BSON :', err);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde des données BSON', error: err.message });
  }
});



/**
 * @route GET /api/data/download/json
 * @desc Exports all database data as a single JSON file for direct download.
 */
router.get('/download/json', async (req, res) => {
  try {
    console.log('Starting full database JSON export for direct download...');
    const db = mongoose.connection.db; // Accès direct à la base de données

    const dataToExport = {};
    const collections = await db.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      // Exclue les collections système ou celles que tu ne veux pas exporter
      if (collectionName.startsWith('system.') || collectionName === 'quiz_questions') { 
        continue;
      }
      const documents = await db.collection(collectionName).find({}).toArray();
      dataToExport[collectionName] = documents;
    }

    const fileBuffer = Buffer.from(JSON.stringify(dataToExport, null, 2));
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const fileName = `mongolingo_full_data_${timestamp}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).send(fileBuffer);
    console.log(`Données JSON exportées et envoyées pour téléchargement : ${fileName}`);

  } catch (err) {
    console.error('Erreur lors de l\'exportation JSON pour téléchargement :', err);
    res.status(500).json({ message: 'Erreur lors de l\'exportation JSON pour téléchargement', error: err.message });
  }
});

/**
 * @route GET /api/data/download/bson
 * @desc Exports all database data as a single BSON file for direct download.
 */
router.get('/download/bson', async (req, res) => {
  try {
    console.log('Starting full database BSON export for direct download...');
    const db = mongoose.connection.db;

    const dataToExport = {};
    const collections = await db.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      // Exclue les collections système ou les questions du quiz
      if (collectionName.startsWith('system.') || collectionName === 'quiz_questions') { 
        continue;
      }
      const documents = await db.collection(collectionName).find({}).toArray();
      dataToExport[collectionName] = documents;
    }

    const fileBuffer = BSON.serialize(dataToExport);
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const fileName = `mongolingo_full_data_${timestamp}.bson`;

    res.setHeader('Content-Type', 'application/bson');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).send(fileBuffer);
    console.log(`Données BSON exportées et envoyées pour téléchargement : ${fileName}`);

  } catch (err) {
    console.error('Erreur lors de l\'exportation BSON pour téléchargement :', err);
    res.status(500).json({ message: 'Erreur lors de l\'exportation BSON pour téléchargement', error: err.message });
  }
});


module.exports = router;