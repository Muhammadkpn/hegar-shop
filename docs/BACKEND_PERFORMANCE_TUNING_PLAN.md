# Backend Performance Tuning Plan - Hegar Shop

## Executive Summary

Dokumen ini berisi rencana komprehensif untuk melakukan performance tuning pada backend Hegar Shop. Rencana ini dibagi dalam **5 fase** yang terstruktur, dari optimasi quick wins hingga implementasi advanced monitoring dan scaling strategies.

**Tech Stack Saat Ini:**
- Node.js + Express.js
- MySQL Database
- REST API Architecture

**Estimasi Timeline:** 4-6 minggu (tergantung kompleksitas dan resource tim)

---

## Fase 1: Database Connection & Query Optimization (Week 1-2)

### Prioritas: **CRITICAL** ⚠️

### 1.1 Implementasi Connection Pool

**Masalah Saat Ini:**
- Backend menggunakan single MySQL connection (`mysql.createConnection()`)
- Setiap request berpotensi mengalami bottleneck
- Tidak ada connection reuse mechanism

**Solusi:**
```javascript
// Ganti dari createConnection() ke createPool()
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,      // Mulai dengan 10, monitor dan adjust
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    queueLimit: 0
});
```

**Expected Impact:**
- 🚀 Response time improvement: 30-50%
- ✅ Better concurrent request handling
- 📊 Reduced database connection overhead

**Testing:**
- Load test dengan 50 concurrent users
- Monitor connection pool usage
- Verify no connection leaks

---

### 1.2 Optimasi Query dengan Index

**Target Queries:**
File: `backend/controllers/products/products.js`

**Current Issues:**
- Complex subqueries dengan multiple JOINs (lines 18-34)
- GROUP_CONCAT tanpa proper indexing
- LIKE queries tanpa full-text search

**Action Items:**

#### Index yang Perlu Dibuat:

```sql
-- Products table
CREATE INDEX idx_products_status ON products(status_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_released_date ON products(released_date DESC);

-- Product relationships
CREATE INDEX idx_product_category_product ON product_category(product_id);
CREATE INDEX idx_product_category_category ON product_category(category_id);
CREATE INDEX idx_product_tag_product ON product_tag(product_id);
CREATE INDEX idx_product_tag_tag ON product_tag(tag_id);
CREATE INDEX idx_product_image_product ON product_image(product_id);

-- Reviews
CREATE INDEX idx_order_details_product ON order_details(product_id);
CREATE INDEX idx_order_details_review ON order_details(review_id);
CREATE INDEX idx_product_review_rating ON product_review(rating);

-- Composite indexes untuk common queries
CREATE INDEX idx_products_status_store ON products(status_id, store_id);
CREATE INDEX idx_products_status_name ON products(status_id, name);
```

**Expected Impact:**
- 🚀 Query execution time: 50-70% faster
- 📉 Database CPU usage: -40%

---

### 1.3 Query Refactoring & Optimization

**Problem Areas:**

**File:** `backend/controllers/products/products.js:18-34`

**Issues:**
1. Multiple subqueries di SELECT clause
2. GROUP_CONCAT performance overhead
3. Tidak ada LIMIT untuk pagination

**Optimized Approach:**

```javascript
// Split complex query menjadi multiple simpler queries
// Atau gunakan materialized views untuk aggregated data

// Option 1: Split Queries
async function getProductOptimized(productId) {
    // Main product data
    const product = await getProductBase(productId);

    // Parallel fetch related data
    const [images, reviews, categories, tags, sales] = await Promise.all([
        getProductImages(productId),
        getProductReviews(productId),
        getProductCategories(productId),
        getProductTags(productId),
        getProductSales(productId)
    ]);

    return {
        ...product,
        images,
        reviews,
        categories,
        tags,
        sales
    };
}

// Option 2: Materialized View (Recommended)
// Create view untuk frequently accessed aggregated data
```

**SQL Materialized View:**
```sql
CREATE VIEW product_summary AS
SELECT
    p.id,
    p.name,
    p.description,
    p.regular_price,
    p.sale_price,
    p.stock,
    p.status_id,
    p.store_id,
    s.store_name,
    COUNT(DISTINCT pr.id) as total_reviews,
    AVG(pr.rating) as avg_rating,
    SUM(od.qty) as total_sales
FROM products p
LEFT JOIN stores s ON p.store_id = s.user_id
LEFT JOIN order_details od ON p.id = od.product_id
LEFT JOIN product_review pr ON od.review_id = pr.review_id
GROUP BY p.id;
```

