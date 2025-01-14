const Product = require("../models/Product");

class ProductService {
    async getProductList(filters, sortCriteria, skip, limit) {
        try {
            return await Product.find(filters)
                .sort(sortCriteria)
                .skip(skip)
                .limit(limit);
        } catch (error) {
            throw new Error("Error fetching product list: " + error.message);
        }
    }

    async countProducts(filters) {
        try {
            return await Product.countDocuments(filters);
        } catch (error) {
            throw new Error("Error counting products: " + error.message);
        }
    }

    async getProductBySlug(slug) {
        try {
            return await Product.findOne({ slug });
        } catch (error) {
            throw new Error("Error fetching product by slug: " + error.message);
        }
    }

    async getProductById(_id) {
        try {
            return await Product.findOne({ _id });
        } catch (error) {
            throw new Error("Error fetching product by id: " + error.message);
        }
    }

    async getRelevantProducts(category, limit) {
        try {
            return await Product.find({ category }).limit(limit);
        } catch (error) {
            throw new Error("Error fetching relevant products: " + error.message);
        }
    }

    async getRelevantProductsByBrand(brand, limit, slug) {
        try {
            return await Product.find({ brand, slug: { $ne: slug } }).limit(limit);
        } catch (error) {
            throw new Error("Error fetching relevant products by brand: " + error.message);
        }
    }
    

    async getProductsByCondition(condition) {
        try {
            return await Product.find(condition);
        } catch (error) {
            console.error('Error in getProductsByCondition:', error);
            throw error;
        }
    }
    async getProducts() {
        try {
            return await Product.find();
        } catch (error) {
            console.error('Error in getProductsByCondition:', error);
            throw error;
        }
    }
   
    async getProductsByCondition(condition, field) {
        try {
            return await Product.distinct(field, condition);
        } catch (error) {
            throw new Error("Error fetching products by condition: " + error.message);
        }
    }
    
}

module.exports = new ProductService();
