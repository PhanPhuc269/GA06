const express = require ('express');
const router =express.Router();
const productController= require('../app/controllers/ProductController');
const {ensureAuthenticated} = require('../app/middlewares/AuthMiddleware');

 
router.get('/list',productController.ViewProductListings);
router.get('/product-details/:id',productController.ViewProductDetails);
router.get('/checkout', ensureAuthenticated,productController.ViewProductCheckout);
router.get('/cart', ensureAuthenticated,productController.ViewShoppingCart);
router.get('/confirmation', ensureAuthenticated,productController.ViewOrderConfirmation);
router.get('/filter', productController.getFilteredProducts);
router.get('/search', productController.SearchProduct);

module.exports = router;