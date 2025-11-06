# Database Migrations

## Overview

This directory contains database migration files for the Hegar Shop backend.

## Running Migrations

### Method 1: Using MySQL CLI

```bash
mysql -u your_username -p your_database < backend/database/migrations/001_add_performance_indexes.sql
```

### Method 2: Using MySQL Workbench or phpMyAdmin

1. Open your MySQL client
2. Select your database
3. Copy and paste the content of the migration file
4. Execute the SQL

### Method 3: Using Node.js Script

Run the migration script:

```bash
cd backend
node database/migrations/run-migration.js
```

## Migration Files

### 001_add_performance_indexes.sql

**Purpose**: Add indexes to improve query performance
**Phase**: 1 - Database Optimization
**Date**: 2025-11-06

**What it does**:
- Adds indexes to products table for faster filtering and sorting
- Adds indexes to relationship tables (product_category, product_tag, etc.)
- Adds indexes to blog tables
- Adds indexes to user and transaction tables
- Adds indexes to cart and wishlist tables

**Expected Impact**:
- Query execution time: 50-70% faster
- Database CPU usage: -40%
- Better performance on JOINs and WHERE clauses

**Tables affected**:
- products
- product_category
- product_tag
- product_image
- product_review
- order_details
- stores
- category_product
- tag_product
- blog
- blog_category
- blog_tag
- blog_comments
- users
- transactions
- carts
- wishlist
- address
- subscribe

## Verification

After running the migration, verify indexes were created:

```sql
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('products', 'product_category', 'product_tag')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

## Rollback

If you need to rollback this migration, uncomment and run the rollback section at the bottom of the migration file.

## Best Practices

1. **Backup First**: Always backup your database before running migrations
2. **Test in Development**: Test migrations in development environment first
3. **Monitor Performance**: Monitor query performance after applying indexes
4. **Check Index Usage**: Use `EXPLAIN` to verify indexes are being used

## Checking Index Usage

Use `EXPLAIN` to see if your queries are using the indexes:

```sql
EXPLAIN SELECT * FROM products WHERE status_id = 1;
```

Look for `type: ref` or `type: range` in the output, indicating index usage.
