const mongoose = require('mongoose');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Grade = require('../models/Grade');

// Définition de toutes les requêtes MongoDB valides pour le quiz
// Chaque clé est la chaîne de requête exacte stockée dans les objets Question.
// Les fonctions associées exécutent la logique Mongoose correspondante.
const executableQueries = {
    // --- Questions 1-10 ---
    "db.students.find({ coursesFollowed: 201 })": async () => {
        return await Student.find({ coursesFollowed: 201 }).lean();
    },
    "db.professors.aggregate([ { $match: { firstName: 'Alice', lastName: 'Durand' } }, { $project: { _id: 0, numCourses: { $size: '$coursesTaught' } } } ])": async () => {
        const alice = await Professor.findOne({ firstName: 'Alice', lastName: 'Durand' }).lean();
        if (alice && alice.coursesTaught) {
            return [{ numCourses: alice.coursesTaught.length }];
        }
        return [{ numCourses: 0 }];
    },
    "db.grades.aggregate([ { $unwind: '$scores' }, { $match: { 'scores.score': { $gt: 15 } } }, { $group: { _id: '$studentId' } } ])": async () => {
        return await Grade.aggregate([
            { $unwind: '$scores' },
            { $match: { 'scores.score': { $gt: 15 } } },
            { $group: { _id: '$studentId' } }
        ]).lean();
    },
    "db.courses.aggregate([ { $lookup: { from: 'professors', localField: 'professors', foreignField: 'numId', as: 'profInfo' } }, { $match: { 'profInfo.department': 'Informatique' } }, { $project: { _id: 0, title: 1 } } ])": async () => {
        return await Course.aggregate([
            { $lookup: { from: 'professors', localField: 'professors', foreignField: 'numId', as: 'profInfo' } },
            { $match: { 'profInfo.department': 'Informatique' } },
            { $project: { _id: 0, title: 1 } }
        ]).lean();
    },
    "db.students.aggregate([ { $match: { $expr: { $gte: [ { $size: '$coursesFollowed' }, 2 ] } } }, { $lookup: { from: 'courses', localField: 'coursesFollowed', foreignField: 'numId', as: 'courseDetails' } }, { $addFields: { totalDuration: { $sum: '$courseDetails.durationHours' } } }, { $match: { totalDuration: { $gt: 50 } } }, { $project: { _id: 0, firstName: 1, lastName: 1 } } ])": async () => {
        return await Student.aggregate([
            { $match: { $expr: { $gte: [ { $size: '$coursesFollowed' }, 2 ] } } },
            { $lookup: { from: 'courses', localField: 'coursesFollowed', foreignField: 'numId', as: 'courseDetails' } },
            { $addFields: { totalDuration: { $sum: '$courseDetails.durationHours' } } },
            { $match: { totalDuration: { $gt: 50 } } },
            { $project: { _id: 0, firstName: 1, lastName: 1 } }
        ]).lean();
    },
    "db.courses.find({ durationHours: { $gt: 20 } }, { title: 1, _id: 0 })": async () => {
        return await Course.find({ durationHours: { $gt: 20 } }, { title: 1, _id: 0 }).lean();
    },
    "db.professors.find({ department: { $in: ['Mathématiques', 'Informatique'] } })": async () => {
        return await Professor.find({ department: { $in: ['Mathématiques', 'Informatique'] } }).lean();
    },
    "db.grades.aggregate([ { $match: { courseId: 201 } }, { $unwind: '$scores' }, { $sort: { 'scores.score': -1 } }, { $limit: 1 }, { $lookup: { from: 'students', localField: 'studentId', foreignField: 'numId', as: 'studentInfo' } }, { $unwind: '$studentInfo' }, { $project: { _id: 0, firstName: '$studentInfo.firstName', lastName: '$studentInfo.lastName' } } ])": async () => {
        return await Grade.aggregate([
            { $match: { courseId: 201 } },
            { $unwind: '$scores' },
            { $sort: { 'scores.score': -1 } },
            { $limit: 1 },
            { $lookup: { from: 'students', localField: 'studentId', foreignField: 'numId', as: 'studentInfo' } },
            { $unwind: '$studentInfo' },
            { $project: { _id: 0, firstName: '$studentInfo.firstName', lastName: '$studentInfo.lastName' } }
        ]).lean();
    },
    "db.courses.aggregate([ { $lookup: { from: 'professors', localField: 'professors', foreignField: 'numId', as: 'profDetails' } }, { $unwind: '$profDetails' }, { $match: { 'profDetails.department': 'Informatique' } }, { $group: { _id: '$title', totalDuration: { $sum: '$durationHours' } } } ])": async () => {
        return await Course.aggregate([
            { $lookup: { from: 'professors', localField: 'professors', foreignField: 'numId', as: 'profDetails' } },
            { $unwind: '$profDetails' },
            { $match: { 'profDetails.department': 'Informatique' } },
            { $group: { _id: '$title', totalDuration: { $sum: '$durationHours' } } }
        ]).lean();
    },
    "db.grades.aggregate([ { $unwind: '$scores' }, { $group: { _id: '$studentId', avgScore: { $avg: '$scores.score' } } }, { $sort: { avgScore: 1 } }, { $limit: 1 }, { $lookup: { from: 'students', localField: '_id', foreignField: 'numId', as: 'studentInfo' } }, { $unwind: '$studentInfo' }, { $project: { _id: 0, firstName: '$studentInfo.firstName', lastName: '$studentInfo.lastName', avgScore: 1 } } ])": async () => {
        return await Grade.aggregate([
            { $unwind: '$scores' },
            { $group: { _id: '$studentId', avgScore: { $avg: '$scores.score' } } },
            { $sort: { avgScore: 1 } },
            { $limit: 1 },
            { $lookup: { from: 'students', localField: '_id', foreignField: 'numId', as: 'studentInfo' } },
            { $unwind: '$studentInfo' },
            { $project: { _id: 0, firstName: '$studentInfo.firstName', lastName: '$studentInfo.lastName', avgScore: 1 } }
        ]).lean();
    },

    // --- Questions 11-30 ---
    // Les requêtes qui sont des commandes shell ou des concepts ne sont pas exécutables ici.
    // Elles doivent être validées côté client ou via une logique de comparaison de chaînes.
    "show dbs": async () => {
        throw new Error("Cette commande est une commande du shell MongoDB et ne peut pas être exécutée directement via Mongoose.");
    },
    "use mongolingo_db": async () => {
        throw new Error("Cette commande est une commande du shell MongoDB et ne peut pas être exécutée directement via Mongoose.");
    },
    "db.students.find({})": async () => {
        return await Student.find({}).lean();
    },
    "firstName": async () => { throw new Error("Ceci est un nom de champ, pas une requête exécutable."); },
    "email": async () => { throw new Error("Ceci est un nom de champ, pas une requête exécutable."); },
    "lastName": async () => { throw new Error("Ceci est un nom de champ, pas une requête exécutable."); },
    "coursesFollowed": async () => { throw new Error("Ceci est un nom de champ, pas une requête exécutable."); },
    "Un document": async () => { throw new Error("Ceci est un concept, pas une requête exécutable."); },
    "Une collection": async () => { throw new Error("Ceci est un concept, pas une requête exécutable."); },
    "Une base de données": async () => { throw new Error("Ceci est un concept, pas une requête exécutable."); },
    "Un champ": async () => { throw new Error("Ceci est un concept, pas une requête exécutable."); },

    "db.professors.find({ department: \"Informatique\" })": async () => {
        return await Professor.find({ department: "Informatique" }).lean();
    },
    "db.courses.insert({ numId: 500, title: \"DevOps avec MongoDB\", description: \"...\" })": async () => {
        // Opération de modification, ne pas exécuter directement pour un quiz de lecture.
        // Ou simuler si vraiment nécessaire, en étant conscient des effets de bord.
        throw new Error("Cette opération d'insertion est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.courses.add({ numId: 500, title: \"DevOps avec MongoDB\", description: \"...\" })": async () => { throw new Error("Méthode Mongoose/MongoDB incorrecte."); },
    "db.courses.createOne({ numId: 500, title: \"DevOps avec MongoDB\", description: \"...\" })": async () => { throw new Error("Méthode Mongoose/MongoDB incorrecte."); },
    "db.courses.save({ numId: 500, title: \"DevOps avec MongoDB\", description: \"...\" })": async () => { throw new Error("Méthode Mongoose/MongoDB incorrecte."); },

    "db.students.update({ numId: 301 }, { email: \"nouveau.email@example.com\" })": async () => { throw new Error("Méthode Mongoose/MongoDB incorrecte ou dépréciée."); },
    "db.students.replaceOne({ numId: 301 }, { email: \"nouveau.email@example.com\" })": async () => { throw new Error("Cette opération remplacerait tout le document, non appropriée ici."); },
    "db.students.updateOne({ numId: 301 }, { $set: { email: \"nouveau.email@example.com\" } })": async () => {
        // Opération de modification, ne pas exécuter directement.
        throw new Error("Cette opération de mise à jour est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.students.edit({ numId: 301 }, { email: \"nouveau.email@example.com\" })": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante."); },

    "db.grades.find({ studentId: 301, courseId: 201 })": async () => {
        return await Grade.find({ studentId: 301, courseId: 201 }).lean();
    },
    "db.grades.find({ grades: { $elemMatch: { studentId: 301, courseId: 201 } } })": async () => { throw new Error("Syntaxe incorrecte pour le champ 'grades'."); },
    "db.grades.filter({ student: 301, course: 201 })": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante."); },
    "db.grades.getNotes(301, 201)": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante."); },

    "$gt": async () => { throw new Error("'$gt' est un opérateur, pas une requête exécutable."); },
    "$lt": async () => { throw new Error("'$lt' est un opérateur, pas une requête exécutable."); },
    "$eq": async () => { throw new Error("'$eq' est un opérateur, pas une requête exécutable."); },
    "$gte": async () => { throw new Error("'$gte' est un opérateur, pas une requête exécutable."); },

    "$sum": async () => { throw new Error("'$sum' est un accumulateur d'agrégation, pas une étape d'agrégation autonome."); },
    "$avg": async () => { throw new Error("'$avg' est un accumulateur d'agrégation, pas une étape d'agrégation autonome."); },
    "$group avec $avg": async () => { throw new Error("Ceci est une description d'étape d'agrégation, pas une requête exécutable."); },
    "$project avec $avg": async () => { throw new Error("Ceci est une description d'étape d'agrégation, pas une requête exécutable."); },

    "db.createCollection(\"courses\", { validator: { $jsonSchema: { properties: { durationHours: { minimum: 1, maximum: 500 } } } } })": async () => {
        // Opération de création/modification de collection, non exécutable pour un quiz de lecture.
        throw new Error("Cette opération est de nature conceptuelle (validation de schéma) et ne peut pas être exécutée directement comme une requête de lecture/agrégation.");
    },
    "db.courses.addValidation({ durationHours: { $gte: 1, $lte: 500 } })": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante."); },
    "db.courses.setRule({ durationHours: { $in: [1, 500] } })": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante."); },
    "db.courses.schema({ durationHours: Number().min(1).max(500) })": async () => { throw new Error("Méthode Mongoose/MongoDB inexistante ou non standard."); },

    "db.courses.find({ professors: 101 }, { title: 1 })": async () => {
        return await Course.find({ professors: 101 }, { title: 1, _id: 0 }).lean();
    },
    "db.courses.aggregate([ { $match: { professors: 101 } }, { $project: { title: 1, _id: 0 } } ])": async () => {
        return await Course.aggregate([
            { $match: { professors: 101 } },
            { $project: { title: 1, _id: 0 } }
        ]).lean();
    },
    "db.professors.aggregate([ { $lookup: { from: \"courses\", localField: \"coursesTaught\", foreignField: \"numId\", as: \"taughtCourses\" } }, { $unwind: \"$taughtCourses\" }, { $match: { \"numId\": 101 } }, { $project: { \"taughtCourses.title\": 1, _id: 0 } } ])": async () => {
        return await Professor.aggregate([
            { $lookup: { from: "courses", localField: "coursesTaught", foreignField: "numId", as: "taughtCourses" } },
            { $unwind: "$taughtCourses" },
            { $match: { "numId": 101 } },
            { $project: { "taughtCourses.title": 1, _id: 0 } }
        ]).lean();
    },
    "db.courses.find({ \"professors\": { $in: [101] } }).select(\"title\")": async () => { throw new Error("'.select()' est une méthode Mongoose, pas du shell MongoDB."); },

    "En ajoutant un index sur le champ `_id`.": async () => { throw new Error("Ceci est une description de concept, pas une requête exécutable."); },
    "En ajoutant un index unique sur le champ `email`.": async () => { throw new Error("Ceci est une description de concept, pas une requête exécutable."); },
    "En ajoutant un index sur le champ `numId`.": async () => { throw new Error("Ceci est une description de concept, pas une requête exécutable."); },
    "En réorganisant les documents physiquement.": async () => { throw new Error("Ceci est une description de concept, pas une requête exécutable."); },

    "Chercher le `numId` du cours, puis trouver les étudiants avec ce `numId` dans `coursesFollowed`, puis projeter.": async () => { throw new Error("Ceci est une description textuelle d'une approche, pas une requête exécutable."); },
    "db.students.aggregate([ { $lookup: { from: \"courses\", localField: \"coursesFollowed\", foreignField: \"numId\", as: \"enrolledCourses\" } }, { $match: { \"enrolledCourses.title\": \"Introduction à MongoDB\" } }, { $project: { fullName: { $concat: [\"$firstName\", \" \", \"$lastName\"] }, _id: 0 } } ])": async () => {
        return await Student.aggregate([
            { $lookup: { from: "courses", localField: "coursesFollowed", foreignField: "numId", as: "enrolledCourses" } },
            { $match: { "enrolledCourses.title": "Introduction à MongoDB" } },
            { $project: { fullName: { $concat: ["$firstName", " ", "$lastName"] }, _id: 0 } }
        ]).lean();
    },
    "db.courses.aggregate([ { $match: { title: \"Introduction à MongoDB\" } }, { $lookup: { from: \"students\", localField: \"numId\", foreignField: \"coursesFollowed\", as: \"studentsEnrolled\" } }, { $unwind: \"$studentsEnrolled\" }, { $project: { fullName: { $concat: [\"$studentsEnrolled.firstName\", \" \", \"$studentsEnrolled.lastName\"] }, _id: 0 } } ])": async () => {
        return await Course.aggregate([
            { $match: { title: "Introduction à MongoDB" } },
            { $lookup: { from: "students", localField: "numId", foreignField: "coursesFollowed", as: "studentsEnrolled" } },
            { $unwind: "$studentsEnrolled" },
            { $project: { fullName: { $concat: ["$studentsEnrolled.firstName", " ", "$studentsEnrolled.lastName"] }, _id: 0 } }
        ]).lean();
    },
    "Les options 2 et 3 sont toutes les deux de bonnes approches d'agrégation.": async () => { throw new Error("Ceci est une explication de réponse, pas une requête exécutable."); },

    "db.students.countDocuments({ coursesFollowed: [] })": async () => {
        return await Student.countDocuments({ coursesFollowed: [] });
    },
    "db.students.find({ coursesFollowed: { $size: 0 } }).count()": async () => { throw new Error("'.count()' est déprécié, utilisez countDocuments()."); },
    "db.students.aggregate([ { $match: { coursesFollowed: { $exists: true, $size: 0 } } }, { $count: \"noCoursesStudents\" } ])": async () => {
        return await Student.aggregate([
            { $match: { coursesFollowed: { $exists: true, $size: 0 } } },
            { $count: "noCoursesStudents" }
        ]).lean();
    },
    "db.students.count({ coursesFollowed: null })": async () => { throw new Error("Ceci filtre sur 'null', pas un tableau vide."); },

    "db.courses.find({ durationHours: { $gt: 30 } })": async () => {
        return await Course.find({ durationHours: { $gt: 30 } }).lean();
    },
    "db.grades.aggregate([ { $group: { _id: '$courseId' } }, { $lookup: { from: 'courses', localField: '_id', foreignField: 'numId', as: 'courseInfo' } }, { $unwind: '$courseInfo' }, { $match: { 'courseInfo.durationHours': { $gt: 30 } } }, { $project: { _id: 0, title: '$courseInfo.title' } } ])": async () => {
        return await Grade.aggregate([
            { $group: { _id: '$courseId' } },
            { $lookup: { from: 'courses', localField: '_id', foreignField: 'numId', as: 'courseInfo' } },
            { $unwind: '$courseInfo' },
            { $match: { 'courseInfo.durationHours': { $gt: 30 } } },
            { $project: { _id: 0, title: '$courseInfo.title' } }
        ]).lean();
    },
    "db.courses.aggregate([ { $match: { durationHours: { $gt: 30 } } }, { $lookup: { from: 'grades', localField: 'numId', foreignField: 'courseId', as: 'gradesInfo' } }, { $match: { 'gradesInfo.0': { $exists: true } } }, { $project: { _id: 0, title: 1 } } ])": async () => {
        return await Course.aggregate([
            { $match: { durationHours: { $gt: 30 } } },
            { $lookup: { from: 'grades', localField: 'numId', foreignField: 'courseId', as: 'gradesInfo' } },
            { $match: { 'gradesInfo.0': { $exists: true } } },
            { $project: { _id: 0, title: 1 } }
        ]).lean();
    },
    "Les options 2 et 3 sont toutes les deux de bonnes approches d'agrégation.": async () => { throw new Error("Ceci est une explication de réponse, pas une requête exécutable."); },

    "db.courses.insertOne({ numId: 206, title: \"Bases de données NoSQL\", description: \"...\", professors: [102] })": async () => {
        // Opération de modification
        throw new Error("Cette opération d'insertion est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.courses.update({ numId: 206 }, { $set: { title: \"Bases de données NoSQL\", description: \"...\", professors: [102] } }, { upsert: true })": async () => {
        // Opération de modification
        throw new Error("Cette opération de mise à jour/upsert est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.courses.updateOne({ numId: 206 }, { $setOnInsert: { numId: 206, title: \"Bases de données NoSQL\", description: \"...\", professors: [102] } }, { upsert: true })": async () => {
        // Opération de modification
        throw new Error("Cette opération de mise à jour/upsert avec $setOnInsert est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.courses.replaceOne({ numId: 206 }, { numId: 206, title: \"Bases de données NoSQL\", description: \"...\", professors: [102] }, { upsert: true })": async () => {
        // Opération de modification
        throw new Error("Cette opération de remplacement/upsert est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },

    "db.grades.aggregate([ { $unwind: '$scores' }, { $match: { 'scores.dateAwarded': { $gte: new Date('2024-04-01T00:00:00Z') } } }, { $count: 'notesAfterApril1st' } ])": async () => {
        return await Grade.aggregate([
            { $unwind: '$scores' },
            // Utiliser new Date() pour Mongoose, ISODate() est pour le shell
            { $match: { 'scores.dateAwarded': { $gte: new Date('2024-04-01T00:00:00.000Z') } } },
            { $count: 'notesAfterApril1st' }
        ]).lean();
    },
    "db.grades.find({ 'scores.dateAwarded': { $gt: new Date('2024-04-01') } }).count()": async () => { throw new Error("'.count()' est déprécié et le filtre peut être incorrect sans unwind."); },
    "db.grades.countDocuments({ 'scores.dateAwarded': { $gte: ISODate('2024-04-01T00:00:00Z') } })": async () => { throw new Error("Sans unwind, ne comptera que les documents parent, pas chaque note."); },
    "db.grades.find({ 'scores.dateAwarded': { $gte: '2024-04-01' } }).count()": async () => { throw new Error("Les comparaisons de dates doivent utiliser des objets Date."); },

    "db.professors.deleteMany({ coursesTaught: [] })": async () => {
        // Opération de modification
        throw new Error("Cette opération de suppression est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.professors.remove({ coursesTaught: { $size: 0 } })": async () => { throw new Error("'.remove()' est déprécié, utilisez deleteMany()."); },
    "db.professors.deleteMany({ coursesTaught: { $exists: true, $size: 0 } })": async () => {
        // Opération de modification
        throw new Error("Cette opération de suppression est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    },
    "db.professors.deleteOne({ coursesTaught: { $size: 0 } })": async () => {
        // Opération de modification
        throw new Error("Cette opération de suppression est de nature conceptuelle pour le quiz et non exécutable directement comme une requête de lecture/agrégation.");
    }
};

/**
 * Exécute une requête MongoDB pré-définie et autorisée.
 * @param {string} queryString La chaîne de requête exacte telle que stockée dans les objets Question.
 * @returns {Promise<Array|Object>} Le résultat de l'exécution de la requête.
 * @throws {Error} Si la requête n'est pas reconnue ou si une erreur survient lors de l'exécution (y compris pour les requêtes non exécutables ici).
 */
async function runMongoDBQuery(queryString) {
    try {
        const queryFunction = executableQueries[queryString];

        if (queryFunction) {
            // Exécute la fonction associée à la chaîne de requête
            const result = await queryFunction();
            // Retourne le résultat.
            return result;
        } else {
            console.warn(`Attempted to execute an unknown or unauthorized query string: "${queryString}"`);
            throw new Error(`Requête non reconnue ou non autorisée : "${queryString}". Vérifiez la liste 'executableQueries'.`);
        }
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la requête MongoDB "${queryString}" :`, error);
        // Lance une nouvelle erreur pour que le bloc catch appelant puisse la gérer
        throw new Error("Échec de l'exécution de la requête MongoDB : " + error.message);
    }
}

module.exports = { runMongoDBQuery };