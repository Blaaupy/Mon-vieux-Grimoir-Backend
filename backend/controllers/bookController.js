const Book = require('../models/Book');
const fs = require('fs');

// --- Créer un livre ---
exports.createBook = (req, res, next) => {
  const bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error: error.message || error }));
};

// --- Ajouter une note à un livre ---
exports.postRating = (req, res) => {
  const { userId, rating } = req.body;
  if (rating < 0 || rating > 5) return res.status(400).json({ message: 'La note doit être entre 0 et 5' });

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      // Vérifier si l'utilisateur a déjà noté
      const existingRating = book.ratings.find(r => r.userId === userId);
      if (existingRating) {
        existingRating.grade = rating; // garde le champ grade déjà enregister
      } else {
        book.ratings.push({ userId, grade: rating });
      }

      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(400).json({ error }));
};

// --- Modifier un livre ---
exports.modifyBook = (req, res, next) => {
  const bookUpdates = req.file
    ? { ...JSON.parse(req.body.book) } // cas où on a une nouvelle image
    : { ...req.body };                 // sinon juste les champs texte

  delete bookUpdates._userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      if (req.file) {
        const oldFilename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${oldFilename}`, (err) => {
          if (err) console.log("Erreur suppression image :", err);
        });

        // met à jour le champ imageUrl avec la nouvelle
        bookUpdates.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      } else {
        // sinon garder l'ancienne image
        bookUpdates.imageUrl = book.imageUrl;
      }

      Object.assign(book, bookUpdates);

      return book.save();
    })
    .then(updatedBook => res.status(200).json(updatedBook))
    .catch(error => res.status(400).json({ error }));
};



// --- Supprimer un livre ---
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) console.log('Erreur suppression image:', err);

        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// --- Récupérer tous les livres ---
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// --- Récupérer un livre ---
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// --- Récupérer les 3 livres les mieux notés ---
exports.getBestRating = (req, res) => {
  Book.find()
    .then(books => {
      // Trier par moyenne des notes descendante
      books.sort((a, b) => b.averageRating - a.averageRating);
      res.status(200).json(books.slice(0, 3));
    })
    .catch(error => res.status(400).json({ error }));
};