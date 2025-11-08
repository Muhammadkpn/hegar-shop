const { CategoryProductRepository } = require('../../repositories/products');

/**
 * Category Product Service
 * Contains business logic for product category operations
 */
class CategoryProductService {
  constructor() {
    this.categoryProductRepository = new CategoryProductRepository();
  }

  /**
   * Get all categories with optional name filter
   * @param {string} name - Optional name filter
   * @returns {Promise<Array>}
   */
  async getCategories(name = null) {
    if (name) {
      const query = `SELECT * FROM category_product WHERE name LIKE ?`;
      return this.categoryProductRepository.rawQuery(query, [`%${name}%`]);
    }
    return this.categoryProductRepository.findAll();
  }

  /**
   * Get hierarchical category structure
   * @returns {Promise<Object>}
   */
  async getCategoryHierarchy() {
    const query = `
      WITH RECURSIVE category_path (id, name, lvl, parent_id) AS
      (
        SELECT id, name, 0 lvl, parent_id
        FROM category_product
        WHERE parent_id IS NULL
        UNION ALL
        SELECT c.id, c.name, cp.lvl + 1, c.parent_id
        FROM category_path AS cp
        JOIN category_product AS c ON cp.id = c.parent_id
      )
      SELECT * FROM category_path
      ORDER BY lvl
    `;

    const result = await this.categoryProductRepository.rawQuery(query);

    // Group by level
    const parent = [];
    const child1 = [];
    const child2 = [];

    result.forEach((item) => {
      if (item.lvl === 0) {
        parent.push(item);
      } else if (item.lvl === 1) {
        child1.push(item);
      } else if (item.lvl === 2) {
        child2.push(item);
      }
    });

    return {
      parent,
      child1,
      child2,
    };
  }

  /**
   * Create new category
   * @param {Object} categoryData
   * @returns {Promise<Object>}
   */
  async createCategory(categoryData) {
    const { name, parentId } = categoryData;

    // Check if category already exists
    const existing = await this.categoryProductRepository.findByName(name);
    if (existing) {
      throw new Error('Category already exists');
    }

    return this.categoryProductRepository.create({
      name,
      parent_id: parentId || null,
    });
  }

  /**
   * Update category
   * @param {number} categoryId
   * @param {Object} categoryData
   * @returns {Promise<void>}
   */
  async updateCategory(categoryId, categoryData) {
    const category = await this.categoryProductRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    const { name, parentId } = categoryData;

    await this.categoryProductRepository.update(categoryId, {
      name,
      parent_id: parentId || null,
    });
  }

  /**
   * Delete category and all its children
   * @param {number} categoryId
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId) {
    const category = await this.categoryProductRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Get all child categories recursively
    const query = `
      WITH RECURSIVE category_path (id, name, parent_id) AS
      (
        SELECT id, name, parent_id
        FROM category_product
        WHERE id = ?
        UNION ALL
        SELECT c.id, c.name, c.parent_id
        FROM category_path AS cp
        JOIN category_product AS c ON cp.id = c.parent_id
      )
      SELECT id FROM category_path
    `;

    const allCategories = await this.categoryProductRepository.rawQuery(query, [categoryId]);

    // Delete all categories (parent and children)
    const deletePromises = allCategories.map((cat) =>
      this.categoryProductRepository.delete(cat.id)
    );

    await Promise.all(deletePromises);
  }
}

module.exports = CategoryProductService;
