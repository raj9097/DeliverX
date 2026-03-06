const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/monthly', statController.getMonthlyStats);
router.get('/revenue', statController.getRevenueStats);
router.get('/status-distribution', statController.getStatusDistribution);
router.get('/summary', statController.getSummaryStats);

module.exports = router;
