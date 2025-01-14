const { MAX } = require('uuid');
const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const ReviewController = require('../../review/controllers/ReviewController');
const ProductService = require("../services/ProductService");
const ElasticsearchService = require("../services/ElasticsearchService");
const elasticClient=require("../../../config/elasticsearch/elasticsearch");
const CategoryService = require('../../product/services/CategoryService');
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

            // Lọc theo từ khóa
            if (keyword) {
                filters.name = { $regex: keyword, $options: 'i' };
            }

            // Lọc theo loại sản phẩm
            if (productType) {
                const typeArray = productType.includes(',') ? productType.split(',') : [productType];
                filters.type = { $in: typeArray };
            }

            // Lọc theo thương hiệu
            if (productBrand) {
                const brandArray = productBrand.includes(',') ? productBrand.split(',') : [productBrand];
                filters.brand = { $in: brandArray };
            }

            // Lọc theo màu sắc (bên trong stock.color)
            if (productColor) {
                const colorArray = productColor.includes(',') ? productColor.split(',') : [productColor];
                filters['stock.color'] = { $in: colorArray }; // Sử dụng `stock.color` để lọc
            }

            // Lọc theo giá
            if (minPrice || maxPrice) {
                filters.salePrice = {};
                if (minPrice) filters.salePrice.$gte = parseFloat(minPrice);
                if (maxPrice) filters.salePrice.$lte = parseFloat(maxPrice);
            }

            // Xác định tiêu chí sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc':
                    sortCriteria = { salePrice: 1 };
                    break;
                case 'price_desc':
                    sortCriteria = { salePrice: -1 };
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

            // Lấy tổng số sản phẩm và danh sách sản phẩm theo bộ lọc
            const total = await ProductService.countProducts(filters);
            const products = await ProductService.getProductList(filters, sortCriteria, skip, parseInt(limit));
            console.log('sp',products)

            // Trả về JSON kết quả
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
            const selectedColors = req.query.colors ? req.query.colors.split(',') : [];
    
            const filters = {};
    
            // Lọc theo từ khóa
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };
    
            // Lọc theo màu sắc
            if (selectedColors.length > 0) {
                filters['stock.color'] = { $in: selectedColors };
            }
    
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc': sortCriteria = { salePrice: 1 }; break;
                case 'price_desc': sortCriteria = { salePrice: -1 }; break;
                case 'creation_time_desc': sortCriteria = { updatedAt: -1 }; break;
                case 'rate_desc': sortCriteria = { rate: -1 }; break;
                default: sortCriteria = {};
            }
    
            // Tìm tổng sản phẩm và danh sách sản phẩm
            const total = await Product.countDocuments(filters);
            const products = await Product.find(filters)
                .sort(sortCriteria)
                .skip(skip)
                .limit(limit);
    
            // Lấy danh sách màu sắc và nhãn hiệu duy nhất
            const colors = await Product.distinct('stock.color');
            const brands = await Product.distinct('brand');
            const dealProducts = await ProductService.getProducts();
            res.render('category', {
                products: mutipleMongooseToObject(products),
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                keyword,
                sort,
                brands,
                colors,
                selectedColors,
                dealProducts: mutipleMongooseToObject(dealProducts),
            });
        } catch (error) {
            next(error);
        }
    }
    

    async ViewProductDetails(req, res, next) {
        try {
            const product = await ProductService.getProductBySlug(req.params.slug);
            if (!product) return res.status(404).send('Product not found');

            const relevantProducts = await ProductService.getRelevantProductsByBrand(product.brand, 9,req.params.slug);

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

   
    

    async SearchProduct(req, res, next) {
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
    
            // Lọc theo từ khóa
            if (keyword) filters.name = { $regex: keyword, $options: 'i' };
    
            // Lọc theo loại sản phẩm
            if (productType) filters.type = { $in: productType.split(',') };
    
            // Lọc theo thương hiệu
            if (productBrand) filters.brand = { $in: productBrand.split(',') };
    
            // Lọc theo màu trong stock.color
            if (productColor) {
                const colorArray = productColor.split(',');
                filters['stock.color'] = { $in: colorArray }; // Lọc các màu bên trong mảng stock.color
            }
    
            // Lọc theo giá
            if (minPrice || maxPrice) {
                filters.salePrice = {
                    ...(minPrice && { $gte: parseFloat(minPrice) }),
                    ...(maxPrice && { $lte: parseFloat(maxPrice) }),
                };
            }
    
            // Sắp xếp
            let sortCriteria = {};
            switch (sort) {
                case 'price_asc':
                    sortCriteria = { salePrice: 1 };
                    break;
                case 'price_desc':
                    sortCriteria = { salePrice: -1 };
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
    
            // Lấy tổng sản phẩm và sản phẩm theo bộ lọc
            const total = await ElasticsearchService.countProducts(filters);
            const products = await ElasticsearchService.searchProducts(filters, sortCriteria, skip, parseInt(limit));
            const dealProducts = await ProductService.getProducts();
            const colors = await Product.distinct('stock.color');
            const brands = await Product.distinct('brand');
            if (req.xhr) {
                return res.json({
                    products: mutipleMongooseToObject(products),
                    total,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                });
            }
    
            // Render view
            res.render('category', {
                products: mutipleMongooseToObject(products),
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                dealProducts: mutipleMongooseToObject(dealProducts),
                brands,
                colors,
            });
        } catch (error) {
            console.error('Error filtering products:', error);
            next(error);
        }


        //Lấy danh mục
        const categories = await CategoryService.getCategories();
        res.render('category', {
            products: mutipleMongooseToObject(products),
            categories: mutipleMongooseToObject(categories),
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);

    }
    


}

module.exports = new ProductController();
