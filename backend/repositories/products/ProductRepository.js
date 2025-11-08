const BaseRepository = require('../BaseRepository');

/**
 * Product Repository
 * Handles all database operations for products table
 */
class ProductRepository extends BaseRepository {
  constructor() {
    super('products', 'id');
  }

  /**
   * Get products with complete details (images, reviews, categories, tags, sales)
   * @param {Object} filters
   * @param {Object} pagination
   * @returns {Promise<Object>}
   */
  async getProductsWithDetails(filters = {}, pagination = {}) {
    const { search, category, sortField = 'released_date', sortOrder = 'DESC' } = filters;
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT
        p.status_id, p.store_id, s.store_name, p.id, p.name, p.description,
        p.regular_price,
        (p.regular_price - p.sale_price)/p.regular_price AS discount,
        p.sale_price, p.stock, p.weight, p.released_date, p.updated_date,
        tb1.image, tb2.total_review, tb2.rating, tb3.category, tb4.tags,
        tb5.total_sales_qty
      FROM products p
      JOIN stores s ON p.store_id = s.user_id
      JOIN (
        SELECT product_id, GROUP_CONCAT(image) AS image
        FROM product_image
        GROUP BY product_id
      ) AS tb1 ON p.id = tb1.product_id
      LEFT JOIN (
        SELECT od.product_id, COUNT(rating) AS total_review, AVG(rating) AS rating
        FROM product_review pr
        JOIN order_details od ON pr.review_id = od.review_id
        GROUP BY product_id
      ) AS tb2 ON p.id = tb2.product_id
      JOIN (
        SELECT pc.product_id, GROUP_CONCAT(c.name) AS category
        FROM product_category pc
        JOIN category_product c ON pc.category_id = c.id
        GROUP BY pc.product_id
      ) AS tb3 ON p.id = tb3.product_id
      JOIN (
        SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags
        FROM product_tag pt
        JOIN tag_product tp ON pt.tag_id = tp.id
        GROUP BY pt.product_id
      ) AS tb4 ON p.id = tb4.product_id
      LEFT JOIN (
        SELECT product_id, SUM(qty) AS total_sales_qty
        FROM order_details
        GROUP BY product_id
      ) tb5 ON p.id = tb5.product_id
      WHERE p.status_id = 1
    `;

    const params = [];

    // Add filters
    if (category && search) {
      baseQuery += ` AND tb3.category LIKE ? AND p.name LIKE ?`;
      params.push(`%${category}%`, `%${search}%`);
    } else if (search) {
      baseQuery += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    } else if (category) {
      baseQuery += ` AND tb3.category LIKE ?`;
      params.push(`%${category}%`);
    }

    // Add sorting
    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

    // Count query
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      JOIN product_category pc ON p.id = pc.product_id
      JOIN category_product c ON pc.category_id = c.id
      WHERE p.status_id = 1
    `;

    const countParams = [];
    if (category) {
      countQuery += ' AND c.name LIKE ?';
      countParams.push(`%${category}%`);
    }
    if (search) {
      countQuery += ' AND p.name LIKE ?';
      countParams.push(`%${search}%`);
    }

    // Execute queries
    const [data, countResult] = await Promise.all([
      this.rawQuery(baseQuery + ' LIMIT ? OFFSET ?', [...params, limit, offset]),
      this.rawQuery(countQuery, countParams),
    ]);

    return {
      data,
      total: countResult[0].total,
      page,
      limit,
    };
  }

  /**
   * Get product by ID with complete details
   * @param {number} productId
   * @returns {Promise<Object|null>}
   */
  async getProductWithDetails(productId) {
    const query = `
      SELECT
        p.*, s.store_name,
        tb1.image, tb2.total_review, tb2.rating, tb3.category, tb4.tags,
        tb5.total_sales_qty
      FROM products p
      JOIN stores s ON p.store_id = s.user_id
      LEFT JOIN (
        SELECT product_id, GROUP_CONCAT(image) AS image
        FROM product_image
        GROUP BY product_id
      ) AS tb1 ON p.id = tb1.product_id
      LEFT JOIN (
        SELECT od.product_id, COUNT(rating) AS total_review, AVG(rating) AS rating
        FROM product_review pr
        JOIN order_details od ON pr.review_id = od.review_id
        GROUP BY product_id
      ) AS tb2 ON p.id = tb2.product_id
      LEFT JOIN (
        SELECT pc.product_id, GROUP_CONCAT(c.name) AS category
        FROM product_category pc
        JOIN category_product c ON pc.category_id = c.id
        GROUP BY pc.product_id
      ) AS tb3 ON p.id = tb3.product_id
      LEFT JOIN (
        SELECT pt.product_id, GROUP_CONCAT(tp.name) AS tags
        FROM product_tag pt
        JOIN tag_product tp ON pt.tag_id = tp.id
        GROUP BY pt.product_id
      ) AS tb4 ON p.id = tb4.product_id
      LEFT JOIN (
        SELECT product_id, SUM(qty) AS total_sales_qty
        FROM order_details
        GROUP BY product_id
      ) tb5 ON p.id = tb5.product_id
      WHERE p.id = ?
    `;

    const results = await this.rawQuery(query, [productId]);
    return results[0] || null;
  }

  /**
   * Get products by store
   * @param {number} storeId
   * @returns {Promise<Array>}
   */
  async getProductsByStore(storeId) {
    return this.findAll({ where: { store_id: storeId } });
  }

  /**
   * Update stock
   * @param {number} productId
   * @param {number} quantity
   * @returns {Promise<Object>}
   */
  async updateStock(productId, quantity) {
    const query = 'UPDATE products SET stock = stock + ? WHERE id = ?';
    return this.rawQuery(query, [quantity, productId]);
  }

  /**
   * Decrease stock
   * @param {number} productId
   * @param {number} quantity
   * @returns {Promise<Object>}
   */
  async decreaseStock(productId, quantity) {
    const query = 'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?';
    return this.rawQuery(query, [quantity, productId, quantity]);
  }
}

module.exports = ProductRepository;
