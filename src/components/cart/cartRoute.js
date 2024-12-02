const express = require ('express');
const router =express.Router();
const cartController=require('./controllers/CartController');


router.get('/',cartController.ViewShoppingCart);


module.exports = router;