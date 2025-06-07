const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: Number, required: true }, // ID de l'étudiant
  courseId: { type: Number, required: true }, // ID du cours
  grades: [{
    grade: { type: Number, required: true, min: 0, max: 20 }, // Note de l'étudiant
    dateAwarded: { type: Date, required: true, default: Date.now } // Date de la note
  }],
});

module.exports = mongoose.model('Grade', gradeSchema);