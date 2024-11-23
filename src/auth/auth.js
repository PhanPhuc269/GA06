const express = require ('express');
const router =express.Router();

const AuthController= require('./controllers/AuthController');

router.get('/',AuthController.home); 
router.get('/registration',AuthController.viewRegistration);
router.post('/register',AuthController.register);
router.get('/login',AuthController.viewLogin);
router.post('/login',AuthController.login);



module.exports = router;