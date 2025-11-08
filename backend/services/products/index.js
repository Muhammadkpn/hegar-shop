/**
 * Products Module Services
 * Centralized export for all product-related services
 */

const ProductService = require('./ProductService');
const CategoryProductService = require('./CategoryProductService');
const TagProductService = require('./TagProductService');
const ProductCategoryService = require('./ProductCategoryService');
const ProductTagService = require('./ProductTagService');
const ProductReviewService = require('./ProductReviewService');

module.exports = {
  ProductService,
  CategoryProductService,
  TagProductService,
  ProductCategoryService,
  ProductTagService,
  ProductReviewService,
};
