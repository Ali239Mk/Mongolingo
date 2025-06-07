const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  numId: { type: Number, required: true, unique: true },
  title: { type: String, required: true, minlength: 5 },
  description: { type: String, required: true, minlength: 5 },
  professors: {
    type: [{ type: Number, ref: 'Professor' }], // Tableau d'IDs de professeurs 
    validate: { 
      validator: function(v) {
        return v && v.length >= 1; // Vérifie que le tableau n'est pas vide
      },
      message: props => `Un cours doit avoir au moins un professeur !`
    },
    required: true 
},
  durationHours: {
    type: Number, // Durée en heures
    required: true,
    min: 1, // Durée minimale de 1 heure
    max: 500
  }
});

module.exports = mongoose.model('Course', courseSchema);