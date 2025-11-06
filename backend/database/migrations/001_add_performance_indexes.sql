-- ============================================================
-- Migration: 001 - Add Performance Indexes
-- Description: Add indexes to improve query performance
-- Date: 2025-11-06
-- Phase: 1 - Database Optimization
-- ============================================================

-- ============================================================
-- PRODUCTS TABLE INDEXES
-- ============================================================

-- Index for product status filtering (most common query)
CREATE INDEX IF NOT EXISTS idx_products_status
ON products(status_id);

-- Index for store-based queries
CREATE INDEX IF NOT EXISTS idx_products_store
ON products(store_id);

-- Index for product name searches
CREATE INDEX IF NOT EXISTS idx_products_name
ON products(name);

-- Index for sorting by release date (DESC is common)
CREATE INDEX IF NOT EXISTS idx_products_released_date
ON products(released_date DESC);

-- Index for sorting by update date
CREATE INDEX IF NOT EXISTS idx_products_updated_date
ON products(updated_date DESC);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_status_store
ON products(status_id, store_id);

-- Composite index for status + name search
CREATE INDEX IF NOT EXISTS idx_products_status_name
ON products(status_id, name);

-- Index for price-based sorting/filtering
CREATE INDEX IF NOT EXISTS idx_products_prices
ON products(regular_price, sale_price);

-- ============================================================
-- PRODUCT_CATEGORY TABLE INDEXES
-- ============================================================

-- Index for finding categories by product
CREATE INDEX IF NOT EXISTS idx_product_category_product
ON product_category(product_id);

-- Index for finding products by category
CREATE INDEX IF NOT EXISTS idx_product_category_category
ON product_category(category_id);

-- Composite index for joins
CREATE INDEX IF NOT EXISTS idx_product_category_composite
ON product_category(product_id, category_id);

-- ============================================================
-- PRODUCT_TAG TABLE INDEXES
-- ============================================================

-- Index for finding tags by product
CREATE INDEX IF NOT EXISTS idx_product_tag_product
ON product_tag(product_id);

-- Index for finding products by tag
CREATE INDEX IF NOT EXISTS idx_product_tag_tag
ON product_tag(tag_id);

-- Composite index for joins
CREATE INDEX IF NOT EXISTS idx_product_tag_composite
ON product_tag(product_id, tag_id);

-- ============================================================
-- PRODUCT_IMAGE TABLE INDEXES
-- ============================================================

-- Index for finding images by product
CREATE INDEX IF NOT EXISTS idx_product_image_product
ON product_image(product_id);

-- ============================================================
-- PRODUCT_REVIEW TABLE INDEXES
-- ============================================================

-- Index for rating filtering/sorting
CREATE INDEX IF NOT EXISTS idx_product_review_rating
ON product_review(rating);

-- ============================================================
-- ORDER_DETAILS TABLE INDEXES
-- ============================================================

-- Index for product-based queries (for reviews and sales)
CREATE INDEX IF NOT EXISTS idx_order_details_product
ON order_details(product_id);

-- Index for review joins
CREATE INDEX IF NOT EXISTS idx_order_details_review
ON order_details(review_id);

-- Composite index for common aggregations
CREATE INDEX IF NOT EXISTS idx_order_details_product_review
ON order_details(product_id, review_id);

-- ============================================================
-- STORES TABLE INDEXES
-- ============================================================

-- Index for store lookup by user_id
CREATE INDEX IF NOT EXISTS idx_stores_user
ON stores(user_id);

-- Index for store name searches
CREATE INDEX IF NOT EXISTS idx_stores_name
ON stores(store_name);

-- ============================================================
-- CATEGORY_PRODUCT TABLE INDEXES
-- ============================================================

-- Index for category name searches
CREATE INDEX IF NOT EXISTS idx_category_product_name
ON category_product(name);

-- ============================================================
-- TAG_PRODUCT TABLE INDEXES
-- ============================================================

-- Index for tag name searches
CREATE INDEX IF NOT EXISTS idx_tag_product_name
ON tag_product(name);

-- ============================================================
-- BLOG TABLES INDEXES
-- ============================================================

-- Blog posts
CREATE INDEX IF NOT EXISTS idx_blog_status
ON blog(status_id);

CREATE INDEX IF NOT EXISTS idx_blog_created_date
ON blog(created_date DESC);

CREATE INDEX IF NOT EXISTS idx_blog_author
ON blog(author_id);

-- Blog categories
CREATE INDEX IF NOT EXISTS idx_blog_category_blog
ON blog_category(blog_id);

CREATE INDEX IF NOT EXISTS idx_blog_category_category
ON blog_category(category_id);

-- Blog tags
CREATE INDEX IF NOT EXISTS idx_blog_tag_blog
ON blog_tag(blog_id);

CREATE INDEX IF NOT EXISTS idx_blog_tag_tag
ON blog_tag(tag_id);

-- Blog comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog
ON blog_comments(blog_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_user
ON blog_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_created
ON blog_comments(created_date DESC);

-- ============================================================
-- USERS TABLE INDEXES
-- ============================================================

-- Index for email lookups (login)
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username
ON users(username);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role_id);

-- ============================================================
-- TRANSACTIONS TABLE INDEXES
-- ============================================================

-- Index for user orders
CREATE INDEX IF NOT EXISTS idx_transactions_user
ON transactions(user_id);