---

### 1.4 Implementasi Pagination

**Current Issue:**
- Semua endpoints return ALL data tanpa pagination
- Risk of memory overflow dengan data besar

**Solution:**

```javascript
// Tambahkan pagination helper
function getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

// Apply di semua GET endpoints
async getProduct(req, res) {
    const { page, limit, offset } = getPaginationParams(req);

    // Query with LIMIT and OFFSET
    const query = `SELECT ... LIMIT ${limit} OFFSET ${offset}`;
    const countQuery = `SELECT COUNT(*) as total FROM ...`;

    const [data, countResult] = await Promise.all([
        asyncQuery(query),
        asyncQuery(countQuery)
    ]);

    res.status(200).send({
        status: 'success',
        data: data,
        pagination: {
            page,
            limit,
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / limit)
        }
    });
}
```

**Expected Impact:**
- 📉 Response payload size: -80-95%
- ⚡ Response time: 60-80% faster
- 💾 Memory usage: -70%

---

### 1.5 Fix SQL Injection Vulnerabilities

**Critical Issues:**

**File:** `backend/controllers/products/products.js`
- Lines 40, 42, 44: Direct string concatenation dengan user input
- Lines 165-178: Multiple LIKE queries vulnerable to SQL injection

**Current Code (VULNERABLE):**
```javascript
// ❌ DANGEROUS
getProduct += ` AND name LIKE '%${search}%'`;
```

**Fixed Code:**
```javascript
// ✅ SAFE
getProduct += ` AND name LIKE ?`;
params.push(`%${search}%`);

// Execute dengan parameterized query
const result = await asyncQuery(getProduct, params);
```

**Action:** Refactor semua query untuk menggunakan parameterized queries

---

## Fase 2: Caching Layer Implementation (Week 2-3)

### Prioritas: **HIGH** 🔥

### 2.1 Setup Redis Cache

**Installation:**
```bash
npm install redis@^4.0.0
npm install ioredis  # Alternative, lebih feature-rich
```

**Configuration:**

```javascript
// backend/config/redis.js
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
});

redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('connect', () => console.log('Redis connected'));

module.exports = redis;
```

---

### 2.2 Caching Strategy

#### Cache Keys Naming Convention:
```
product:{id}
products:list:{page}:{limit}:{sort}:{filter}
category:{id}
store:{id}
user:{id}
```

#### TTL (Time To Live) Strategy:
```javascript
const CACHE_TTL = {
    PRODUCT: 300,           // 5 minutes
    PRODUCT_LIST: 180,      // 3 minutes
    CATEGORY: 600,          // 10 minutes
    STORE: 300,             // 5 minutes
    USER_PROFILE: 600,      // 10 minutes
    CART: 60,               // 1 minute
    STATIC_DATA: 3600       // 1 hour
};
```

---

### 2.3 Cache Middleware Implementation

```javascript
// backend/middleware/cache.js
const redis = require('../config/redis');

const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        // Generate cache key dari URL + query params
        const key = `cache:${req.originalUrl || req.url}`;

        try {
            // Check cache
            const cachedData = await redis.get(key);

            if (cachedData) {
                console.log('Cache HIT:', key);
                return res.status(200).send(JSON.parse(cachedData));
            }

            console.log('Cache MISS:', key);

            // Intercept res.send untuk save ke cache
            const originalSend = res.send;
            res.send = function(data) {
                // Save to cache
                redis.setex(key, duration, JSON.stringify(data))
                    .catch(err => console.error('Cache save error:', err));

                originalSend.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next(); // Continue without cache
        }
    };
};

module.exports = cacheMiddleware;
```

**Usage:**
```javascript
// Apply cache middleware
const cache = require('./middleware/cache');

app.get('/api/products',
    cache(300),  // 5 minutes cache
    productController.getProduct
);

app.get('/api/products/:id',
    cache(600),  // 10 minutes cache
    productController.getProductDetails
);
```

---

### 2.4 Cache Invalidation Strategy

