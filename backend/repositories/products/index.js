/**
 * Products Module Repositories
 * Centralized export for all product-related repositories
 */

const ProductRepository = require('./ProductRepository');
const ProductImageRepository = require('./ProductImageRepository');
const CategoryProductRepository = require('./CategoryProductRepository');
const TagProductRepository = require('./TagProductRepository');
const ProductCategoryRepository = require('./ProductCategoryRepository');
const ProductTagRepository = require('./ProductTagRepository');
const ProductReviewRepository = require('./ProductReviewRepository');

module.exports = {
  ProductRepository,
  ProductImageRepository,
  CategoryProductRepository,
  TagProductRepository,
  ProductCategoryRepository,
  ProductTagRepository,
  ProductReviewRepository,
};
