const { today } = require('../../helpers/queryHelper');
const {
  ProductRepository,
  ProductImageRepository,
  ProductCategoryRepository,
  ProductTagRepository,
  CategoryProductRepository,
  TagProductRepository,
} = require('../../repositories/products');

/**
 * Product Service
 * Contains business logic for product operations
 */
class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.productImageRepository = new ProductImageRepository();
    this.productCategoryRepository = new ProductCategoryRepository();
    this.productTagRepository = new ProductTagRepository();
    this.categoryProductRepository = new CategoryProductRepository();
    this.tagProductRepository = new TagProductRepository();
  }

  /**
   * Get products with pagination and filters
   * @param {Object} filters
   * @param {Object} pagination
   * @returns {Promise<Object>}
   */
  async getProducts(filters, pagination) {
    const result = await this.productRepository.getProductsWithDetails(filters, pagination);

    // Process results - convert comma-separated strings to arrays
    result.data.forEach((item, index) => {
      if (item.category) {
        result.data[index].category = item.category.split(',');
      }
      if (item.tags) {
        result.data[index].tags = item.tags.split(',');
      }
      if (item.image) {
        result.data[index].image = item.image.split(',');
      }
    });

    return result;
  }

  /**
   * Get product by ID
   * @param {number} productId
   * @returns {Promise<Object>}
   */
  async getProductById(productId) {
    const product = await this.productRepository.getProductWithDetails(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Process data
    if (product.category) {
      product.category = product.category.split(',');
    }
    if (product.tags) {
      product.tags = product.tags.split(',');
    }
    if (product.image) {
      product.image = product.image.split(',');
    }

    return product;
  }

  /**
   * Create new product
   * @param {Object} productData
   * @returns {Promise<Object>}
   */
  async createProduct(productData) {
    const {
      storeId, name, description, regularPrice, salePrice,
      stock, weight, statusId = 1, images = [], categoryIds = [], tagIds = [],
    } = productData;

    // Create product
    const newProduct = await this.productRepository.create({
      store_id: storeId,
      name,
      description,
      regular_price: regularPrice,
      sale_price: salePrice,
      stock,
      weight,
      status_id: statusId,
      released_date: today,
      updated_date: today,
    });

    const productId = newProduct.id;

    // Add images
    if (images.length > 0) {
      const imageData = images.map((image) => ({
        product_id: productId,
        image,
      }));
      await this.productImageRepository.createMany(imageData);
    }

    // Add categories
    if (categoryIds.length > 0) {
      await this.productCategoryRepository.addCategoriesToProduct(productId, categoryIds);
    }

    // Add tags
    if (tagIds.length > 0) {
      await this.productTagRepository.addTagsToProduct(productId, tagIds);
    }

    return newProduct;
  }

  /**
   * Update product
   * @param {number} productId
   * @param {Object} productData
   * @returns {Promise<void>}
   */
  async updateProduct(productId, productData) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const updateData = {};

    if (productData.name) updateData.name = productData.name;
    if (productData.description) updateData.description = productData.description;
    if (productData.regularPrice) updateData.regular_price = productData.regularPrice;
    if (productData.salePrice) updateData.sale_price = productData.salePrice;
    if (productData.stock !== undefined) updateData.stock = productData.stock;
    if (productData.weight) updateData.weight = productData.weight;
    if (productData.statusId) updateData.status_id = productData.statusId;

    updateData.updated_date = today;

    await this.productRepository.update(productId, updateData);

    // Update images if provided
    if (productData.images) {
      await this.productImageRepository.deleteByProduct(productId);
      if (productData.images.length > 0) {
        const imageData = productData.images.map((image) => ({
          product_id: productId,
          image,
        }));
        await this.productImageRepository.createMany(imageData);
      }
    }

    // Update categories if provided
    if (productData.categoryIds) {
      await this.productCategoryRepository.deleteByProduct(productId);
      if (productData.categoryIds.length > 0) {
        await this.productCategoryRepository.addCategoriesToProduct(productId, productData.categoryIds);
      }
    }

    // Update tags if provided
    if (productData.tagIds) {
      await this.productTagRepository.deleteByProduct(productId);
      if (productData.tagIds.length > 0) {
        await this.productTagRepository.addTagsToProduct(productId, productData.tagIds);
      }
    }
  }

  /**
   * Delete product
   * @param {number} productId
   * @returns {Promise<void>}
   */
  async deleteProduct(productId) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Delete related data
    await this.productImageRepository.deleteByProduct(productId);
    await this.productCategoryRepository.deleteByProduct(productId);
    await this.productTagRepository.deleteByProduct(productId);

    // Delete product
    await this.productRepository.delete(productId);
  }

  /**
   * Update product stock
   * @param {number} productId
   * @param {number} quantity
   * @returns {Promise<void>}
   */
  async updateStock(productId, quantity) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    await this.productRepository.updateStock(productId, quantity);
  }

  /**
   * Decrease product stock (for orders)
   * @param {number} productId
   * @param {number} quantity
   * @returns {Promise<void>}
   */
  async decreaseStock(productId, quantity) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const result = await this.productRepository.decreaseStock(productId, quantity);

    if (result.affectedRows === 0) {
      throw new Error('Failed to decrease stock');
    }
  }

  /**
   * Get products by store
   * @param {number} storeId
   * @returns {Promise<Array>}
   */
  async getProductsByStore(storeId) {
    return this.productRepository.getProductsByStore(storeId);
  }

  /**
   * Get all categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    return this.categoryProductRepository.getCategoriesWithProductCount();
  }

  /**
   * Get category by ID
   * @param {number} categoryId
   * @returns {Promise<Object>}
   */
  async getCategoryById(categoryId) {
    const category = await this.categoryProductRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Create category
   * @param {Object} categoryData
   * @returns {Promise<Object>}
   */
  async createCategory(categoryData) {
    const { name } = categoryData;

    // Check if category exists
    const existing = await this.categoryProductRepository.findByName(name);

    if (existing) {
      throw new Error('Category already exists');
    }

    return this.categoryProductRepository.create({ name });
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

    await this.categoryProductRepository.update(categoryId, categoryData);
  }

  /**
   * Delete category
   * @param {number} categoryId
   * @returns {Promise<void>}
   */
  async deleteCategory(categoryId) {
    const category = await this.categoryProductRepository.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoryProductRepository.delete(categoryId);
  }

  /**
   * Get all tags
   * @returns {Promise<Array>}
   */
  async getTags() {
    return this.tagProductRepository.getTagsWithProductCount();
  }

  /**
   * Get tag by ID
   * @param {number} tagId
   * @returns {Promise<Object>}
   */
  async getTagById(tagId) {
    const tag = await this.tagProductRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  }

  /**
   * Create tag
   * @param {Object} tagData
   * @returns {Promise<Object>}
   */
  async createTag(tagData) {
    const { name } = tagData;

    // Check if tag exists
    const existing = await this.tagProductRepository.findByName(name);

    if (existing) {
      throw new Error('Tag already exists');
    }

    return this.tagProductRepository.create({ name });
  }

  /**
   * Update tag
   * @param {number} tagId
   * @param {Object} tagData
   * @returns {Promise<void>}
   */
  async updateTag(tagId, tagData) {
    const tag = await this.tagProductRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagProductRepository.update(tagId, tagData);
  }

  /**
   * Delete tag
   * @param {number} tagId
   * @returns {Promise<void>}
   */
  async deleteTag(tagId) {
    const tag = await this.tagProductRepository.findById(tagId);

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.tagProductRepository.delete(tagId);
  }
}

module.exports = ProductService;