```javascript
// backend/helpers/cacheInvalidation.js
const redis = require('../config/redis');

async function invalidateProductCache(productId) {
    const patterns = [
        `cache:*/products*`,           // Product list caches
        `cache:*/products/${productId}*`, // Specific product cache
        `product:${productId}`,
    ];

    for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}

// Use in update/delete operations
async function editProduct(req, res) {
    // ... update logic ...

    await invalidateProductCache(req.params.id);

    res.status(200).send({...});
}
```

---

### 2.5 Query Result Caching

```javascript
// backend/helpers/queryCache.js
const redis = require('../config/redis');
const { asyncQuery } = require('./queryHelper');

async function cachedQuery(query, params = [], ttl = 300) {
    // Generate cache key from query
    const cacheKey = `query:${Buffer.from(query).toString('base64')}:${JSON.stringify(params)}`;

    try {
        // Check cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // Execute query
        const result = await asyncQuery(query, params);

        // Cache result
        await redis.setex(cacheKey, ttl, JSON.stringify(result));

        return result;
    } catch (error) {
        console.error('Cached query error:', error);
        // Fallback to direct query
        return asyncQuery(query, params);
    }
}

module.exports = { cachedQuery };
```

**Expected Impact:**
- 🚀 Response time: 70-90% faster untuk cached requests
- 📉 Database load: -60-80%
- 💰 Cost reduction untuk database resources

---

## Fase 3: API Optimization & Best Practices (Week 3-4)

### Prioritas: **MEDIUM-HIGH** 📊

### 3.1 Response Compression

**Implementation:**

```javascript
// backend/index.js
const compression = require('compression');

// Add after express.json()
app.use(compression({
    level: 6,  // Compression level (0-9)
    threshold: 1024,  // Only compress responses > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
```

**Expected Impact:**
- 📉 Response size: -60-80%
- ⚡ Transfer time: -50-70%

---

### 3.2 Rate Limiting

**Installation:**
```bash
npm install express-rate-limit
npm install rate-limit-redis  # For distributed rate limiting
```

**Implementation:**

```javascript
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

// General API rate limiter
const apiLimiter = rateLimit({
    store: new RedisStore({
        client: redis,
        prefix: 'rl:api:',
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter untuk auth endpoints
const authLimiter = rateLimit({
    store: new RedisStore({
        client: redis,
        prefix: 'rl:auth:',
    }),
    windowMs: 15 * 60 * 1000,
    max: 5, // Only 5 login attempts per 15 minutes
    skipSuccessfulRequests: true,
});

module.exports = { apiLimiter, authLimiter };
```

**Usage:**
```javascript
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Apply globally
app.use('/api/', apiLimiter);

// Apply to specific routes
app.post('/api/users/login', authLimiter, userController.login);
```

---

### 3.3 Request Validation & Sanitization

**Current Issue:**
- Minimal input validation
- No sanitization untuk prevent XSS

**Enhanced Validation:**

```javascript
// backend/middleware/validation.js
const { body, query, param, validationResult } = require('express-validator');

// Product validation rules
const productValidation = {
    create: [
        body('name').trim().notEmpty().isLength({ max: 255 }),
        body('description').trim().notEmpty(),
        body('regularPrice').isFloat({ min: 0 }),
        body('salePrice').isFloat({ min: 0 }),
        body('stock').isInt({ min: 0 }),
        body('weight').isFloat({ min: 0 }),
    ],

    list: [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('search').optional().trim().escape(),
        query('category').optional().trim().escape(),
    ],

    params: [
        param('id').isInt({ min: 1 }),
    ]
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    }
    next();
};

module.exports = { productValidation, handleValidationErrors };
```

---

### 3.4 Response Standardization

**Create Response Helper:**

```javascript
// backend/helpers/response.js
class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message, statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            status: 'error',
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            status: 'success',
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ApiResponse;
```

**Usage:**
```javascript
const ApiResponse = require('../helpers/response');

// In controllers
return ApiResponse.success(res, products, 'Products retrieved successfully');
return ApiResponse.error(res, 'Product not found', 404);
return ApiResponse.paginated(res, products, pagination);
```

---

### 3.5 Error Handling Middleware

```javascript
// backend/middleware/errorHandler.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production mode - don't leak error details
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Programming or unknown error
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};

module.exports = { AppError, errorHandler };
```

---

### 3.6 Async Error Handling

```javascript
// backend/helpers/asyncHandler.js
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
```

