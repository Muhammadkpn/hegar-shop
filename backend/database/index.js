const mysql = require('mysql');

// Create connection pool for better performance
const pool = mysql.createPool({
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    queueLimit: 0,
    // Connection pool optimization
    acquireTimeout: 10000,
    timeout: 60000,
    // Prevent connection issues
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('MySQL pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});

// Add escape method for backward compatibility
pool.escape = mysql.escape;

// Add query wrapper with promise support
pool.queryPromise = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = pool;
