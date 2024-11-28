const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const Product = require("../models/Product");

class ProductController {
    // Hiển thị danh sách sản phẩm
    async ViewProductListings(req, res, next) {
        try {
            const keyword = req.query.keyword ? req.query.keyword.trim() : '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;
            const sort = req.query.sort || 'default';

            // Kiểm tra giá trị hợp lệ
            if (page < 1 || limit < 1) {
                return res.status(400).json({ error: 'Invalid page or limit value' });
            }

            // Bộ lọc tìm kiếm
            const filters = {};
            if (keyword) {
                filters.name = { $regex: keyword, $options: 'i' };
            }

            // Xác định tiêu chí sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc':
                    sortCriteria = { price: 1 };
                    break;
                case 'price_desc':
                    sortCriteria = { price: -1 };
                    break;
                case 'creation_time_desc':
                    sortCriteria = { createdAt: -1 };
                    break;
                case 'rate_desc':
                    sortCriteria = { rate: -1 };
                    break;
                default:
                    sortCriteria = {};
            }

            // Tổng số sản phẩm và sản phẩm theo phân trang
            const total = await Product.countDocuments(filters);
            const products = await Product.find(filters)
                .sort(sortCriteria)
                .skip(skip)
                .limit(limit);

            // Sản phẩm đang giảm giá
            const dealProducts = await Product.find({ availibility: 'On Sale' });

            res.render('category', {
                products: mutipleMongooseToObject(products),
                dealProducts: mutipleMongooseToObject(dealProducts),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                keyword,
                sort,
            });
        } catch (error) {
            console.error('Error in ViewProductListings:', error);
            next(error);
        }
    }

    // Chi tiết sản phẩm
    async ViewProductDetails(req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            const relevantProducts = await Product.find({ category: product.category }).limit(9);

            res.render('product-details', {
                product: mongooseToObject(product),
                relevantProducts: mutipleMongooseToObject(relevantProducts),
            });
        } catch (error) {
            console.error('Error in ViewProductDetails:', error);
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

    // Tìm kiếm sản phẩm
    async SearchProduct(req, res, next) {
        try {
            const keyword = req.query.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;

            const filters = {
                name: { $regex: keyword, $options: 'i' },
            };

            const total = await Product.countDocuments(filters);
            const products = await Product.find(filters).skip(skip).limit(limit);
            const dealProducts = await Product.find({ availibility: 'On Sale' });

            res.render('category', {
                products: mutipleMongooseToObject(products),
                dealProducts: mutipleMongooseToObject(dealProducts),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            console.error('Error searching products:', error);
            next(error);
        }
    }

    // Lọc sản phẩm
    async getFilteredProducts(req, res, next) {
        try {
            const {
                type: productType,
                brand: productBrand,
                color: productColor,
                minPrice,
                maxPrice,
                page = 1,
                limit = 12,
                keyword,
                sort,
            } = req.query;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const filters = {};

            if (keyword) {
                filters.name = { $regex: keyword, $options: 'i' };
            }

            if (productType) {
                const typeArray = productType.includes(',') ? productType.split(',') : [productType];
                filters.type = { $in: typeArray };
            }

            if (productBrand) {
                const brandArray = productBrand.includes(',') ? productBrand.split(',') : [productBrand];
                filters.brand = { $in: brandArray };
            }

            if (productColor) {
                const colorArray = productColor.includes(',') ? productColor.split(',') : [productColor];
                filters.color = { $in: colorArray };
            }

            if (minPrice || maxPrice) {
                filters.price = {};
                if (minPrice) filters.price.$gte = parseFloat(minPrice);
                if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
            }

            let sortCriteria = {};
            switch (sort) {
                case 'price_asc':
                    sortCriteria = { price: 1 };
                    break;
                case 'price_desc':
                    sortCriteria = { price: -1 };
                    break;
                case 'creation_time_desc':
                    sortCriteria = { createdAt: -1 };
                    break;
                case 'rate_desc':
                    sortCriteria = { rate: -1 };
                    break;
                default:
                    sortCriteria = {};
            }

            const total = await Product.countDocuments(filters);
            const products = await Product.find(filters)
                .sort(sortCriteria)
                .skip(skip)
                .limit(parseInt(limit));

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
