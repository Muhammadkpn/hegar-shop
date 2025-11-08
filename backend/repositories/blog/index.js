/**
 * Blog Module Repositories
 * Centralized export for all blog-related repositories
 */

const BlogRepository = require('./BlogRepository');
const CategoryBlogRepository = require('./CategoryBlogRepository');
const TagBlogRepository = require('./TagBlogRepository');
const BlogCategoryRepository = require('./BlogCategoryRepository');
const BlogTagRepository = require('./BlogTagRepository');
const BlogCommentRepository = require('./BlogCommentRepository');

module.exports = {
  BlogRepository,
  CategoryBlogRepository,
  TagBlogRepository,
  BlogCategoryRepository,
  BlogTagRepository,
  BlogCommentRepository,
};
