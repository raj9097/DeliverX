const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');

// Get all offices
router.get('/', officeController.getAllOffices);

// Get office by ID
router.get('/:id', officeController.getOfficeById);

// Create new office
router.post('/', officeController.createOffice);

// Update office
router.put('/:id', officeController.updateOffice);

// Delete office
router.delete('/:id', officeController.deleteOffice);

// Get hubs only
router.get('/hubs/list', officeController.getHubs);

// Get branches
router.get('/branches/list', officeController.getBranches);

// Calculate route between offices
router.get('/route/calculate', officeController.calculateRoute);

module.exports = router;

