const { SubscribeService } = require('../../services/users');
const { asyncQuery, generateUpdateQuery } = require('../../helpers/queryHelper');

const subscribeService = new SubscribeService();

/**
 * Email Subscribe Controller - Clean Architecture
 * Manages newsletter subscription operations
 */

module.exports = {
  /**
   * Get all email subscribers
   */
  getEmailSubscribe: async (req, res) => {
    try {
      const result = await subscribeService.getActiveSubscriptions();

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
   */
  addEmailSubscribe: async (req, res) => {
    const { email } = req.body;

    try {
      await subscribeService.subscribe(email);

      res.status(201).send({
        status: 'success',
        message: 'Thank you for subscribing!',
      });
    } catch (error) {
      console.error('addEmailSubscribe error:', error);
      const statusCode = error.message === 'Email already subscribed' ? 409 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message === 'Email already subscribed'
          ? 'Email is already subscribed'
          : error.message,
      });
    }
  },

  /**
   * Update email subscriber
   * Note: No service method yet, keeping with parameterized queries
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
