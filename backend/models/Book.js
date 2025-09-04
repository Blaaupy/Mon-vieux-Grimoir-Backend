const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishDate: { type: Number, required: true },
    genre: { type: String, required: true },
    rating: {},
});

module.exports = mongoose.model('Book', bookSchema);