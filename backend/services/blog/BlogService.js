const { today } = require('../../helpers/queryHelper');
const {
  BlogRepository,
  CategoryBlogRepository,
  TagBlogRepository,
  BlogCategoryRepository,
  BlogTagRepository,
  BlogCommentRepository,
} = require('../../repositories/blog');

/**
 * Blog Service
 * Contains business logic for blog operations
 */
class BlogService {
  constructor() {
    this.blogRepository = new BlogRepository();
    this.categoryBlogRepository = new CategoryBlogRepository();
    this.tagBlogRepository = new TagBlogRepository();
    this.blogCategoryRepository = new BlogCategoryRepository();
    this.blogTagRepository = new BlogTagRepository();
    this.blogCommentRepository = new BlogCommentRepository();
  }

  /**
   * Get all blogs with filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getBlogs(filters) {
    const blogs = await this.blogRepository.getBlogsWithDetails(filters);

    // Process data - convert comma-separated strings to arrays
    blogs.forEach((blog, index) => {
      if (blog.category) {
        blogs[index].category = blog.category.split(',');
      }
      if (blog.tags) {
        blogs[index].tags = blog.tags.split(',');
      }
    });

    return blogs;
  }

  /**
   * Get blog by ID
   * @param {number} blogId
   * @param {boolean} incrementView
   * @returns {Promise<Object>}
   */
  async getBlogById(blogId, incrementView = false) {
    const blog = await this.blogRepository.getBlogWithDetails(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Increment view count if requested
    if (incrementView) {
      await this.blogRepository.incrementView(blogId);
      blog.view = (blog.view || 0) + 1;
    }

    // Process data
    if (blog.category) {
      blog.category = blog.category.split(',');
    }
    if (blog.tags) {
      blog.tags = blog.tags.split(',');
    }

    return blog;
  }

  /**
   * Create new blog post
   * @param {Object} blogData
   * @returns {Promise<Object>}
   */
  async createBlog(blogData) {
    const {
      title, content, excerpt, image, authorId, status = 1,
      categoryIds = [], tagIds = [],
    } = blogData;

    // Create blog post
    const newBlog = await this.blogRepository.create({
      title,
      content,
      excerpt,
      image,
      author_id: authorId,
      status,
      date: today,
      view: 0,
    });

    const blogId = newBlog.id;

    // Add categories
    if (categoryIds.length > 0) {
      await this.blogCategoryRepository.addCategoriesToBlog(blogId, categoryIds);
    }

    // Add tags
    if (tagIds.length > 0) {
      await this.blogTagRepository.addTagsToBlog(blogId, tagIds);
    }

    return newBlog;
  }

  /**
   * Update blog post
   * @param {number} blogId
   * @param {Object} blogData
   * @returns {Promise<void>}
   */
  async updateBlog(blogId, blogData) {
    const blog = await this.blogRepository.findById(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    const updateData = {};

    if (blogData.title) updateData.title = blogData.title;
    if (blogData.content) updateData.content = blogData.content;
    if (blogData.excerpt) updateData.excerpt = blogData.excerpt;
    if (blogData.image) updateData.image = blogData.image;
    if (blogData.status !== undefined) updateData.status = blogData.status;

    await this.blogRepository.update(blogId, updateData);

    // Update categories if provided
    if (blogData.categoryIds) {
      await this.blogCategoryRepository.deleteByBlog(blogId);
      if (blogData.categoryIds.length > 0) {
        await this.blogCategoryRepository.addCategoriesToBlog(blogId, blogData.categoryIds);
      }
    }

    // Update tags if provided
    if (blogData.tagIds) {
      await this.blogTagRepository.deleteByBlog(blogId);
      if (blogData.tagIds.length > 0) {
        await this.blogTagRepository.addTagsToBlog(blogId, blogData.tagIds);
      }
    }
  }

  /**
   * Delete blog post
   * @param {number} blogId
   * @returns {Promise<void>}
   */
  async deleteBlog(blogId) {
    const blog = await this.blogRepository.findById(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Delete related data
    await this.blogCategoryRepository.deleteByBlog(blogId);
    await this.blogTagRepository.deleteByBlog(blogId);

    // Delete blog
    await this.blogRepository.delete(blogId);
  }

  /**
   * Get all categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    return this.categoryBlogRepository.getCategoriesWithBlogCount();
  }

  /**
   * Create category
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createCategory(name) {
    const existing = await this.categoryBlogRepository.findByName(name);

    if (existing) {
      throw new Error('Category already exists');
    }

    return this.categoryBlogRepository.create({ name });
  }

  /**
   * Update category
   * @param {number} categoryId
   * @param {string} name
   * @returns {Promise<void>}
   */
  async updateCategory(categoryId, name) {
    const category = await this.categoryBlogRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoryBlogRepository.update(categoryId, { name });
  }

  /**
   * Delete category
   * @param {number} categoryId
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId) {
    const category = await this.categoryBlogRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoryBlogRepository.delete(categoryId);
  }

  /**
   * Get all blog-category relationships with details
   * @returns {Promise<Array>}
   */
  async getBlogCategories() {
    const query = `
      SELECT bc.blog_id, b.title AS title_blog, bc.category_id, cb.name AS category
      FROM blog_category bc
      JOIN blog b ON bc.blog_id = b.id
      JOIN category_blog cb ON bc.category_id = cb.id
    `;
    return this.blogCategoryRepository.rawQuery(query);
  }

  /**
   * Get category counts
   * @returns {Promise<Array>}
   */
  async getCategoryCount() {
    const query = `
      SELECT bc.category_id, cb.name AS category, COUNT(bc.category_id) AS count
      FROM blog_category bc
      JOIN category_blog cb ON bc.category_id = cb.id
      GROUP BY bc.category_id, cb.name
      ORDER BY count DESC
    `;
    return this.blogCategoryRepository.rawQuery(query);
  }

  /**
   * Add categories to the latest blog
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async addBlogCategories(categoryIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
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

    // Add categories to blog
    await this.blogCategoryRepository.addCategoriesToBlog(blogId, categoryIds);
  }

  /**
   * Update blog categories
   * @param {number} blogId
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async updateBlogCategories(blogId, categoryIds) {
    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog category not found');
    }

    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
      throw new Error('Your input has duplicate value');
    }

    // Verify all category IDs exist
    const categories = await this.categoryBlogRepository.findAll();
    const validCategoryIds = categories.map((c) => c.id);
    const allValid = categoryIds.every((id) => validCategoryIds.includes(id));

    if (!allValid) {
      throw new Error('One of the category id doesn\'t exists in our database');
    }

    // Delete existing categories
    await this.blogCategoryRepository.deleteByBlog(blogId);

    // Add new categories
    await this.blogCategoryRepository.addCategoriesToBlog(blogId, categoryIds);
  }

  /**
   * Delete blog-category relationship
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteBlogCategory(id) {
    const blogCategory = await this.blogCategoryRepository.findById(id);

    if (!blogCategory) {
      throw new Error('Blog category not found');
    }

    await this.blogCategoryRepository.delete(id);
  }

  /**
   * Get all tags
   * @returns {Promise<Array>}
   */
  async getTags() {
    return this.tagBlogRepository.getTagsWithBlogCount();
  }

  /**
   * Create tag
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async createTag(name) {
    const existing = await this.tagBlogRepository.findByName(name);

    if (existing) {
      throw new Error('Tag already exists');
    }

    return this.tagBlogRepository.create({ name });
  }

  /**
   * Update tag
   * @param {number} tagId
   * @param {string} name
   * @returns {Promise<void>}
   */
  async updateTag(tagId, name) {
    const tag = await this.tagBlogRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagBlogRepository.update(tagId, { name });
  }

  /**
   * Delete tag
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  async deleteTag(tagId) {
    const tag = await this.tagBlogRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagBlogRepository.delete(tagId);
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

module.exports = BlogService;
