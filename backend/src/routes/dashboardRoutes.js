const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', dashboardController.getDashboardData);
router.get('/history', dashboardController.getConsumptionHistory);
router.get('/bills', dashboardController.getBillHistory);
router.get('/bills/stats', dashboardController.getBillStats);
router.post('/verify-bill', dashboardController.verifyBill);

module.exports = router;