const { BlogTagService } = require('../../services/blog');

const blogTagService = new BlogTagService();

/**
 * Blog Tag Controller - Clean Architecture
 * Manages blog-tag relationship CRUD operations
 */

module.exports = {
  /**
   * Get all blog-tag relationships
   */
  getBlogTag: async (req, res) => {
    try {
      const blogTags = await blogTagService.getBlogTags();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: blogTags,
      });
    } catch (error) {
      console.error('getBlogTag error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Count blogs per tag
   */
  countTag: async (req, res) => {
    try {
      const tagCount = await blogTagService.getTagCount();

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
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
   * Add tags to latest blog
   */
  addBlogTag: async (req, res) => {
    const { tagId } = req.body;

    try {
      await blogTagService.addBlogTags(tagId);

      res.status(200).send({
        status: 'success',
        message: 'Blog tag has been added to the article',
      });
    } catch (error) {
      console.error('addBlogTag error:', error);
      const statusCode = error.message === 'Your input has duplicate' ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Update blog tags
   */
  editBlogTag: async (req, res) => {
    const { tagId } = req.body;
    const { id } = req.params;

    try {
      await blogTagService.updateBlogTags(id, tagId);

      res.status(200).send({
        status: 'success',
        message: `Blog Tag with tag_id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editBlogTag error:', error);
      let statusCode = 500;
      if (error.message === 'Blog tag not found') {
        statusCode = 404;
      } else if (error.message === 'Your input has duplicate value') {
        statusCode = 403;
      } else if (error.message.includes('doesn\'t exists in our database')) {
        statusCode = 404;
      }

      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog tag not found'
          ? `Blog tag with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Delete blog-tag relationship
   */
  deleteBlogTag: async (req, res) => {
    const { id } = req.params;

    try {
      await blogTagService.deleteBlogTag(id);

      res.status(200).send({
        status: 'success',
        message: `Blog Tag with tag_id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteBlogTag error:', error);
      const statusCode = error.message === 'Blog tag not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog tag not found'
          ? `Blog tag with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
