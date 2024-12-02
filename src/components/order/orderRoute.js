const express = require ('express');
const router =express.Router();
const orderController=require('./controllers/OrderController');
const {ensureAuthenticated} = require('../../middlewares/AuthMiddleware');

//router.get('/',orderController.ViewProductCheckout);
router.get('/checkout', ensureAuthenticated,orderController.ViewProductCheckout);
router.post('/checkout', ensureAuthenticated,orderController.addOrder);

module.exports = router;