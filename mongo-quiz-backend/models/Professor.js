const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  numId: { type: Number, required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  },
  department: { 
    type: String, 
    required: true, 
    enum: ["Informatique", "Mathématiques", "Sciences Sociales", "Littérature", "Physique"] 
  },
  coursesTaught: [{ type: Number, ref: 'Course'}] // Tableau d'IDs de cours
});

module.exports = mongoose.model('Professor', professorSchema);