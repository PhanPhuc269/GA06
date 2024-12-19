const { mutipleMongooseToObject } = require('@utils/mongoose');
const { mongooseToObject } = require('@utils/mongoose');
const session = require('express-session');
const Product = require("@components/product/models/Product");
const ProductService = require('@components/product/services/ProductService');

class HomeController {
    async home(req, res, next) {
        try {
            const onSaleCondition = { availibility: 'On Sale' };
            const notOnSaleCondition = { availibility: { $ne: 'On Sale' } };

            // Gọi service để lấy dữ liệu
            const onSaleProducts = await ProductService.getProductsByCondition(onSaleCondition);
            const notOnSaleProducts = await ProductService.getProductsByCondition(notOnSaleCondition);

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