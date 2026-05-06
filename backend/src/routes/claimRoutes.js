const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { claimValidation } = require('../middleware/validation');

router.use(authMiddleware);

router.post('/', claimValidation, claimController.createClaim);
router.get('/', claimController.getUserClaims);
router.get('/stats', claimController.getClaimStats);
router.get('/:id', claimController.getClaimById);
router.put('/:id/status', adminMiddleware, claimController.updateClaimStatus);

module.exports = router;