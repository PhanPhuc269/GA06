const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Product = require("../models/Product");

class ProductController {
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
            res.render('product-details', { product: mongooseToObject(product) });
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

    // Hàm lọc sản phẩm
    async getFilteredProducts(req, res, next) {
        try {
            const { type: productType, brand: productBrand, color: productColor, minPrice, maxPrice } = req.query;
    
            // Xây dựng bộ lọc linh hoạt
            const filters = {};
    
            // Xử lý lọc theo type (chuỗi hoặc mảng giá trị)
            if (productType) {
                const typeArray = productType.includes(',') ? productType.split(',') : [productType];
                filters.type = { $in: typeArray };
            }
    
            // Xử lý lọc theo brand (chuỗi hoặc mảng giá trị)
            if (productBrand) {
                const brandArray = productBrand.includes(',') ? productBrand.split(',') : [productBrand];
                filters.brand = { $in: brandArray };
            }
    
            // Xử lý lọc theo color (chuỗi hoặc mảng giá trị)
            if (productColor) {
                const colorArray = productColor.includes(',') ? productColor.split(',') : [productColor];
                filters.color = { $in: colorArray };
            }
    
            // Xử lý lọc theo khoảng giá
            if (minPrice || maxPrice) {
                filters.price = {};
                if (minPrice) filters.price.$gte = parseFloat(minPrice);
                if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
            }    
            // Tìm các sản phẩm dựa trên bộ lọc
            const products = await Product.find(filters);
    
            // Trả về danh sách sản phẩm đã lọc
            res.json({ products: mutipleMongooseToObject(products) });
        } catch (error) {
            console.error('Error filtering products:', error);
            res.status(500).json({ message: 'Error filtering products', error });
        }
    }
    
    
}

module.exports = new ProductController();
