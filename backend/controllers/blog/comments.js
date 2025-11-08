const { CommentService } = require('../../services/blog');

const commentService = new CommentService();

/**
 * Blog Comments Controller - Clean Architecture
 * Manages blog comment CRUD operations with nested replies
 */

module.exports = {
  /**
   * Get comments by blog ID (public view - status = 1 only)
   */
  getCommentByArticle: async (req, res) => {
    const { id } = req.params;

    try {
      const comments = await commentService.getComments(id);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: comments,
      });
    } catch (error) {
      console.error('getCommentByArticle error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get comments by blog ID (admin view - all statuses)
   */
  getCommentsAdmin: async (req, res) => {
    const { id } = req.params;

    try {
      const comments = await commentService.getCommentsAdmin(id);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: comments,
      });
    } catch (error) {
      console.error('getCommentsAdmin error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Add new comment
   */
  addComment: async (req, res) => {
    const { userId, comment, replyId, blogId, status } = req.body;

    try {
      await commentService.addComment({
        userId,
        comment,
        replyId,
        blogId,
        status,
      });

      res.status(200).send({
        status: 'success',
        message: 'Your comment has been sent',
      });
    } catch (error) {
      console.error('addComment error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Edit comment
   */
  editComment: async (req, res) => {
    const { id } = req.params;
    const { comment, status } = req.body;
    const { type } = req.query;

    try {
      await commentService.updateComment(
        id,
        type === 'admin' ? { status } : { comment },
        type
      );

      res.status(200).send({
        status: 'success',
        message: `Comment with id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editComment error:', error);
      const statusCode = error.message === 'Comment not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Comment not found'
          ? `Comment with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },

  /**
   * Delete comment
   */
  deleteComment: async (req, res) => {
    const { id } = req.params;

    try {
      await commentService.deleteComment(id);

      res.status(200).send({
        status: 'success',
        message: 'Your comment has been deleted',
      });
    } catch (error) {
      console.error('deleteComment error:', error);
      const statusCode = error.message === 'Comment not found' ? 404 : 500;
      res.status(statusCode).send({
        status: statusCode,
        code: statusCode,
        message: error.message === 'Comment not found'
          ? `Comment with id = ${id} doesn't exists`
          : error.message,
      });
    }
  },
};
