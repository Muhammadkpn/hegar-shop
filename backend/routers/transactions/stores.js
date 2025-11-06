const router = require('express').Router();

// import controller
const { storeController } = require('../../controllers');

// route
router.get('/sales-summary/:id', storeController.getSalesSummary);
router.get('/sales-charts/:id', storeController.getSalesCharts);
router.get('/sales-earnings/:id', storeController.getEarnings);

module.exports = router;
