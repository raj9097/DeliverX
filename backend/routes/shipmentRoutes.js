const express = require('express');
const router = express.Router();
const { 
  createShipment, 
  getAllShipments, 
  getShipment, 
  updateShipment, 
  deleteShipment,
  getClerkStats,
  trackShipment 
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/auth');

// Public route - track shipment
router.get('/track/:trackingId', trackShipment);

// Clerk stats route
router.get('/stats/clerk', protect, getClerkStats);

// Protected routes
router.route('/')
  .post(protect, createShipment)
  .get(protect, getAllShipments);

router.route('/:id')
  .get(protect, getShipment)
  .put(protect, updateShipment)
  .delete(protect, deleteShipment);

module.exports = router;