**Usage:**
```javascript
const asyncHandler = require('../helpers/asyncHandler');

// Wrap async controllers
module.exports = {
    getProduct: asyncHandler(async (req, res) => {
        // No need for try-catch
        const products = await ProductService.getAll();
        return ApiResponse.success(res, products);
    }),
};
```

---

## Fase 4: Performance Monitoring & Optimization (Week 4-5)

### Prioritas: **MEDIUM** 📈

### 4.1 Setup Application Performance Monitoring (APM)

**Option 1: PM2 (Recommended untuk start)**

```bash
npm install pm2 -g
```

**pm2.config.js:**
```javascript
module.exports = {
    apps: [{
        name: 'hegar-shop-api',
        script: './index.js',
        instances: 'max',  // Use all CPU cores
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        max_memory_restart: '500M',

        // Auto restart on high memory
        autorestart: true,
        watch: false,

        // Performance optimizations
        node_args: '--max-old-space-size=2048',
    }]
};
```

**Start dengan PM2:**
```bash
pm2 start pm2.config.js
pm2 monit  # Real-time monitoring
pm2 logs   # View logs
```

---

**Option 2: New Relic / DataDog (Production Grade)**

```bash
npm install newrelic
# atau
npm install dd-trace
```

**Configuration:**
```javascript
// newrelic.js
exports.config = {
    app_name: ['Hegar Shop API'],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
        level: 'info'
    },
    transaction_tracer: {
        enabled: true,
        transaction_threshold: 'apdex_f',
        record_sql: 'obfuscated',
    },
    slow_sql: {
        enabled: true,
        max_samples: 10
    }
};

// At top of index.js
require('newrelic');
```

---

### 4.2 Custom Metrics & Logging

**Setup Winston Logger:**

```bash
npm install winston winston-daily-rotate-file
```

**Configuration:**

```javascript
// backend/config/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'hegar-shop-api' },
    transports: [
        // Error logs
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            maxSize: '20m',
        }),

        // Combined logs
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
            maxSize: '20m',
        }),

        // Performance logs
        new DailyRotateFile({
            filename: 'logs/performance-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '7d',
            maxSize: '20m',
        }),
    ],
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
```

---

### 4.3 Request Timing Middleware

```javascript
// backend/middleware/requestTimer.js
const logger = require('../config/logger');

const requestTimer = (req, res, next) => {
    const start = Date.now();

    // Log request
    logger.info('Incoming request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    // Capture response
    res.on('finish', () => {
        const duration = Date.now() - start;

        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        };

        // Log slow requests
        if (duration > 1000) {
            logger.warn('Slow request detected', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
};

module.exports = requestTimer;
```

**Apply globally:**
```javascript
app.use(requestTimer);
```

---

### 4.4 Database Query Performance Monitoring

```javascript
// backend/helpers/queryHelper.js - Enhanced
const logger = require('../config/logger');

async function asyncQuery(query, params = []) {
    const start = Date.now();

    try {
        const result = await new Promise((resolve, reject) => {
            database.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const duration = Date.now() - start;

        // Log slow queries
        if (duration > 500) {
            logger.warn('Slow query detected', {
                query: query.substring(0, 100) + '...',
                duration: `${duration}ms`,
                rowCount: result.length,
            });
        }

        return result;
    } catch (error) {
        logger.error('Query error', {
            error: error.message,
            query: query.substring(0, 100) + '...',
        });
        throw error;
    }
}
```

---

### 4.5 Health Check Endpoint

```javascript
// backend/routes/health.js
const express = require('express');
const router = express.Router();
const database = require('../database');
const redis = require('../config/redis');

router.get('/health', async (req, res) => {
    const health = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        status: 'OK',
        checks: {
            database: 'Unknown',
            redis: 'Unknown',
            memory: process.memoryUsage(),
        }
    };

    // Check database
    try {
        await new Promise((resolve, reject) => {
            database.ping((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        health.checks.database = 'OK';
    } catch (error) {
        health.checks.database = 'Error';
        health.status = 'Degraded';
    }

    // Check Redis
    try {
        await redis.ping();
        health.checks.redis = 'OK';
    } catch (error) {
        health.checks.redis = 'Error';
        health.status = 'Degraded';
    }

    const statusCode = health.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(health);
});

router.get('/health/ready', async (req, res) => {
    // Readiness check - is app ready to serve traffic?
    res.status(200).json({ status: 'Ready' });
});

router.get('/health/live', (req, res) => {
    // Liveness check - is app alive?
    res.status(200).json({ status: 'Live' });
});

module.exports = router;
```

