const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const crypto = require('crypto');
const Product = require("../models/Product");



class ProductController{
    async ViewProductListings(req, res, next) {
        try {
            const products = await Product.find();
            res.render('category', {
                products: mutipleMongooseToObject(products)
            });
           
        } catch (error) {
            next(error);
        }
    }

    
    async ViewProductDetails(req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            const relevantProducts = await Product.find({ category: product.category }).limit(9);
            
            // Log the relevant products to check the returned data
            console.log('Relevant Products:', relevantProducts);

            res.render('product-details', { 
                product: mongooseToObject(product),
                relevantProducts: mutipleMongooseToObject(relevantProducts),

             });

        } catch (error) {
            next(error);
        }
    }

    ViewProductCheckout(req, res, next) {
        res.render('checkout');
    }

    ViewShoppingCart(req, res, next) {
        res.render('cart');
    }

    ViewOrderConfirmation(req, res, next) {
        res.render('confirmation');
    }

    
}

module.exports = new ProductController();