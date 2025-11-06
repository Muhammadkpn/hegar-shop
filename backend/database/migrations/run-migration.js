const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const database = require('../index');

async function runMigration(filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, filename);

        console.log(`\n📄 Reading migration file: ${filename}`);

        if (!fs.existsSync(filePath)) {
            return reject(new Error(`Migration file not found: ${filePath}`));
        }

        const sql = fs.readFileSync(filePath, 'utf8');

        // Split by semicolon but ignore comments and empty statements
        const statements = sql
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => {
                // Remove comments and empty lines
                return statement.length > 0 &&
                    !statement.startsWith('--') &&
                    !statement.startsWith('/*') &&
                    statement !== '';
            });

        console.log(`📊 Found ${statements.length} SQL statements to execute`);

        let completed = 0;
        let errors = 0;

        // Execute statements sequentially
        const executeNext = (index) => {
            if (index >= statements.length) {
                console.log(`\n✅ Migration completed!`);
                console.log(`   Successful: ${completed}`);
                console.log(`   Errors: ${errors}`);
                return resolve({ completed, errors });
            }

            const statement = statements[index];

            // Extract index name for better logging
            let indexName = 'unknown';
            const match = statement.match(/idx_\w+/);
            if (match) {
                indexName = match[0];
            }

            database.query(statement + ';', (err) => {
                if (err) {
                    // Check if error is "duplicate key" which we can ignore
                    if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                        console.log(`   ⚠️  Index ${indexName} already exists, skipping...`);
                    } else {
                        console.error(`   ❌ Error executing statement: ${err.message}`);
                        errors++;
                    }
                } else {
                    console.log(`   ✓ Created index: ${indexName}`);
                    completed++;
                }

                // Execute next statement
                executeNext(index + 1);
            });
        };

        // Start execution
        executeNext(0);
    });
}

async function verifyIndexes() {
    return new Promise((resolve, reject) => {
        const verificationQuery = `
            SELECT
                TABLE_NAME,
                INDEX_NAME,
                COUNT(*) as index_count
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = DATABASE()
            AND INDEX_NAME LIKE 'idx_%'
            GROUP BY TABLE_NAME, INDEX_NAME
            ORDER BY TABLE_NAME;
        `;

        database.query(verificationQuery, (err, results) => {
            if (err) {
                return reject(err);
            }

            console.log(`\n📊 Index Verification:`);
            console.log(`   Total indexes created: ${results.length}`);

            // Group by table
            const byTable = {};
            results.forEach(row => {
                if (!byTable[row.TABLE_NAME]) {
                    byTable[row.TABLE_NAME] = [];
                }
                byTable[row.TABLE_NAME].push(row.INDEX_NAME);
            });

            Object.keys(byTable).forEach(table => {
                console.log(`\n   ${table}: ${byTable[table].length} indexes`);
                byTable[table].forEach(index => {
                    console.log(`      - ${index}`);
                });
            });

            resolve(results);
        });
    });
}

async function main() {
    console.log('🚀 Starting Database Migration - Phase 1');
    console.log('==========================================\n');

    try {
        // Test database connection
        await new Promise((resolve, reject) => {
            database.getConnection((err, connection) => {
                if (err) {
                    console.error('❌ Failed to connect to database:', err.message);
                    return reject(err);
                }
                console.log('✅ Database connection successful');
                console.log(`   Connection ID: ${connection.threadId}`);
                connection.release();
                resolve();
            });
        });

        // Run migration
        await runMigration('001_add_performance_indexes.sql');

        // Verify indexes
        await verifyIndexes();

        console.log('\n✅ All migrations completed successfully!');
        console.log('\n💡 Next steps:');
        console.log('   1. Test your API endpoints');
        console.log('   2. Monitor query performance');
        console.log('   3. Use EXPLAIN to verify index usage');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { runMigration, verifyIndexes };