---

### 4.6 Performance Metrics Dashboard

**Setup Prometheus + Grafana (Optional but Recommended)**

```bash
npm install prom-client
```

```javascript
// backend/config/metrics.js
const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const httpRequestTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const databaseQueryDuration = new client.Histogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    registers: [register]
});

module.exports = {
    register,
    httpRequestDuration,
    httpRequestTotal,
    databaseQueryDuration
};
```

**Expose metrics endpoint:**
```javascript
const { register } = require('./config/metrics');

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
```

---

## Fase 5: Advanced Optimization & Scaling (Week 5-6)

### Prioritas: **LOW-MEDIUM** 🚀

### 5.1 Database Read Replicas

**Architecture:**
```
┌─────────────┐
│  App Server │
└──────┬──────┘
       │
       ├─── WRITE ──→ [Master DB]
       │                  │
       │                  │ Replication
       │                  ↓
       └─── READ ──→ [Replica DB 1]
                     [Replica DB 2]
```

**Implementation:**

```javascript
// backend/database/index.js
const mysql = require('mysql');

// Master pool for writes
const masterPool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_MASTER_HOST,
    // ... other configs
});

// Read replica pool
const replicaPool = mysql.createPool({
    connectionLimit: 20,  // More connections for reads
    host: process.env.DB_REPLICA_HOST,
    // ... other configs
});

// Smart query router
function query(sql, params, options = {}) {
    const isWrite = /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sql.trim());
    const pool = (options.useMaster || isWrite) ? masterPool : replicaPool;

    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

module.exports = { query, masterPool, replicaPool };
```

---

### 5.2 Implement CDN untuk Static Assets

**Setup:**

1. **Use S3 + CloudFront (AWS)**
2. **Or Cloudinary untuk images**

```javascript
// Upload to CDN instead of local storage
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(file) {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    });

    return result.secure_url;
}
```

---

### 5.3 Implement Message Queue untuk Async Tasks

**Use Cases:**
- Email notifications
- Image processing
- Report generation
- Analytics updates

**Setup Bull Queue:**

```bash
npm install bull
```

```javascript
// backend/queues/emailQueue.js
const Queue = require('bull');
const redis = require('../config/redis');

const emailQueue = new Queue('email', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

// Process jobs
emailQueue.process(async (job) => {
    const { to, subject, body } = job.data;

    // Send email logic
    await sendEmail(to, subject, body);

    return { sent: true };
});

// Add job
async function sendWelcomeEmail(userEmail) {
    await emailQueue.add({
        to: userEmail,
        subject: 'Welcome to Hegar Shop',
        body: '...'
    }, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    });
}

module.exports = { emailQueue, sendWelcomeEmail };
```

---

### 5.4 API Versioning

```javascript
// backend/index.js
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Redirect /api/* to latest version
app.use('/api', v2Router);
```

---

### 5.5 GraphQL Layer (Optional)

**For complex data fetching patterns:**

```bash
npm install apollo-server-express graphql
```

**Benefits:**
- Reduce over-fetching
- Single endpoint untuk complex queries
- Better frontend performance

---

### 5.6 Horizontal Scaling with Load Balancer

**Architecture:**
```
        [Load Balancer]
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Server 1][Server 2][Server 3]
    │         │         │
    └────┬────┴────┬────┘
         │         │
    [Redis]   [MySQL]
```

**Nginx Configuration:**

```nginx
upstream api_backend {
    least_conn;  # Load balancing method

    server 127.0.0.1:3001 weight=3;
    server 127.0.0.1:3002 weight=2;
    server 127.0.0.1:3003 weight=1;
}

server {
    listen 80;
    server_name api.hegarshop.com;

    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## Testing & Validation

### Load Testing dengan Artillery

```bash
npm install -g artillery
```

**artillery.yml:**
```yaml
config:
  target: 'http://localhost:2000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"

