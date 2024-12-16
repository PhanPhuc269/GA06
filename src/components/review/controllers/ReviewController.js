// controllers/ReviewController.js

const Review = require('../models/Review');

class ReviewController {
  // Method to get reviews for a specific product
  static async getReviewsByProductId(productId, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const totalReviews = await Review.countDocuments({ productId });

    const reviews = await Review.find({ productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalReviews / limit);

    return {
      reviews,
      totalReviews,
      totalPages,
      currentPage: page,
    };
  }

  // Method to submit a new review
  static async submitReview(req, res, next) { // Made static
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user._id;

      const review = new Review({
        productId,
        userId,
        rating,
        comment,
      });

      await review.save();
      res.redirect(`/product/product-details/${req.body.slug}`);
    } catch (error) {
      next(error);
    }
  }

  // Method to calculate overall rating for a product
  static async getOverallRating(productId) {
    const result = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    return result.length > 0 ? result[0].averageRating.toFixed(1) : 0;
  }

  // Method to calculate rating breakdown for a product
  static async getRatingBreakdown(productId) {
    const result = await Review.aggregate([
      { $match: { productId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);
    const breakdown = { "5": { count: 0 }, "4": { count: 0 }, "3": { count: 0 }, "2": { count: 0 }, "1": { count: 0 } };
    result.forEach(item => {
      breakdown[item._id] = { count: item.count };
    });
    return breakdown;
  }

  // Method to fetch reviews for AJAX
  static async fetchReviews(req, res, next) {
    try {
      const { productId, page = 1, limit = 5 } = req.query;
      const skip = (page - 1) * limit;

      const totalReviews = await Review.countDocuments({ productId });
      const reviews = await Review.find({ productId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalPages = Math.ceil(totalReviews / limit);

      res.json({
        reviews,
        totalReviews,
        totalPages,
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Error fetching reviews', error });
    }
  }
}

module.exports = ReviewController;