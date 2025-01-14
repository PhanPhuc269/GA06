const { mutipleMongooseToObject } = require('@utils/mongoose');
const { mongooseToObject } = require('@utils/mongoose');
const session = require('express-session');
const Product = require("@components/product/models/Product");
const ProductService = require('../../product/services/ProductService');

class HomeController {
    async home(req, res, next) {
        try {
           

            // Gọi service để lấy dữ liệu
            const onSaleProducts = await ProductService.getProducts();
            const notOnSaleProducts = await ProductService.getProducts();
            console.log(onSaleProducts,'not',notOnSaleProducts)
            res.render('home', {
                onSaleProducts: mutipleMongooseToObject(onSaleProducts),
                notOnSaleProducts: mutipleMongooseToObject(notOnSaleProducts),
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HomeController();