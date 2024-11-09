const express = require ('express');
const router =express.Router();

const sitesController= require('../app/controllers/SitesController');

router.get('/',sitesController.home); 
router.get('/registration',sitesController.viewRegistration);
router.post('/register',sitesController.register);
router.get('/login',sitesController.login);



module.exports = router;