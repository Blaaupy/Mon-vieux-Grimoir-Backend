const express = require('express');
const auth = require('../middleware/auth');
const bookCrtl = require('../controllers/bookController');
const { upload, resizeImage } = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, upload, resizeImage, bookCrtl.createBook);

router.post('/:id/rating', auth, bookCrtl.postRating);

router.get('/bestrating', bookCrtl.getBestRating);

router.get('/:id', bookCrtl.getOneBook);

router.get('/', bookCrtl.getAllBooks);

router.put('/:id', auth, upload, resizeImage, bookCrtl.modifyBook);

router.delete('/:id', auth, bookCrtl.deleteBook);

module.exports = router;