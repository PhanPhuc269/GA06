const elasticClient = require('./elasticsearch');
const Product = require('../../components/product/models/Product');
const ProductService = require('../../components/product/services/ProductService');

async function createIndex() {
    try {
        console.log('Starting to create index...'); // Log kiểm tra
        // Kiểm tra xem chỉ mục đã tồn tại chưa
        const indexExists = await elasticClient.indices.exists({ index: 'products' });

        if (!indexExists) {
            // Tạo chỉ mục nếu chưa tồn tại
            await elasticClient.indices.create({
                index: 'products',
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text', analyzer: 'standard' },
                            description: { type: 'text', analyzer: 'standard' },
                            price: { type: 'float' }, // float cho số thập phân
                            quantity: { type: 'integer' }, // integer cho số nguyên
                            image: { type: 'keyword' }, // URL hình ảnh
                            category: { type: 'keyword' }, // keyword cho trường phân loại
                            availibility: { type: 'keyword' }, // Sửa chính tả
                            brand: { type: 'keyword' },
                            type: { type: 'keyword' },
                            color: { type: 'keyword' },
                            rate: { type: 'float' },
                            slug: { type: 'text' }, // Slug thường là chuỗi text
                            createdAt: { type: 'date' }, // Ngày tháng tự động
                        },
                    },
                },
            });
            console.log('Index "products" created successfully!');
        } else {
            console.log('Index "products" already exists.');
        }
    } catch (error) {
        console.error('Error creating index "products":', error);
    }
}



//nodemon --inspect src/index.js
// const db = require('./src/config/db');
// db.connect();
async function indexProduct(product) {
   // db.connect();
    await elasticClient.index({
        index: 'products',
        id: product._id.toString(),
        body: {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            category: product.category,
            availibility: product.availibility,
            brand: product.brand,
            type: product.type,
            color: product.color,
            rate: product.rate,
            slug: product.slug,
            createdAt: product.createdAt || new Date(), // Đảm bảo ngày tạo luôn được thiết lập
        },
    });
    console.log(`Product indexed: ${product.name}`);
}

async function syncAllProducts() {
    try {
        const products = await ProductService.getProducts({}); // Lấy tất cả sản phẩm từ MongoDB
        for (const product of products) {
            await indexProduct(product); // Lưu từng sản phẩm vào Elasticsearch
        }
        console.log('All products indexed successfully');
    } catch (error) {
        console.error('Error while syncing products:', error);
    }
}

module.exports = {
    createIndex,
    syncAllProducts,
    
};