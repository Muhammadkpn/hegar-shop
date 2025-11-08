const { getImageUrl, today } = require('../../helpers/queryHelper');
const { BlogService } = require('../../services/blog');

const blogService = new BlogService();

/**
 * Blog Controller - Clean Architecture
 * Request → Router → Validator → Controller → Service → Repository → Database
 *
 * Controller responsibilities:
 * - Handle HTTP request/response
 * - Parse query parameters
 * - Format response
 * - Error handling
 */

module.exports = {
  /**
   * Get public blogs with filters
   */
  getBlog: async (req, res) => {
    const {
      search, categories, tags, _sort, _order,
    } = req.query;

    try {
      // Validate sort field
      const allowedSortFields = ['id', 'title', 'date', 'view', 'author_name'];
      const sortField = allowedSortFields.includes(_sort) ? `b.${_sort}` : 'b.date';
      const sortOrder = _order && _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // Call service
      const blogs = await blogService.getBlogs({
        search,
        categories,
        tags,
        sortField,
        sortOrder,
        status: 1, // Only published blogs
      });

      // Convert images to full URLs
      blogs.forEach((blog, index) => {
        if (blog.image) {
          blogs[index].image = getImageUrl(blog.image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: blogs,
      });
    } catch (error) {
      console.error('getBlog error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get blogs for admin (all statuses)
   */
  getAdminBlog: async (req, res) => {
    const {
      titles, _sort, _order, status,
    } = req.query;

    try {
      // Validate sort field
      const allowedSortFields = ['id', 'title', 'date', 'view', 'status', 'author_name'];
      const sortField = allowedSortFields.includes(_sort) ? `b.${_sort}` : 'b.date';
      const sortOrder = _order && _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // Determine status filter
      let statusFilter;
      if (status && status !== 'All') {
        statusFilter = parseInt(status, 10);
      }

      // Call service
      const blogs = await blogService.getBlogs({
        search: titles,
        sortField,
        sortOrder,
        status: statusFilter,
      });

      // Convert images to full URLs
      blogs.forEach((blog, index) => {
        if (blog.image) {
          blogs[index].image = getImageUrl(blog.image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: blogs,
      });
    } catch (error) {
      console.error('getAdminBlog error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get blog details by ID
   */
  getDetailsBlog: async (req, res) => {
    const { id } = req.params;

    try {
      const blog = await blogService.getBlogById(id, false);

      // Check if blog is published
      if (blog.status !== 1) {
        return res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'Your article not found',
        });
      }

      // Convert image to full URL
      if (blog.image) {
        blog.image = getImageUrl(blog.image, req);
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: blog,
      });
    } catch (error) {
      console.error('getDetailsBlog error:', error);
      const statusCode = error.message === 'Blog not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog not found' ? 'Your article not found' : error.message,
      });
    }
  },

  /**
   * Get other/related blogs (prev and next)
   */
  getOthersBlog: async (req, res) => {
    const { id } = req.params;

    try {
      // Get all blogs sorted by date
      const allBlogs = await blogService.getBlogs({
        sortField: 'b.date',
        sortOrder: 'DESC',
      });

      // Find index of current blog
      const currentIndex = allBlogs.findIndex((blog) => blog.id === parseInt(id, 10));

      if (currentIndex === -1) {
        return res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'Your other articles not found',
        });
      }

      // Get previous and next blogs
      const relatedBlogs = [];

      if (currentIndex > 0) {
        relatedBlogs.push(allBlogs[currentIndex - 1]);
      }
      if (currentIndex < allBlogs.length - 1) {
        relatedBlogs.push(allBlogs[currentIndex + 1]);
      }

      if (relatedBlogs.length === 0) {
        return res.status(404).send({
          status: 'fail',
          code: 404,
          message: 'Your other articles not found',
        });
      }

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: relatedBlogs,
      });
    } catch (error) {
      console.error('getOthersBlog error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get popular blogs (top 4 by view count)
   */
  getPopularBlog: async (req, res) => {
    try {
      // Get published blogs sorted by view count
      const blogs = await blogService.getBlogs({
        sortField: 'b.view',
        sortOrder: 'DESC',
        status: 1,
      });

      // Take top 4
      const popularBlogs = blogs.slice(0, 4);

      // Convert images to full URLs
      popularBlogs.forEach((blog, index) => {
        if (blog.image) {
          popularBlogs[index].image = getImageUrl(blog.image, req);
        }
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data: popularBlogs,
      });
    } catch (error) {
      console.error('getPopularBlog error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Increment blog view count
   */
  countView: async (req, res) => {
    const { id } = req.params;

    try {
      const blog = await blogService.getBlogById(id, true);

      res.status(200).send({
        status: 'success',
        message: 'The number of view has been added',
        data: {
          id: blog.id,
          title: blog.title,
          view: blog.view,
        },
      });
    } catch (error) {
      console.error('countView error:', error);
      const statusCode = error.message === 'Blog not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog not found' ? 'Article not found' : error.message,
      });
    }
  },

  /**
   * Add new blog
   */
  addBlog: async (req, res) => {
    const { title, content, authorId } = req.body;

    // Validate file upload
    if (!req.file) {
      return res.status(400).send({
        status: 'fail',
        code: 400,
        message: 'no image',
      });
    }

    try {
      const imagePath = `image/blog/${req.file.filename}`;

      await blogService.createBlog({
        title,
        content,
        image: imagePath,
        authorId,
        status: 1,
        categoryIds: [], // Can be added later via blogCategory endpoint
        tagIds: [],
      });

      res.status(200).send({
        status: 'success',
        message: 'Your new article has been added to database',
      });
    } catch (error) {
      console.error('addBlog error:', error);
      const statusCode = error.message.includes('already') ? 403 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Edit blog content
   */
  editBlog: async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
      await blogService.updateBlog(id, { title, content });

      res.status(200).send({
        status: 'success',
        message: `Article with id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editBlog error:', error);
      const statusCode = error.message === 'Blog not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog not found' ? `Article with id = ${id} doesn't exists` : error.message,
      });
    }
  },

  /**
   * Edit blog image
   */
  editBlogImage: async (req, res) => {
    const { id } = req.params;

    // Validate file upload
    if (!req.file) {
      return res.status(400).send({
        status: 'fail',
        code: 400,
        message: 'no image',
      });
    }

    try {
      const imagePath = `image/blog/${req.file.filename}`;

      await blogService.updateBlog(id, { image: imagePath });

      res.status(200).send({
        status: 'success',
        message: `Image of article with id: ${id} has been edited`,
      });
    } catch (error) {
      console.error('editBlogImage error:', error);
      const statusCode = error.message === 'Blog not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog not found' ? `Article with id = ${id} doesn't exists` : error.message,
      });
    }
  },

  /**
   * Delete blog
   */
  deleteBlog: async (req, res) => {
    const { id } = req.params;

    try {
      await blogService.deleteBlog(id);

      res.status(200).send({
        status: 'success',
        message: `Article with id: ${id} has been deleted`,
      });
    } catch (error) {
      console.error('deleteBlog error:', error);
      const statusCode = error.message === 'Blog not found' ? 404 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Blog not found' ? `Article with id = ${id} doesn't exists` : error.message,
      });
    }
  },
};
