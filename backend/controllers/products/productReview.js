const { getImageUrls } = require('../../helpers/queryHelper');
const { ProductReviewService } = require('../../services/products');

const productReviewService = new ProductReviewService();

/**
 * Product Review Controller - Clean Architecture
 * Manages product review operations
 */

module.exports = {
  /**
   * Get product reviews by type
   */
  getProductReview: async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
      const result = await productReviewService.getProductReviews(id, type);

      // Convert image paths to full URLs
      const processImages = (reviews) => {
        reviews.forEach((review, index) => {
          if (review.image) {
            const imagePaths = review.image.split(',');
            reviews[index].image = getImageUrls(imagePaths, req);
          }
        });
        return reviews;
      };

      // Handle single vs array result
      let data;
      if (type === 'review-id') {
        // Single result
        if (result.image) {
          const imagePaths = result.image.split(',');
          result.image = getImageUrls(imagePaths, req);
        }
        data = result;
      } else {
        // Array result
        data = Array.isArray(result) ? processImages(result) : result;
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully!',
        data,
      });
    } catch (error) {
      console.error('getProductReview error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Upload review images
   */
  reviewUpload: async (req, res) => {
    const { id } = req.params;

    try {
      await productReviewService.uploadReviewImages(id, req.files);

      res.status(200).send({
        status: 'success',
        message: 'Your image has been uploaded to database',
      });
    } catch (error) {
      console.error('reviewUpload error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add or update review
   */
  addReview: async (req, res) => {
    const { comment, rating } = req.body;
    const { id } = req.params;

    try {
      await productReviewService.addReview(id, { comment, rating });

      res.status(200).send({
        status: 'success',
        message: 'Review has been added to product',
      });
    } catch (error) {
      console.error('addReview error:', error);
      const statusCode = error.message === 'Review not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit review
   */
  editReview: async (req, res) => {
    const { comment, rating } = req.body;
    const { id } = req.params;

    try {
      await productReviewService.addReview(id, { comment, rating });

      res.status(200).send({
        status: 'success',
        message: `Review with id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editReview error:', error);
      const statusCode = error.message === 'Review not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete review
   */
  deleteReview: async (req, res) => {
    const { id } = req.params;

    try {
      await productReviewService.deleteReview(id);

      res.status(200).send({
        status: 'success',
        message: `Review with id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteReview error:', error);
      const statusCode = error.message === 'Review not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },
};
