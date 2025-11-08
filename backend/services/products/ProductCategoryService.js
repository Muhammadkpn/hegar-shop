const {
  ProductCategoryRepository,
  ProductRepository,
  CategoryProductRepository,
} = require('../../repositories/products');

/**
 * Product Category Service
 * Contains business logic for product-category relationship operations
 */
class ProductCategoryService {
  constructor() {
    this.productCategoryRepository = new ProductCategoryRepository();
    this.productRepository = new ProductRepository();
    this.categoryProductRepository = new CategoryProductRepository();
  }

  /**
   * Get all product-category relationships
   * @returns {Promise<Array>}
   */
  async getProductCategories() {
    const query = `
      SELECT p.store_id, u.username, pc.product_id, p.name, p.sale_price, p.regular_price,
             pc.category_id, cp.name AS category
      FROM product_category pc
      JOIN products p ON pc.product_id = p.id
      JOIN category_product cp ON pc.category_id = cp.id
      JOIN users u ON p.store_id = u.id
    `;
    return this.productCategoryRepository.rawQuery(query);
  }

  /**
   * Get category counts
   * @returns {Promise<Array>}
   */
  async getCategoryCount() {
    const query = `
      SELECT pc.category_id, cp.name AS category, COUNT(pc.category_id) AS count
      FROM product_category pc
      JOIN category_product cp ON pc.category_id = cp.id
      GROUP BY pc.category_id, cp.name
      ORDER BY count DESC
    `;
    return this.productCategoryRepository.rawQuery(query);
  }

  /**
   * Get category counts by store
   * @param {number} storeId
   * @returns {Promise<Object>}
   */
  async getCategoryCountByStore(storeId) {
    const query = `
      SELECT pc.category_id, cp.name AS category, COUNT(pc.category_id) AS count
      FROM product_category pc
      JOIN category_product cp ON pc.category_id = cp.id
      JOIN products p ON pc.product_id = p.id
      WHERE p.store_id = ?
      GROUP BY pc.category_id, cp.name
      ORDER BY count DESC
    `;

    const countCategory = await this.productCategoryRepository.rawQuery(query, [storeId]);

    return {
      store_id: storeId,
      countCategory,
    };
  }

  /**
   * Add categories to latest product with hierarchical support
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async addProductCategories(categoryIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
      throw new Error('Your input has duplicate');
    }

    // Get latest product ID
    const latestProducts = await this.productRepository.findAll({
      orderBy: 'id',
      order: 'DESC',
      limit: 1,
    });

    if (latestProducts.length === 0) {
      throw new Error('No products found');
    }

    const productId = latestProducts[0].id;

    // Get category hierarchy levels
    const categoryLevels = await this._getCategoryHierarchy();

    // Filter requested categories and verify they exist
    const filterLevel = categoryLevels.filter((cat) => categoryIds.includes(cat.id));

    if (filterLevel.length !== categoryIds.length) {
      throw new Error('One of the category doesn\'t exists in database');
    }

    // For each category, get all parent categories and add them
    for (const category of filterLevel) {
      const allParentCategories = await this._getAllParentCategories(category.id);

      // Insert each category if not already exists
      for (const parentCat of allParentCategories) {
        const existing = await this.productCategoryRepository.findOne({
          product_id: productId,
          category_id: parentCat.id,
        });

        if (!existing) {
          await this.productCategoryRepository.create({
            product_id: productId,
            category_id: parentCat.id,
          });
        }
      }
    }
  }

  /**
   * Update product categories by product ID
   * @param {number} productId
   * @param {Array<number>} categoryIds
   * @returns {Promise<void>}
   */
  async updateProductCategories(productId, categoryIds) {
    // Check for duplicates
    const uniqueIds = [...new Set(categoryIds)];
    if (uniqueIds.length !== categoryIds.length) {
      throw new Error('Your input has duplicate');
    }

    // Verify product exists
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Get category hierarchy and verify categories exist
    const categoryLevels = await this._getCategoryHierarchy();
    const filterLevel = categoryLevels.filter((cat) => categoryIds.includes(cat.id));

    if (filterLevel.length !== categoryIds.length) {
      throw new Error('One of the category doesn\'t exists in database');
    }

    // Delete all existing categories for this product
    await this.productCategoryRepository.deleteWhere({ product_id: productId });

    // Add new categories with their parents
    for (const category of filterLevel) {
      const allParentCategories = await this._getAllParentCategories(category.id);

      for (const parentCat of allParentCategories) {
        const existing = await this.productCategoryRepository.findOne({
          product_id: productId,
          category_id: parentCat.id,
        });

        if (!existing) {
          await this.productCategoryRepository.create({
            product_id: productId,
            category_id: parentCat.id,
          });
        }
      }
    }
  }

  /**
   * Delete all categories for a product
   * @param {number} productId
   * @returns {Promise<void>}
   */
  async deleteProductCategories(productId) {
    const existing = await this.productCategoryRepository.findOne({ product_id: productId });

    if (!existing) {
      throw new Error('Product category not found');
    }

    await this.productCategoryRepository.deleteWhere({ product_id: productId });
  }

  /**
   * Get category hierarchy with levels
   * @private
   */
  async _getCategoryHierarchy() {
    const query = `
      WITH RECURSIVE category_path (id, name, lvl) AS
      (
        SELECT id, name, 0 lvl
        FROM category_product
        WHERE parent_id IS NULL
        UNION ALL
        SELECT c.id, c.name, cp.lvl + 1
        FROM category_path AS cp
        JOIN category_product AS c ON cp.id = c.parent_id
      )
      SELECT * FROM category_path
      ORDER BY lvl
    `;

    return this.productCategoryRepository.rawQuery(query);
  }

  /**
   * Get all parent categories recursively
   * @private
   */
  async _getAllParentCategories(categoryId) {
    const query = `
      WITH RECURSIVE category_path (id, name, parent_id) AS
      (
        SELECT id, name, parent_id
        FROM category_product
        WHERE id = ?
        UNION ALL
        SELECT c.id, c.name, c.parent_id
        FROM category_path AS cp
        JOIN category_product AS c ON cp.parent_id = c.id
      )
      SELECT id FROM category_path
    `;

    return this.productCategoryRepository.rawQuery(query, [categoryId]);
  }
}

module.exports = ProductCategoryService;
