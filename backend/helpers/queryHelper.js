const util = require('util');
const database = require('../database');

const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');

// Promisify database.query for async/await support
const queryPromise = util.promisify(database.query).bind(database);

/**
 * Enhanced async query with performance monitoring
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters (optional)
 * @returns {Promise} Query results
 */
async function asyncQuery(sql, params = []) {
    const start = Date.now();

    try {
        const result = await queryPromise(sql, params);
        const duration = Date.now() - start;

        // Log slow queries (> 500ms)
        if (duration > 500) {
            console.warn(`⚠️  Slow query detected (${duration}ms):`, {
                query: sql.substring(0, 100) + '...',
                duration: `${duration}ms`,
                rowCount: Array.isArray(result) ? result.length : 'N/A',
            });
        }

        return result;
    } catch (error) {
        console.error('❌ Query error:', {
            error: error.message,
            code: error.code,
            query: sql.substring(0, 100) + '...',
        });
        throw error;
    }
}

/**
 * Generate UPDATE query SET clause with parameterized values
 * SECURE VERSION - Prevents SQL injection
 * @param {Object} body - Object with fields to update
 * @returns {Object} { setClause, values }
 */
function generateUpdateQuery(body) {
    const fields = Object.keys(body);
    const values = Object.values(body);

    if (fields.length === 0) {
        return { setClause: '', values: [] };
    }

    // Build SET clause with placeholders
    const setClause = fields
        .map(field => `\`${field}\` = ?`)
        .join(', ');

    return {
        setClause,
        values,
    };
}

/**
 * DEPRECATED: Old generateQuery function (kept for backward compatibility)
 * WARNING: This function is vulnerable to SQL injection
 * Use generateUpdateQuery() instead
 * @param {Object} body - Object with fields to update
 * @returns {string} SET clause
 */
function generateQuery(body) {
    console.warn('⚠️  DEPRECATED: generateQuery() is vulnerable to SQL injection. Use generateUpdateQuery() instead.');

    /* eslint guard-for-in: "error" */
    let setQuery = '';
    for (let i = 0; i < Object.keys(body).length; i += 1) {
        const key = Object.keys(body)[i];
        const value = database.escape(Object.values(body)[i]); // Add escaping
        setQuery += `\`${key}\` = ${value},`;
    }
    return setQuery.slice(0, -1);
}

/**
 * Build WHERE clause with parameterized values
 * @param {Object} conditions - Object with field: value pairs
 * @param {string} operator - AND or OR (default: AND)
 * @returns {Object} { whereClause, values }
 */
function buildWhereClause(conditions, operator = 'AND') {
    const fields = Object.keys(conditions);
    const values = Object.values(conditions);

    if (fields.length === 0) {
        return { whereClause: '', values: [] };
    }

    const whereParts = fields.map(field => {
        // Handle different comparison operators
        if (field.includes('__')) {
            const [fieldName, op] = field.split('__');
            switch (op) {
                case 'gt': return `\`${fieldName}\` > ?`;
                case 'gte': return `\`${fieldName}\` >= ?`;
                case 'lt': return `\`${fieldName}\` < ?`;
                case 'lte': return `\`${fieldName}\` <= ?`;
                case 'ne': return `\`${fieldName}\` != ?`;
                case 'like': return `\`${fieldName}\` LIKE ?`;
                default: return `\`${fieldName}\` = ?`;
            }
        }
        return `\`${field}\` = ?`;
    });

    const whereClause = `WHERE ${whereParts.join(` ${operator} `)}`;

    return {
        whereClause,
        values,
    };
}

/**
 * Safe LIKE search query builder
 * @param {string} field - Field name to search
 * @param {string} searchTerm - Search term
 * @param {string} position - 'start', 'end', or 'both' (default: 'both')
 * @returns {Object} { condition, value }
 */
function buildLikeCondition(field, searchTerm, position = 'both') {
    let value;
    switch (position) {
        case 'start':
            value = `${searchTerm}%`;
            break;
        case 'end':
            value = `%${searchTerm}`;
            break;
        case 'both':
        default:
            value = `%${searchTerm}%`;
            break;
    }

    return {
        condition: `\`${field}\` LIKE ?`,
        value,
    };
}

/**
 * Execute query with pagination
 * @param {string} baseQuery - Base SQL query without LIMIT
 * @param {string} countQuery - Count query
 * @param {Array} params - Query parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} { data, total, pagination }
 */
async function paginatedQuery(baseQuery, countQuery, params = [], page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Execute data query and count query in parallel
    const [data, countResult] = await Promise.all([
        asyncQuery(`${baseQuery} LIMIT ? OFFSET ?`, [...params, limit, offset]),
        asyncQuery(countQuery, params),
    ]);

    const total = countResult[0]?.total || countResult[0]?.count || countResult[0]['COUNT(*)'] || 0;
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        total,
        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}

/**
 * Escape table or column name
 * @param {string} identifier - Table or column name
 * @returns {string} Escaped identifier
 */
function escapeIdentifier(identifier) {
    return `\`${identifier.replace(/`/g, '``')}\``;
}

/**
 * Execute transaction
 * @param {Function} callback - Async function that receives connection
 * @returns {Promise} Transaction result
 */
async function executeTransaction(callback) {
    return new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    return reject(err);
                }

                try {
                    const result = await callback(connection);

                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                reject(err);
                            });
                        }
                        connection.release();
                        resolve(result);
                    });
                } catch (error) {
                    connection.rollback(() => {
                        connection.release();
                        reject(error);
                    });
                }
            });
        });
    });
}

/**
 * Convert image path to full URL
 * @param {string} imagePath - Relative image path
 * @param {Object} req - Express request object (optional)
 * @returns {string} Full image URL
 */
function getImageUrl(imagePath, req = null) {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Get base URL from environment or request
    let baseUrl = process.env.SERVER_URL || process.env.API_URL;

    // If no env var, try to construct from request
    if (!baseUrl && req) {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:2000';
        baseUrl = `${protocol}://${host}`;
    }

    // Default to localhost:2000 if nothing else works
    if (!baseUrl) {
        baseUrl = 'http://localhost:2000';
    }

    // Remove leading slash from imagePath if present
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
}

/**
 * Convert array of image paths to full URLs
 * @param {Array} imagePaths - Array of relative image paths
 * @param {Object} req - Express request object (optional)
 * @returns {Array} Array of full image URLs
 */
function getImageUrls(imagePaths, req = null) {
    if (!Array.isArray(imagePaths)) return [];
    return imagePaths.map(path => getImageUrl(path, req));
}

module.exports = {
    // Legacy (backward compatibility)
    asyncQuery,
    generateQuery, // DEPRECATED - use generateUpdateQuery
    today,

    // New secure functions
    generateUpdateQuery,
    buildWhereClause,
    buildLikeCondition,
    paginatedQuery,
    escapeIdentifier,
    executeTransaction,

    // Image URL helpers
    getImageUrl,
    getImageUrls,

    // Utility
    escape: database.escape,
};
