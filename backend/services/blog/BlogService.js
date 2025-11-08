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
   * Get comments by blog ID
   * @param {number} blogId
   * @returns {Promise<Array>}
   */
  async getComments(blogId) {
    return this.blogCommentRepository.getCommentsByBlog(blogId);
  }

  /**
   * Add comment
   * @param {Object} commentData
   * @returns {Promise<Object>}
   */
  async addComment(commentData) {
    const { blogId, userId, content } = commentData;

    // Check if blog exists
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    return this.blogCommentRepository.create({
      blog_id: blogId,
      user_id: userId,
      content,
      created_at: new Date(),
    });
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
