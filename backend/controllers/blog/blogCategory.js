const { BlogCategoryService } = require('../../services/blog');

const blogCategoryService = new BlogCategoryService();

/**
 * Blog Category Controller - Clean Architecture
 * Manages blog-category relationship CRUD operations
 */

module.exports = {
  /**
   * Get all blog-category relationships
   */
  getBlogCategory: async (req, res) => {
    try {
      const blogCategories = await blogCategoryService.getBlogCategories();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: blogCategories,
      });
    } catch (error) {
      console.error('getBlogCategory error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Count blogs per category
   */
  countCategory: async (req, res) => {
    try {
      const categoryCount = await blogCategoryService.getCategoryCount();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: categoryCount,
      });
    } catch (error) {
      console.error('countCategory error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add categories to latest blog
   */
  addBlogCategory: async (req, res) => {
    const { categoryId } = req.body;

    try {
      await blogCategoryService.addBlogCategories(categoryId);

      res.status(200).send({
        status: 'success',
        message: 'Blog category has been added to the database',
      });
    } catch (error) {
      console.error('addBlogCategory error:', error);
      const statusCode = error.message === 'Your input has duplicate' ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Update blog categories
   */
  editBlogCategory: async (req, res) => {
    const { categoryId } = req.body;
    const { id } = req.params;

    try {
      await blogCategoryService.updateBlogCategories(id, categoryId);

      res.status(200).send({
        status: 'success',
        message: `Blog category with ${id} has been edited`,
      });
    } catch (error) {
      console.error('editBlogCategory error:', error);
      let statusCode = 500;
      if (error.message === 'Blog category not found') {
        statusCode = 404;
      } else if (error.message === 'Your input has duplicate value') {
        statusCode = 403;
      } else if (error.message.includes('doesn\'t exists in our database')) {
        statusCode = 404;
      }

      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog category not found'
          ? `Blog category with id ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Delete blog-category relationship
   */
  deletBlogCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await blogCategoryService.deleteBlogCategory(id);

      res.status(200).send({
        status: 'success',
        message: `Blog Category with id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deletBlogCategory error:', error);
      const statusCode = error.message === 'Blog category not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog category not found'
          ? `Blog category with id ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
