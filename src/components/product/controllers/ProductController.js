const { MAX } = require('uuid');
const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const ReviewController = require('../../review/controllers/ReviewController');
const Product = require("../models/Product");
const ProductService = require("../services/ProductService");
const ElasticsearchService = require("../services/ElasticsearchService");
const elasticClient=require("../../../config/elasticsearch/elasticsearch");
class ProductController {

    ViewOrderConfirmation(req, res, next) {
        res.render('confirmation');
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

            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters,sortCriteria,skip,parseInt(limit));
               

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

    async ViewProductListings(req, res, next) {
        try {
            const keyword = req.query.keyword?.trim() || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;
            const sort = req.query.sort || 'default';

            const filters = {};
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };

            let sortCriteria = {};
            switch (sort) {
                case 'price_asc': sortCriteria = { price: 1 }; break;
                case 'price_desc': sortCriteria = { price: -1 }; break;
                case 'creation_time_desc': sortCriteria = { createdAt: -1 }; break;
                case 'rate_desc': sortCriteria = { rate: -1 }; break;
                default: sortCriteria = {};
            }

            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, limit);

            res.render('category', {
                products: mutipleMongooseToObject(products),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                keyword,
                sort,
            });
        } catch (error) {
            next(error);
        }
    }

    async ViewProductDetails(req, res, next) {
        try {
            const product = await ProductService.getProductBySlug(req.params.slug);
            if (!product) return res.status(404).send('Product not found');

            const relevantProducts = await ProductService.getRelevantProducts(product.category, 9);

            const page = parseInt(req.query.reviewPage) || 1;
            const limit = 5;

            const { reviews, totalReviews, totalPages, currentPage } = await ReviewController.getReviewsByProductId(
                product._id,
                page,
                limit
            );

            const overallRating = await ReviewController.getOverallRating(product._id);
            product.rate = overallRating;
            await product.save();

            const ratingBreakdown = await ReviewController.getRatingBreakdown(product._id);

            res.render('product-details', {
                product: mongooseToObject(product),
                relevantProducts: mutipleMongooseToObject(relevantProducts),
                reviews: mutipleMongooseToObject(reviews),
                overallRating,
                totalReviews,
                ratingBreakdown,
                user: req.user,
                reviewPagination: { totalPages, currentPage },
            });
        } catch (error) {
            next(error);
        }
    }

   
    
    async  SearchProduct(req, res, next) {
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
    
            // Khởi tạo bộ lọc cho các trường tìm kiếm
            const filters = {};
            if (productType) filters.type = productType;
            if (productBrand) filters.brand = productBrand;
            if (productColor) filters.color = productColor;
            if (minPrice || maxPrice) filters.price = { minPrice, maxPrice };
    
            // Định nghĩa các điều kiện sắp xếp (sort)
            let sortCriteria = [];
            switch (sort) {
                case 'price_asc': sortCriteria = [{ price: { order: 'asc' } }]; break;
                case 'price_desc': sortCriteria = [{ price: { order: 'desc' } }]; break;
                case 'creation_time_desc': sortCriteria = [{ createdAt: { order: 'desc' } }]; break;
                case 'rate_desc': sortCriteria = [{ rate: { order: 'desc' } }]; break;
                default: sortCriteria = [];
            }
//<<<<<<< features/complexityPassword

            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, parseInt(limit));

            if (req.xhr) {
                return res.json({
                    products: mutipleMongooseToObject(products),
                    total,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                });
            }

//=======
    
            // Thực hiện tìm kiếm qua Elasticsearch
          //  const products = await ElasticsearchService.searchProducts(keyword, filters, page, limit);
    
            // // Lấy tổng số sản phẩm (cho phép phân trang)
            // const totalResponse = await elasticClient.count({
            //     index: 'products',
            //     body: { query: { bool: { must: [{ multi_match: { query: keyword, fields: ['name', 'description'] } }] } } },
            // });
//     console.log("sanp: ",products);
//             const total = products.length;
//             console.log("tol: ",total);
//             const totalPages = Math.ceil(total / limit);
    
//             // Render kết quả trên giao diện
// >>>>>>> main
            res.render('category', {
                products: products,
                total,
                currentPage: parseInt(page),
                totalPages,
            });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = new ProductController();
