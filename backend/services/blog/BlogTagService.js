const {
  BlogTagRepository,
  BlogRepository,
  TagBlogRepository,
} = require('../../repositories/blog');

/**
 * Blog Tag Service
 * Contains business logic for blog-tag relationship operations
 */
class BlogTagService {
  constructor() {
    this.blogTagRepository = new BlogTagRepository();
    this.blogRepository = new BlogRepository();
    this.tagBlogRepository = new TagBlogRepository();
  }

  /**
   * Get all blog-tag relationships with details
   * @returns {Promise<Array>}
   */
  async getBlogTags() {
    const query = `
      SELECT bt.blog_id, b.title AS title_blog, bt.tag_id, t.name AS tags
      FROM blog_tag bt
      JOIN blog b ON bt.blog_id = b.id
      JOIN tag_blog t ON bt.tag_id = t.id
    `;
    return this.blogTagRepository.rawQuery(query);
  }

  /**
   * Get tag counts
   * @returns {Promise<Array>}
   */
  async getTagCount() {
    const query = `
      SELECT bt.tag_id, tb.name AS tags, COUNT(bt.tag_id) AS count
      FROM blog_tag bt
      JOIN tag_blog tb ON bt.tag_id = tb.id
      GROUP BY bt.tag_id, tb.name
      ORDER BY count DESC
    `;
    return this.blogTagRepository.rawQuery(query);
  }

  /**
   * Add tags to the latest blog
   * @param {Array<number>} tagIds
   * @returns {Promise<void>}
   */
  async addBlogTags(tagIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(tagIds)];
    if (uniqueIds.length !== tagIds.length) {
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

    // Add tags to blog
    await this.blogTagRepository.addTagsToBlog(blogId, tagIds);
  }

  /**
   * Update blog tags
   * @param {number} blogId
   * @param {Array<number>} tagIds
   * @returns {Promise<void>}
   */
  async updateBlogTags(blogId, tagIds) {
    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog tag not found');
    }

    // Check for duplicates
    const uniqueIds = [...new Set(tagIds)];
    if (uniqueIds.length !== tagIds.length) {
      throw new Error('Your input has duplicate value');
    }

    // Verify all tag IDs exist
    const tags = await this.tagBlogRepository.findAll();
    const validTagIds = tags.map((t) => t.id);
    const allValid = tagIds.every((id) => validTagIds.includes(id));

    if (!allValid) {
      throw new Error('One of the tag id doesn\'t exists in our database');
    }

    // Delete existing tags
    await this.blogTagRepository.deleteByBlog(blogId);

    // Add new tags
    await this.blogTagRepository.addTagsToBlog(blogId, tagIds);
  }

  /**
   * Delete blog-tag relationship
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteBlogTag(id) {
    const blogTag = await this.blogTagRepository.findById(id);

    if (!blogTag) {
      throw new Error('Blog tag not found');
    }

    await this.blogTagRepository.delete(id);
  }
}

module.exports = BlogTagService;
