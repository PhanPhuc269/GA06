const { mutipleMongooseToObject } = require('@utils/mongoose');
const { mongooseToObject } = require('@utils/mongoose');
const session = require('express-session');


const Product = require("@components/product/models/Product");



class HomeController{
    async home(req, res, next) {
        try {
            const onSaleProducts = await Product.find({ availibility: 'On Sale' });
            const notOnSaleProducts = await Product.find({ availibility: { $ne: 'On Sale' } });
    
            res.render('home', {
                onSaleProducts: mutipleMongooseToObject(onSaleProducts),
                notOnSaleProducts: mutipleMongooseToObject(notOnSaleProducts)
            });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = new HomeController();