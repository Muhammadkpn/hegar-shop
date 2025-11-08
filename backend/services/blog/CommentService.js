const { BlogCommentRepository, BlogRepository } = require('../../repositories/blog');

/**
 * Comment Service
 * Contains business logic for blog comment operations
 */
class CommentService {
  constructor() {
    this.blogCommentRepository = new BlogCommentRepository();
    this.blogRepository = new BlogRepository();
  }

  /**
   * Get comments with nested replies (public view - status = 1 only)
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getComments(blogId) {
    const comments = await this.blogCommentRepository.getCommentsWithReplies(blogId, false);
    return this._processCommentReplies(comments);
  }

  /**
   * Get comments with nested replies (admin view - all statuses)
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getCommentsAdmin(blogId) {
    const comments = await this.blogCommentRepository.getCommentsWithReplies(blogId, true);
    return this._processCommentReplies(comments);
  }

  /**
   * Process comment replies from string to array of objects
   * @private
   */
  _processCommentReplies(comments) {
    comments.forEach((comment, index) => {
      const tempReply = [];
      const tempArr = comment.reply ? comment.reply.split('//') : [];

      tempArr.forEach((value) => {
        if (value) {
          tempReply.push(JSON.parse(value.toString()));
        }
      });

      comments[index].reply = tempReply;
    });

    return comments;
  }

  /**
   * Add comment
   * @param {Object} commentData
   * @returns {Promise<Object>}
   */
  async addComment(commentData) {
    const { userId, comment, replyId, blogId, status = 1 } = commentData;

    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    return this.blogCommentRepository.create({
      user_id: userId,
      date,
      comment,
      reply_id: replyId || null,
      blog_id: blogId,
      status,
    });
  }

  /**
   * Update comment
   * @param {number} commentId
   * @param {Object} updateData
   * @param {string} type - 'admin' or 'user'
   * @returns {Promise<void>}
   */
  async updateComment(commentId, updateData, type = 'user') {
    const comment = await this.blogCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    let dataToUpdate = {};

    if (type === 'admin') {
      // Admin can only update status
      dataToUpdate.status = updateData.status;
    } else {
      // User can update comment content
      const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      dataToUpdate.date = date;
      dataToUpdate.comment = updateData.comment;
    }

    await this.blogCommentRepository.update(commentId, dataToUpdate);
  }

  /**
   * Delete comment
   * @param {number} commentId
   * @returns {Promise<void>}
   */
  async deleteComment(commentId) {
    const comment = await this.blogCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    await this.blogCommentRepository.delete(commentId);
  }
}

module.exports = CommentService;
