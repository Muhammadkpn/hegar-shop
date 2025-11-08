const { CategoryBlogService } = require('../../services/blog');

const categoryBlogService = new CategoryBlogService();

/**
 * Blog Categories Controller - Clean Architecture
 * Manages blog category CRUD operations
 */

module.exports = {
  /**
   * Get all blog categories
   */
  getCategory: async (req, res) => {
    try {
      const categories = await categoryBlogService.getCategories();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: categories,
      });
    } catch (error) {
      console.error('getCategory error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add new category
   */
  addCategory: async (req, res) => {
    const { name } = req.body;

    try {
      await categoryBlogService.createCategory(name);

      res.status(200).send({
        status: 'success',
        message: 'Category has been added to the database',
      });
    } catch (error) {
      console.error('addCategory error:', error);
      const statusCode = error.message === 'Category already exists' ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Category already exists'
          ? `Category with title = ${name} already exists`
          : error.message,
      });
    }
  },

  /**
   * Edit category
   */
  editCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      await categoryBlogService.updateCategory(id, name);

      res.status(200).send({
        status: 'success',
        message: 'Category has been edited',
      });
    } catch (error) {
      console.error('editCategory error:', error);
      const statusCode = error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Category not found'
          ? `Category with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Delete category
   */
  deleteCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await categoryBlogService.deleteCategory(id);

      res.status(200).send({
        status: 'success',
        message: `Category with id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteCategory error:', error);
      const statusCode = error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Category not found'
          ? `Category with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
