const { TagBlogService } = require('../../services/blog');

const tagBlogService = new TagBlogService();

/**
 * Blog Tags Controller - Clean Architecture
 * Manages blog tag CRUD operations
 */

module.exports = {
  /**
   * Get all blog tags
   */
  getTag: async (req, res) => {
    try {
      const tags = await tagBlogService.getTags();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: tags,
      });
    } catch (error) {
      console.error('getTag error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add new tag
   */
  addTags: async (req, res) => {
    const { name } = req.body;

    try {
      await tagBlogService.createTag(name);

      res.status(200).send({
        status: 'success',
        message: 'Tag has been added to database',
      });
    } catch (error) {
      console.error('addTags error:', error);
      const statusCode = error.message === 'Tag already exists' ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Tag already exists'
          ? `Tag with title = ${name} already exists`
          : error.message,
      });
    }
  },

  /**
   * Edit tag
   */
  editTags: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      await tagBlogService.updateTag(id, name);

      res.status(200).send({
        status: 'success',
        message: `Tag with id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editTags error:', error);
      const statusCode = error.message === 'Tag not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Tag not found'
          ? `Tag with title = ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Delete tag
   */
  deleteTags: async (req, res) => {
    const { id } = req.params;

    try {
      await tagBlogService.deleteTag(id);

      res.status(200).send({
        status: 'success',
        message: `Tag with id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteTags error:', error);
      const statusCode = error.message === 'Tag not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Tag not found'
          ? `Tag with title = ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
