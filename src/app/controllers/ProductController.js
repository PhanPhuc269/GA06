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


    // Hàm lọc sản phẩm
    async getFilteredProducts(req, res, next) {
        try {
            const { type: productType, brand: productBrand, color: productColor } = req.query; // Lấy thêm color từ query string
    
            // Xây dựng bộ lọc linh hoạt
            const filters = {};
            if (productType) {
                filters.type = productType;
            }
            if (productBrand) {
                filters.brand = productBrand;
            }
            if (productColor) {
                filters.color = productColor;
            }
    
            // Tìm các sản phẩm dựa trên bộ lọc
            const products = await Product.find(filters);
    
            // Trả về danh sách sản phẩm đã lọc
            res.json({ products: mutipleMongooseToObject(products) });
        } catch (error) {
            res.status(500).json({ message: 'Error filtering products', error });
        }
    }

    
}

module.exports = new ProductController();
