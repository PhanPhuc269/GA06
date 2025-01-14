const Product = require("../models/Product");
const Category = require("../models/Category");

class CategoryService {
    async getCategories() {
        try {
            return await Category.find();
        } catch (error) {
            throw new Error("Error fetching category list: " + error.message);
        }
    }

    // Tạo dữ liệu danh mục
    async createCategory() {
        try {
            const data= [
                {
                    "name": "Sports Shoes",
                    "description": "Various types of sports shoes",
                    "productCount": 53,
                    "slug": "sports-shoes",
                    "subCategories": [
                        {
                            "name": "Running Shoes",
                            "description": "Shoes designed for running",
                            "productCount": 13,
                            "slug": "running-shoes"
                        },
                        {
                            "name": "Basketball Shoes",
                            "description": "Shoes designed for basketball",
                            "productCount": 9,
                            "slug": "basketball-shoes"
                        },
                        {
                            "name": "Tennis Shoes",
                            "description": "Shoes designed for tennis",
                            "productCount": 17,
                            "slug": "tennis-shoes"
                        },
                        {
                            "name": "Walking Shoes",
                            "description": "Shoes designed for walking",
                            "productCount": 11,
                            "slug": "walking-shoes"
                        }
                    ]
                },
                {
                    "name": "Leather Shoes",
                    "description": "Premium leather shoes",
                    "productCount": 53,
                    "slug": "leather-shoes",
                    "subCategories": [
                        {
                            "name": "Men’s Dress Shoes",
                            "description": "Formal leather shoes for men",
                            "productCount": 13,
                            "slug": "mens-dress-shoes"
                        },
                        {
                            "name": "Loafers",
                            "description": "Casual leather loafers",
                            "productCount": 9,
                            "slug": "loafers"
                        },
                        {
                            "name": "High-Top Shoes",
                            "description": "High-top leather shoes",
                            "productCount": 17,
                            "slug": "high-top-shoes"
                        },
                        {
                            "name": "Boots",
                            "description": "Durable leather boots",
                            "productCount": 1,
                            "slug": "boots"
                        },
                        {
                            "name": "Women’s Leather Shoes",
                            "description": "Elegant leather shoes for women",
                            "productCount": 11,
                            "slug": "womens-leather-shoes"
                        }
                    ]
                },
                {
                    "name": "Sneakers",
                    "description": "Stylish and comfortable sneakers",
                    "productCount": 53,
                    "slug": "sneakers",
                    "subCategories": [
                        {
                            "name": "Sports Sneakers",
                            "description": "Sneakers for sports activities",
                            "productCount": 13,
                            "slug": "sports-sneakers"
                        },
                        {
                            "name": "Fashion Sneakers",
                            "description": "Trendy sneakers for fashion",
                            "productCount": 9,
                            "slug": "fashion-sneakers"
                        },
                        {
                            "name": "Classic Sneakers",
                            "description": "Timeless sneaker designs",
                            "productCount": 17,
                            "slug": "classic-sneakers"
                        },
                        {
                            "name": "Special Edition Sneakers",
                            "description": "Limited edition sneakers",
                            "productCount": 1,
                            "slug": "special-edition-sneakers"
                        }
                    ]
                },
                {
                    "name": "Women’s Shoes",
                    "description": "Shoes for women",
                    "productCount": 24,
                    "slug": "womens-shoes",
                    "subCategories": [
                        {
                            "name": "High Heels",
                            "description": "Elegant high heels for women",
                            "productCount": 13,
                            "slug": "high-heels"
                        },
                        {
                            "name": "Flats",
                            "description": "Comfortable flat shoes",
                            "productCount": 9,
                            "slug": "flats"
                        },
                        {
                            "name": "Sandals",
                            "description": "Casual sandals for women",
                            "productCount": 17,
                            "slug": "sandals"
                        },
                        {
                            "name": "Women’s Boots",
                            "description": "Stylish boots for women",
                            "productCount": 1,
                            "slug": "womens-boots"
                        }
                    ]
                },
                {
                    "name": "Kids’ Shoes",
                    "description": "Shoes for kids",
                    "productCount": 53,
                    "slug": "kids-shoes",
                    "subCategories": [
                        {
                            "name": "Boys’ Shoes",
                            "description": "Shoes for boys",
                            "productCount": 13,
                            "slug": "boys-shoes"
                        },
                        {
                            "name": "Girls’ Shoes",
                            "description": "Shoes for girls",
                            "productCount": 9,
                            "slug": "girls-shoes"
                        },
                        {
                            "name": "Kids’ Sports Shoes",
                            "description": "Sports shoes for kids",
                            "productCount": 17,
                            "slug": "kids-sports-shoes"
                        },
                        {
                            "name": "Kids’ Sandals",
                            "description": "Comfortable sandals for kids",
                            "productCount": 1,
                            "slug": "kids-sandals"
                        }
                    ]
                }
            ]
            for (const categoryData of data) {
                const category = new Category(categoryData);
                await category.save();
            }
        } catch (error) {
            throw new Error("Error creating category: " + error.message);
        }
    }

    
   
}

module.exports = new CategoryService();
