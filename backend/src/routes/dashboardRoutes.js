const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', dashboardController.getDashboardData);
router.get('/history', dashboardController.getConsumptionHistory);
router.post('/verify-bill', dashboardController.verifyBill);

module.exports = router;