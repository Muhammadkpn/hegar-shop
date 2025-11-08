const { ProductCategoryService } = require('../../services/products');

const productCategoryService = new ProductCategoryService();

/**
 * Product Category Controller - Clean Architecture
 * Manages product-category relationship CRUD operations with hierarchical support
 */

module.exports = {
  /**
   * Get all product-category relationships
   */
  getProductCategory: async (req, res) => {
    try {
      const productCategories = await productCategoryService.getProductCategories();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully!',
        data: productCategories,
      });
    } catch (error) {
      console.error('getProductCategory error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Count products per category
   */
  countCategory: async (req, res) => {
    try {
      const categoryCount = await productCategoryService.getCategoryCount();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully!',
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
   * Count products per category by store
   */
  countCategoryByStore: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await productCategoryService.getCategoryCountByStore(id);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully!',
        data: result,
      });
    } catch (error) {
      console.error('countCategoryByStore error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add categories to latest product
   */
  addProductCategory: async (req, res) => {
    const { categoryId } = req.body;

    try {
      await productCategoryService.addProductCategories(categoryId);

      res.status(200).send({
        status: 'success',
        message: 'New product category has been added to database',
      });
    } catch (error) {
      console.error('addProductCategory error:', error);
      const statusCode = error.message.includes('duplicate') ? 403 : 
                         error.message.includes('doesn\'t exists') ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit single product-category relationship
   */
  editProductCategory: async (req, res) => {
    const { categoryId } = req.body;
    const { id } = req.params;

    try {
      // Note: This endpoint updates a single relationship by ID
      // The service will handle the complexity of hierarchical categories
      throw new Error('Not implemented - use editProductCategoryByStore instead');
    } catch (error) {
      console.error('editProductCategory error:', error);
      res.status(501).send({
        status: 'fail',
        code: 501,
        message: 'This endpoint is deprecated, use editProductCategoryByStore instead',
      });
    }
  },

  /**
   * Edit all categories for a product
   */
  editProductCategoryByStore: async (req, res) => {
    const { categoryId } = req.body;
    const { id } = req.params;

    try {
      await productCategoryService.updateProductCategories(id, categoryId);

      res.status(200).send({
        status: 'success',
        message: 'Edit product category has been successfully',
      });
    } catch (error) {
      console.error('editProductCategoryByStore error:', error);
      const statusCode = error.message.includes('duplicate') ? 403 : 
                         error.message.includes('doesn\'t exists') || error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Delete all categories for a product
   */
  deleteProductCategory: async (req, res) => {
    const { id } = req.params;

    try {
      await productCategoryService.deleteProductCategories(id);

      res.status(200).send({
        status: 'success',
        message: `Product category with product_id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteProductCategory error:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message.includes('not found')
          ? `Product with product_id: ${id} doesn't exists.`
          : error.message,
      });
    }
  },
};
