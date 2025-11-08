const { ProductTagService } = require('../../services/products');

const productTagService = new ProductTagService();

/**
 * Product Tag Controller - Clean Architecture
 * Manages product-tag relationship CRUD operations
 */

module.exports = {
  /**
   * Get all product-tag relationships
   */
  getProductTag: async (req, res) => {
    try {
      const productTags = await productTagService.getProductTags();

      res.status(200).send({
        status: 'success',
        data: productTags,
      });
    } catch (error) {
      console.error('getProductTag error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Count products per tag
   */
  countTag: async (req, res) => {
    try {
      const tagCount = await productTagService.getTagCount();

      res.status(200).send({
        status: 'success',
        data: tagCount,
      });
    } catch (error) {
      console.error('countTag error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Count products per tag by store
   */
  countTagByStore: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await productTagService.getTagCountByStore(id);

      res.status(200).send({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error('countTagByStore error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add tags to latest product
   */
  addProductTag: async (req, res) => {
    const { tagId } = req.body;

    try {
      await productTagService.addProductTags(tagId);

      res.status(200).send({
        status: 'success',
        message: 'Product tag has been added to the article',
      });
    } catch (error) {
      console.error('addProductTag error:', error);
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
   * Edit single product-tag relationship
   */
  editProductTag: async (req, res) => {
    const { tagId } = req.body;
    const { id } = req.params;

    try {
      await productTagService.updateProductTag(id, tagId);

      res.status(200).send({
        status: 'success',
        message: `Product Tag with tag_id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editProductTag error:', error);
      const statusCode = error.message === 'Product tag not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Product tag not found'
          ? `Product tag with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Edit all tags for a product
   */
  editProductTagByStore: async (req, res) => {
    const { tagId } = req.body;
    const { id } = req.params;

    try {
      await productTagService.updateProductTags(id, tagId);

      res.status(200).send({
        status: 'success',
        message: 'Your input has been successfully',
      });
    } catch (error) {
      console.error('editProductTagByStore error:', error);
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
   * Delete product-tag relationship
   */
  deleteProductTag: async (req, res) => {
    const { id } = req.params;

    try {
      await productTagService.deleteProductTag(id);

      res.status(200).send({
        status: 'success',
        message: `Product Tag with tag_id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteProductTag error:', error);
      const statusCode = error.message === 'Product tag not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Product tag not found'
          ? `Product tag with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
