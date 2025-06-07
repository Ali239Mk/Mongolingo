const mongoose = require('mongoose');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Grade = require('../models/Grade');
const Question = require('../models/Question');

// Définition de toutes les requêtes MongoDB valides pour le quiz
// Chaque clé est la chaîne de requête exacte stockée dans les objets Question
const executableQueries = {
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
    "db.courses.aggregate([ { $lookup: { from: 'professors', localField: 'professors', foreignField: '_id', as: 'profInfo' } }, { $match: { 'profInfo.department': 'Informatique' } }, { $project: { _id: 0, title: 1 } } ])": async () => {
        return await Course.aggregate([
            { $lookup: { from: 'professors', localField: 'professors', foreignField: '_id', as: 'profInfo' } },
            { $match: { 'profInfo.department': 'Informatique' } },
            { $project: { _id: 0, title: 1 } }
        ]).lean();
    },
    "db.students.aggregate([ { $match: { $expr: { $gte: [ { $size: '$coursesFollowed' }, 2 ] } } }, { $lookup: { from: 'courses', localField: 'coursesFollowed', foreignField: '_id', as: 'courseDetails' } }, { $addFields: { totalDuration: { $sum: '$courseDetails.durationHours' } } }, { $match: { totalDuration: { $gt: 50 } } }, { $project: { _id: 0, firstName: 1, lastName: 1 } } ])": async () => {
        return await Student.aggregate([
            { $match: { $expr: { $gte: [ { $size: '$coursesFollowed' }, 2 ] } } },
            { $lookup: { from: 'courses', localField: 'coursesFollowed', foreignField: '_id', as: 'courseDetails' } },
            { $addFields: { totalDuration: { $sum: '$courseDetails.durationHours' } } },
            { $match: { totalDuration: { $gt: 50 } } },
            { $project: { _id: 0, firstName: 1, lastName: 1 } }
        ]).lean();
    },
};

async function runMongoDBQuery(queryString) {
    try {
        const queryFunction = executableQueries[queryString];

        if (queryFunction) {
            return await queryFunction();
        } else {
            // Si la chaîne de requête n'est pas dans notre liste pré-approuvée,
            // nous ne l'exécutons pas et renvoyons un message d'erreur ou un résultat vide.
            console.warn(`Attempted to execute an unknown or unauthorized query string: "${queryString}"`);
            throw new Error(`Requête non reconnue ou non autorisée : "${queryString}"`);
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête MongoDB :", error);
        throw new Error("Échec de l'exécution de la requête MongoDB : " + error.message);
    }
}

module.exports = { runMongoDBQuery };