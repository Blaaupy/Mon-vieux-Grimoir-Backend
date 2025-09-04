const express = require('express');
const router = express.Router();

const bookCrtl = require('../controllers/bookController');

router.post('/', bookCrtl.createBook);

router.get('/:id', bookCrtl.getOneBook);

router.get('/', bookCrtl.getAllBooks);

router.put('/:id', bookCrtl.modifyBook);

router.delete('/:id', bookCrtl.deleteBook);

module.exports = router;