-- Index for order status
CREATE INDEX IF NOT EXISTS idx_transactions_status
ON transactions(status_id);

-- Index for order date sorting
CREATE INDEX IF NOT EXISTS idx_transactions_date
ON transactions(order_date DESC);

-- Composite index for user + status queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_status
ON transactions(user_id, status_id);

-- ============================================================
-- CARTS TABLE INDEXES
-- ============================================================

-- Index for user cart lookups
CREATE INDEX IF NOT EXISTS idx_carts_user
ON carts(user_id);

-- Index for product in cart
CREATE INDEX IF NOT EXISTS idx_carts_product
ON carts(product_id);

-- Composite index
CREATE INDEX IF NOT EXISTS idx_carts_user_product
ON carts(user_id, product_id);

-- ============================================================
-- WISHLIST TABLE INDEXES
-- ============================================================

-- Index for user wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user
ON wishlist(user_id);

-- Index for product in wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_product
ON wishlist(product_id);

-- Composite index
CREATE INDEX IF NOT EXISTS idx_wishlist_user_product
ON wishlist(user_id, product_id);

-- ============================================================
-- ADDRESS TABLE INDEXES
-- ============================================================

-- Index for user addresses
CREATE INDEX IF NOT EXISTS idx_address_user
ON address(user_id);

-- ============================================================
-- SUBSCRIBE TABLE INDEXES
-- ============================================================

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_subscribe_email
ON subscribe(email);

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Query to check all indexes created
-- SELECT
--     TABLE_NAME,
--     INDEX_NAME,
--     COLUMN_NAME,
--     SEQ_IN_INDEX
-- FROM INFORMATION_SCHEMA.STATISTICS
-- WHERE TABLE_SCHEMA = DATABASE()
-- ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- ============================================================
-- ROLLBACK SCRIPT
-- ============================================================
-- Uncomment to rollback this migration:

/*
DROP INDEX IF EXISTS idx_products_status ON products;
DROP INDEX IF EXISTS idx_products_store ON products;
DROP INDEX IF EXISTS idx_products_name ON products;
DROP INDEX IF EXISTS idx_products_released_date ON products;
DROP INDEX IF EXISTS idx_products_updated_date ON products;
DROP INDEX IF EXISTS idx_products_status_store ON products;
DROP INDEX IF EXISTS idx_products_status_name ON products;
DROP INDEX IF EXISTS idx_products_prices ON products;
DROP INDEX IF EXISTS idx_product_category_product ON product_category;
DROP INDEX IF EXISTS idx_product_category_category ON product_category;
DROP INDEX IF EXISTS idx_product_category_composite ON product_category;
DROP INDEX IF EXISTS idx_product_tag_product ON product_tag;
DROP INDEX IF EXISTS idx_product_tag_tag ON product_tag;
DROP INDEX IF EXISTS idx_product_tag_composite ON product_tag;
DROP INDEX IF EXISTS idx_product_image_product ON product_image;
DROP INDEX IF EXISTS idx_product_review_rating ON product_review;
DROP INDEX IF EXISTS idx_order_details_product ON order_details;
DROP INDEX IF EXISTS idx_order_details_review ON order_details;
DROP INDEX IF EXISTS idx_order_details_product_review ON order_details;
DROP INDEX IF EXISTS idx_stores_user ON stores;
DROP INDEX IF EXISTS idx_stores_name ON stores;
DROP INDEX IF EXISTS idx_category_product_name ON category_product;
DROP INDEX IF EXISTS idx_tag_product_name ON tag_product;
DROP INDEX IF EXISTS idx_blog_status ON blog;
DROP INDEX IF EXISTS idx_blog_created_date ON blog;
DROP INDEX IF EXISTS idx_blog_author ON blog;
DROP INDEX IF EXISTS idx_blog_category_blog ON blog_category;
DROP INDEX IF EXISTS idx_blog_category_category ON blog_category;
DROP INDEX IF EXISTS idx_blog_tag_blog ON blog_tag;
DROP INDEX IF EXISTS idx_blog_tag_tag ON blog_tag;
DROP INDEX IF EXISTS idx_blog_comments_blog ON blog_comments;
DROP INDEX IF EXISTS idx_blog_comments_user ON blog_comments;
DROP INDEX IF EXISTS idx_blog_comments_created ON blog_comments;
DROP INDEX IF EXISTS idx_users_email ON users;
DROP INDEX IF EXISTS idx_users_username ON users;
DROP INDEX IF EXISTS idx_users_role ON users;
DROP INDEX IF EXISTS idx_transactions_user ON transactions;
DROP INDEX IF EXISTS idx_transactions_status ON transactions;
DROP INDEX IF EXISTS idx_transactions_date ON transactions;
DROP INDEX IF EXISTS idx_transactions_user_status ON transactions;
DROP INDEX IF EXISTS idx_carts_user ON carts;
DROP INDEX IF EXISTS idx_carts_product ON carts;
DROP INDEX IF EXISTS idx_carts_user_product ON carts;
DROP INDEX IF EXISTS idx_wishlist_user ON wishlist;
DROP INDEX IF EXISTS idx_wishlist_product ON wishlist;
DROP INDEX IF EXISTS idx_wishlist_user_product ON wishlist;
DROP INDEX IF EXISTS idx_address_user ON address;
DROP INDEX IF EXISTS idx_subscribe_email ON subscribe;
*/
