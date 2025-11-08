const { StoreService } = require('../../services/transactions');

const storeService = new StoreService();

/**
 * Store Controller - Clean Architecture
 * Manages store sales analytics and reports
 */

module.exports = {
  /**
   * Get sales summary for all stores or specific store
   */
  getSalesSummary: async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
      const data = await storeService.getSalesSummary(id, type);

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data,
      });
    } catch (error) {
      console.error('getSalesSummary error:', error);
      res.status(500).send({
        status: 'fail',
        code: 500,
        message: error.message,
      });
    }
  },

  /**
   * Get sales charts data with filters
   */
  getSalesCharts: async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, orderStatusId } = req.query;

    try {
      const data = await storeService.getSalesCharts({
        storeId: id,
        startDate,
        endDate,
        orderStatusId,
      });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data,
      });
    } catch (error) {
      console.error('getSalesCharts error:', error);
      const statusCode = error.message === 'User not found' ? 422 : 500;
      res.status(statusCode).send({
        status: 'fail',
        code: statusCode,
        message: error.message,
      });
    }
  },

  /**
   * Get earnings for a store
   */
  getEarnings: async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, type } = req.query;

    try {
      const data = await storeService.getEarnings(id, { startDate, endDate, type });

      res.status(200).send({
        status: 'success',
        message: 'Your request has been successfully',
        data,
      });
    } catch (error) {
      console.error('getEarnings error:', error);
      const statusCode = error.message === 'User not found' ? 422 : 500;
      res.status(statusCode).send({
        status: 'success',
        code: statusCode,
        message: error.message,
      });
    }
  },
};