scenarios:
  - name: "Get products"
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/products/{{ $randomNumber(1, 100) }}"
```

**Run:**
```bash
artillery run artillery.yml
```

---

### Performance Benchmarks

**Before Optimization:**
- Response Time (P95): ~800ms
- Throughput: ~50 req/s
- Database Queries: 10-15 per request
- Memory Usage: 150MB

**Target After All Phases:**
- Response Time (P95): <200ms ⚡
- Throughput: >300 req/s 🚀
- Database Queries: 2-3 per request (with cache)
- Memory Usage: <100MB 💾

---

## Monitoring Checklist

### Daily Monitoring:
- [ ] Response times (P50, P95, P99)
- [ ] Error rates
- [ ] Cache hit ratio
- [ ] Database connection pool usage
- [ ] Memory usage
- [ ] CPU usage

### Weekly Review:
- [ ] Slow query analysis
- [ ] Cache effectiveness
- [ ] API endpoint performance
- [ ] Error log review
- [ ] Disk usage

### Monthly Optimization:
- [ ] Database index analysis
- [ ] Query optimization review
- [ ] Cache strategy adjustment
- [ ] Load test validation
- [ ] Cost optimization

---

## Cost Estimation

### Infrastructure Needs:

**Minimal Setup (Phase 1-3):**
- Redis Instance: $10-20/month
- Database optimization: $0 (same DB)
- Monitoring tools: $0 (using free tier)
- **Total: ~$20/month**

**Production Setup (All Phases):**
- Redis Cluster: $50-100/month
- DB Read Replica: $50/month
- CDN: $20-50/month (based on traffic)
- APM Tool: $0-100/month
- Load Balancer: $20/month
- **Total: ~$140-320/month**

---

## Success Metrics

### Phase 1 Success Criteria:
✅ Database connection pool implemented
✅ All indexes created
✅ Query execution time reduced by 50%
✅ Pagination implemented on all list endpoints
✅ SQL injection vulnerabilities fixed

### Phase 2 Success Criteria:
✅ Redis cache operational
✅ Cache hit ratio > 60%
✅ Response time reduced by 70% for cached requests
✅ Cache invalidation working correctly

### Phase 3 Success Criteria:
✅ Response compression active
✅ Rate limiting implemented
✅ All inputs validated
✅ Error handling standardized

### Phase 4 Success Criteria:
✅ APM tool running
✅ Logging system operational
✅ Slow queries identified and logged
✅ Health check endpoints working
✅ Metrics dashboard available

### Phase 5 Success Criteria:
✅ System handles 3x current load
✅ Horizontal scaling tested
✅ Async jobs processed via queue
✅ CDN serving static assets

---

## Rollback Plan

Setiap fase harus memiliki rollback strategy:

1. **Git branching strategy**:
   - Feature branch untuk setiap fase
   - Merge hanya setelah testing complete

2. **Database migrations**:
   - Reversible migrations
   - Backup sebelum index creation

3. **Configuration**:
   - Environment variables untuk toggle features
   - Feature flags untuk gradual rollout

4. **Monitoring**:
   - Alert jika error rate meningkat
   - Auto-rollback pada critical failures

---

## Timeline Summary

| Phase | Duration | Priority | Complexity |
|-------|----------|----------|------------|
| Phase 1: DB Optimization | 1-2 weeks | CRITICAL | Medium |
| Phase 2: Caching | 1 week | HIGH | Medium |
| Phase 3: API Best Practices | 1 week | MEDIUM-HIGH | Low |
| Phase 4: Monitoring | 1 week | MEDIUM | Medium |
| Phase 5: Advanced Scaling | 1-2 weeks | LOW-MEDIUM | High |

**Total: 4-6 weeks**

---

## Next Steps

1. **Review & Approval**: Team review dokumen ini
2. **Environment Setup**: Prepare dev/staging/prod environments
3. **Kickoff Phase 1**: Start dengan database optimization
4. **Continuous Testing**: Test setiap perubahan
5. **Documentation**: Update API docs dengan setiap fase
6. **Training**: Train team pada new tools dan practices

---

## Appendix

### A. Useful Commands

```bash
# Monitor MySQL queries
mysqldumpslow -s t -t 10 /var/log/mysql/slow-query.log

# Monitor Redis
redis-cli --stat
redis-cli INFO stats

# PM2 monitoring
pm2 monit
pm2 list

# Check memory
free -h
top -o %MEM

# Network monitoring
netstat -an | grep :2000
```

### B. References

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Express.js Performance Tips](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-06
**Author:** Performance Engineering Team
**Status:** Draft for Review
