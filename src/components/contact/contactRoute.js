const express = require ('express');
const router =express.Router();

const contactController= require('./controllers/ContactController');

router.get('/',contactController.contact);

module.exports = router;