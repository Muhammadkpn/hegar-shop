/**
 * Pagination Helper
 * Provides utilities for implementing pagination in API endpoints
 */

/**
 * Get pagination parameters from request query
 * @param {Object} req - Express request object
 * @param {Object} options - Configuration options
 * @returns {Object} Pagination parameters
 */
function getPaginationParams(req, options = {}) {
    const {
        defaultPage = 1,
        defaultLimit = 20,
        maxLimit = 100,
    } = options;

    // Parse and validate page number
    let page = parseInt(req.query.page) || defaultPage;
    if (page < 1) page = 1;

    // Parse and validate limit
    let limit = parseInt(req.query.limit) || defaultLimit;
    if (limit < 1) limit = defaultLimit;
    if (limit > maxLimit) limit = maxLimit;

    // Calculate offset
    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset,
    };
}

/**
 * Build pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
function buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);

    return {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
    };
}

/**
 * Create paginated response
 * @param {Array} data - Array of data items
 * @param {number} total - Total number of records
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 * @returns {Object} Formatted response object
 */
function createPaginatedResponse(data, total, page, limit, message = 'Success') {
    return {
        status: 'success',
        message,
        data,
        pagination: buildPaginationMeta(total, page, limit),
    };
}

/**
 * Build SQL LIMIT clause
 * @param {number} limit - Items per page
 * @param {number} offset - Offset for query
 * @returns {string} SQL LIMIT clause
 */
function buildLimitClause(limit, offset) {
    return `LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
}

/**
 * Build SQL ORDER BY clause from query params
 * @param {Object} query - Query parameters
 * @param {Array} allowedFields - Array of allowed sort fields
 * @param {string} defaultSort - Default sort field
 * @returns {string} SQL ORDER BY clause
 */
function buildSortClause(query, allowedFields = [], defaultSort = 'id') {
    const { _sort, _order } = query;

    // If no sort specified, use default
    if (!_sort) {
        return `ORDER BY ${defaultSort} DESC`;
    }

    // Check if sort field is allowed
    if (allowedFields.length > 0 && !allowedFields.includes(_sort)) {
        return `ORDER BY ${defaultSort} DESC`;
    }

    // Validate order (ASC or DESC)
    const order = _order && _order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return `ORDER BY ${_sort} ${order}`;
}

/**
 * Parse and validate sort parameters
 * @param {Object} query - Query parameters
 * @param {Object} options - Configuration options
 * @returns {Object} Validated sort parameters
 */
function getSortParams(query, options = {}) {
    const {
        defaultField = 'id',
        defaultOrder = 'DESC',
        allowedFields = [],
    } = options;

    let sortField = query._sort || defaultField;
    let sortOrder = (query._order || defaultOrder).toUpperCase();

    // Validate sort field
    if (allowedFields.length > 0 && !allowedFields.includes(sortField)) {
        sortField = defaultField;
    }

    // Validate sort order
    if (!['ASC', 'DESC'].includes(sortOrder)) {
        sortOrder = defaultOrder;
    }

    return {
        field: sortField,
        order: sortOrder,
    };
}

/**
 * Build complete query with pagination and sorting
 * @param {string} baseQuery - Base SQL query
 * @param {Object} params - Query parameters
 * @param {Object} options - Configuration options
 * @returns {Object} Query and parameters
 */
function buildPaginatedQuery(baseQuery, params, options = {}) {
    const {
        allowedSortFields = [],
        defaultSort = 'id',
    } = options;

    // Get pagination params
    const { limit, offset } = getPaginationParams({ query: params }, {
        defaultLimit: options.defaultLimit,
        maxLimit: options.maxLimit,
    });

    // Get sort clause
    const sortClause = buildSortClause(params, allowedSortFields, defaultSort);

    // Build final query
    const query = `${baseQuery} ${sortClause} ${buildLimitClause(limit, offset)}`;

    return {
        query,
        limit,
        offset,
    };
}

/**
 * Execute paginated query with count
 * @param {Function} queryFn - Async query function
 * @param {string} dataQuery - Data query SQL
 * @param {string} countQuery - Count query SQL
 * @param {Array} params - Query parameters
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Data and pagination info
 */
async function executePaginatedQuery(queryFn, dataQuery, countQuery, params, page, limit) {
    // Execute both queries in parallel
    const [data, countResult] = await Promise.all([
        queryFn(dataQuery, params),
        queryFn(countQuery, params),
    ]);

    const total = countResult[0]?.total || countResult[0]?.count || 0;

    return {
        data,
        total,
        pagination: buildPaginationMeta(total, page, limit),
    };
}

module.exports = {
    getPaginationParams,
    buildPaginationMeta,
    createPaginatedResponse,
    buildLimitClause,
    buildSortClause,
    getSortParams,
    buildPaginatedQuery,
    executePaginatedQuery,
};
