const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Product = require("../models/Product");


class ProductController {

    async ViewProductListings(req, res, next) {
        try {
            const keyword = req.query.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;
    
            // Tạo bộ lọc tìm kiếm
            const filters = {
                name: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
            };
    
            // Đếm tổng số sản phẩm phù hợp
            const total = await Product.countDocuments(filters);
    
            // Tìm các sản phẩm dựa trên bộ lọc và phân trang
            const products = await Product.find(filters).skip(skip).limit(limit);
    
            // Lấy danh sách sản phẩm đang giảm giá (onsale = 1)
            const dealProducts = await Product.find({ availibility: 'On Sale' });
    
            console.log(page, Math.ceil(total / limit));
    
            // Trả về danh sách sản phẩm đã tìm kiếm và sản phẩm giảm giá
            res.render('category', {
                products: mutipleMongooseToObject(products),
                dealProducts: mutipleMongooseToObject(dealProducts),
                currentPage: page,
                totalPages: Math.ceil(total / limit)
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
    async SearchProduct(req, res, next) {
        try {
            const keyword = req.query.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;
    
            // Tạo bộ lọc tìm kiếm
            const filters = {
                name: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
            };
    
            // Đếm tổng số sản phẩm phù hợp
            const total = await Product.countDocuments(filters);
    
            // Tìm các sản phẩm dựa trên bộ lọc và phân trang
            const products = await Product.find(filters).skip(skip).limit(limit);
            // Lấy danh sách sản phẩm đang giảm giá (onsale = 1)
            const dealProducts = await Product.find({ availibility: 'On Sale' });

            // Trả về danh sách sản phẩm đã tìm kiếm
            res.render('category', {
                products: mutipleMongooseToObject(products),
                dealProducts: mutipleMongooseToObject(dealProducts),
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ message: 'Error searching products', error });
        }
    }
    // Hàm lọc sản phẩm
    async getFilteredProducts(req, res, next) {
        try {
            const { type: productType, brand: productBrand, color: productColor, minPrice, maxPrice, page = 1, limit = 12, keyword } = req.query;
            // Xây dựng bộ lọc linh hoạt
            const filters = {};
            if (keyword) {
                filters.name = { $regex: keyword, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
            }
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
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await Product.countDocuments(filters); // Tổng số sản phẩm sau khi lọc
            // Tìm các sản phẩm dựa trên bộ lọc
            const products = await Product.find(filters)
            .skip(skip)
            .limit(parseInt(limit));
            // Trả về danh sách sản phẩm đã lọc
            res.json({
                products: mutipleMongooseToObject(products),
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            console.error('Error filtering products:', error);
            res.status(500).json({ message: 'Error filtering products', error });
        }
    }

    
    
}

module.exports = new ProductController();
