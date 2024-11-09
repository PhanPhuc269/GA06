const express = require ('express');
const router =express.Router();
const productController= require('../app/controllers/ProductController');

 
router.get('/list',productController.ViewProductListings);
router.get('/product-details/:id',productController.ViewProductDetails);
router.get('/checkout',productController.ViewProductCheckout);
router.get('/cart',productController.ViewShoppingCart);
router.get('/confirmation',productController.ViewOrderConfirmation);


module.exports = router;