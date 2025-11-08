const { CategoryProductService } = require('../../services/products');

const categoryProductService = new CategoryProductService();

/**
 * Product Categories Controller - Clean Architecture
 * Manages product category CRUD operations with hierarchical support
 */

module.exports = {
  /**
   * Get all product categories with optional name filter
   */
  getCategory: async (req, res) => {
    const { name } = req.query;

    try {
      const categories = await categoryProductService.getCategories(name);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully!',
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
   * Get hierarchical category structure (parent-child)
   */
  getCategoryChild: async (req, res) => {
    try {
      const hierarchy = await categoryProductService.getCategoryHierarchy();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successful',
        data: hierarchy,
      });
    } catch (error) {
      console.error('getCategoryChild error:', error);
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
    const { name, parentId } = req.body;

    try {
      await categoryProductService.createCategory({ name, parentId });

      res.status(201).send({
        status: 'success',
        message: 'Category has been added to database',
      });
    } catch (error) {
      console.error('addCategory error:', error);
      const statusCode = error.message === 'Category already exists' ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Category already exists'
          ? `Name with title = ${name} already exists`
          : error.message,
      });
    }
  },

  /**
   * Edit category
   */
  editCategory: async (req, res) => {
    const { id } = req.params;
    const { name, parentId } = req.body;

    try {
      await categoryProductService.updateCategory(id, { name, parentId });

      res.status(200).send({
        status: 'success',
        message: `Category with id: ${id} has been updated`,
      });
    } catch (error) {
      console.error('editCategory error:', error);
      const statusCode = error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete category and all its children
   */
  deleteCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await categoryProductService.deleteCategory(id);

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
        message: error.message,
      });
    }
  },
};
