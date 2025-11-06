const { asyncQuery, generateUpdateQuery, today } = require('../../helpers/queryHelper');

/**
 * Email Subscribe Controller - Optimized
 * Phase 1: Fixed SQL injection vulnerabilities
 */

module.exports = {
    /**
     * Get all email subscribers
     */
    getEmailSubscribe: async (req, res) => {
        try {
            const query = 'SELECT * FROM email_subscribe ORDER BY subscribe_date DESC';
            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Subscribers retrieved successfully',
                data: result,
            });
        } catch (error) {
            console.error('getEmailSubscribe error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Add email subscriber
     * FIXED: SQL injection vulnerability
     */
    addEmailSubscribe: async (req, res) => {
        const { email, notes } = req.body;

        try {
            // Check if email already exists
            const checkQuery = 'SELECT * FROM email_subscribe WHERE email = ?';
            const existing = await asyncQuery(checkQuery, [email]);

            if (existing.length > 0) {
                return res.status(409).send({
                    status: 'fail',
                    code: 409,
                    message: 'Email is already subscribed',
                });
            }

            // Add to database
            const insertQuery = 'INSERT INTO email_subscribe (email, subscribe_date, notes) VALUES (?, ?, ?)';
            await asyncQuery(insertQuery, [email, today, notes || null]);

            res.status(201).send({
                status: 'success',
                message: 'Thank you for subscribing!',
            });
        } catch (error) {
            console.error('addEmailSubscribe error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Update email subscriber
     * FIXED: SQL injection vulnerability
     */
    editEmailSubscribe: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if exists
            const checkQuery = 'SELECT * FROM email_subscribe WHERE id = ?';
            const existing = await asyncQuery(checkQuery, [id]);

            if (existing.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Subscriber not found',
                });
            }

            // Update
            const { setClause, values } = generateUpdateQuery(req.body);
            const updateQuery = `UPDATE email_subscribe SET ${setClause} WHERE id = ?`;
            await asyncQuery(updateQuery, [...values, id]);

            res.status(200).send({
                status: 'success',
                message: 'Subscriber updated successfully',
            });
        } catch (error) {
            console.error('editEmailSubscribe error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },

    /**
     * Delete email subscriber
     * FIXED: SQL injection vulnerability
     */
    deleteEmailSubscribe: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if exists
            const checkQuery = 'SELECT * FROM email_subscribe WHERE id = ?';
            const existing = await asyncQuery(checkQuery, [id]);

            if (existing.length === 0) {
                return res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Subscriber not found',
                });
            }

            // Delete
            const deleteQuery = 'DELETE FROM email_subscribe WHERE id = ?';
            await asyncQuery(deleteQuery, [id]);

            res.status(200).send({
                status: 'success',
                message: 'Subscriber removed successfully',
            });
        } catch (error) {
            console.error('deleteEmailSubscribe error:', error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
