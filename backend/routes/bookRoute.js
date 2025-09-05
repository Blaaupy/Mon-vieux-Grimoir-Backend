const express = require('express');
const auth = require('../middleware/auth');
const bookCrtl = require('../controllers/bookController');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.post('/', auth, multer, bookCrtl.createBook);

router.get('/:id', bookCrtl.getOneBook);

router.get('/', bookCrtl.getAllBooks);

router.put('/:id', auth, bookCrtl.modifyBook);

router.delete('/:id', auth, bookCrtl.deleteBook);

module.exports = router;