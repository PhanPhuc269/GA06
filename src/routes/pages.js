const express = require ('express');
const router =express.Router();

const pagesController= require('../app/controllers/PagesController');

router.get('/tracking',pagesController.tracking); 
router.get('/elements',pagesController.elements);



module.exports = router;