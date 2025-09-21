const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Veuillez entrer une adresse email valide"] 
  },
  password: { 
    type: String, 
    required: true,
    minlength: [10, "Le mot de passe doit contenir au moins 10 caractères"] 
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);