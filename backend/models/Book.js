const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: {
        type: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true, min: 0, max: 5 }
        }
        ],
        default: []
    },
});

// Champ virtuel pour calculer la moyenne des notes
bookSchema.virtual('averageRating').get(function () {
    if (!this.ratings.length) return 0;
    const total = this.ratings.reduce((acc, r) => acc + r.grade, 0);
    return total / this.ratings.length;
});

// Pour inclure les virtuals quand on convertit en JSON
bookSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);

module.exports = mongoose.model('Book', bookSchema);