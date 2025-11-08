const {
  BlogCategoryRepository,
  BlogRepository,
  CategoryBlogRepository,
} = require('../../repositories/blog');

/**
 * Blog Category Service
 * Contains business logic for blog-category relationship operations
 */
class BlogCategoryService {
  constructor() {
    this.blogCategoryRepository = new BlogCategoryRepository();
    this.blogRepository = new BlogRepository();
    this.categoryBlogRepository = new CategoryBlogRepository();
  }

  /**
   * Get all blog-category relationships with details
   * @returns {Promise<Array>}
   */
  async getBlogCategories() {
    const query = `
      SELECT bc.blog_id, b.title AS title_blog, bc.category_id, cb.name AS category
      FROM blog_category bc
      JOIN blog b ON bc.blog_id = b.id
      JOIN category_blog cb ON bc.category_id = cb.id
    `;
    return this.blogCategoryRepository.rawQuery(query);
  }

  /**
   * Get category counts
   * @returns {Promise<Array>}
   */
  async getCategoryCount() {
    const query = `
      SELECT bc.category_id, cb.name AS category, COUNT(bc.category_id) AS count
      FROM blog_category bc
      JOIN category_blog cb ON bc.category_id = cb.id
      GROUP BY bc.category_id, cb.name
      ORDER BY count DESC
    `;
    return this.blogCategoryRepository.rawQuery(query);
  }

  /**
   * Add categories to the latest blog
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async addBlogCategories(categoryIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
      throw new Error('Your input has duplicate');
    }

    // Get latest blog ID
    const latestBlogs = await this.blogRepository.findAll({
      orderBy: 'id',
      order: 'DESC',
      limit: 1,
    });

    if (latestBlogs.length === 0) {
      throw new Error('No blogs found');
    }

    const blogId = latestBlogs[0].id;

    // Add categories to blog
    await this.blogCategoryRepository.addCategoriesToBlog(blogId, categoryIds);
  }

  /**
   * Update blog categories
   * @param {number} blogId
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async updateBlogCategories(blogId, categoryIds) {
    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog category not found');
    }

    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
      throw new Error('Your input has duplicate value');
    }

    // Verify all category IDs exist
    const categories = await this.categoryBlogRepository.findAll();
    const validCategoryIds = categories.map((c) => c.id);
    const allValid = categoryIds.every((id) => validCategoryIds.includes(id));

    if (!allValid) {
      throw new Error('One of the category id doesn\'t exists in our database');
    }

    // Delete existing categories
    await this.blogCategoryRepository.deleteByBlog(blogId);

    // Add new categories
    await this.blogCategoryRepository.addCategoriesToBlog(blogId, categoryIds);
  }

  /**
   * Delete blog-category relationship
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteBlogCategory(id) {
    const blogCategory = await this.blogCategoryRepository.findById(id);

    if (!blogCategory) {
      throw new Error('Blog category not found');
    }

    await this.blogCategoryRepository.delete(id);
  }
}

module.exports = BlogCategoryService;
