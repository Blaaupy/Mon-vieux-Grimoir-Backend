const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage(); // On stocke l'image en mémoire pour la traiter
const upload = multer({ storage: storage }).single('image');

const resizeImage = async (req, res, next) => {
  if (!req.file) return next(); // Pas d'image à traiter

  const filename = req.file.originalname.split(' ').join('_') + Date.now() + '.webp';
  const outputPath = path.join('images', filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 750, height: 750, fit: 'cover' }) // largeur x hauteur en pixels
      .toFormat('webp', { quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename; // on met à jour le nom de fichier pour le controller
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erreur lors du traitement de l’image' });
  }
};

module.exports = { upload, resizeImage };
