const Shipment = require('../models/Shipment');
const catchAsync = require('../middleware/catchAsync');
const { apiSuccess, apiError } = require('../utils/apiResponse');

// Create new shipment
exports.createShipment = catchAsync(async (req, res) => {
  const shipment = await Shipment.create(req.body);
  return apiSuccess(res, shipment, 'Shipment created successfully', 201);
});

// Get all shipments
exports.getAllShipments = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  
  const query = {};
  if (status) {
    query.status = status;
  }
  
  const shipments = await Shipment.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
  const count = await Shipment.countDocuments(query);
  
  return apiSuccess(res, {
    shipments,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// Get single shipment
exports.getShipment = catchAsync(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) {
    return apiError(res, 'Shipment not found', 404);
  }
  return apiSuccess(res, shipment);
});

// Update shipment
exports.updateShipment = catchAsync(async (req, res) => {
  const shipment = await Shipment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!shipment) {
    return apiError(res, 'Shipment not found', 404);
  }
  return apiSuccess(res, shipment, 'Shipment updated successfully');
});

// Delete shipment
exports.deleteShipment = catchAsync(async (req, res) => {
  const shipment = await Shipment.findByIdAndDelete(req.params.id);
  if (!shipment) {
    return apiError(res, 'Shipment not found', 404);
  }
  return apiSuccess(res, null, 'Shipment deleted successfully');
});

// Get clerk statistics
exports.getClerkStats = catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const registeredToday = await Shipment.countDocuments({
    createdAt: { $gte: today }
  });

  const inQueue = await Shipment.countDocuments({
    status: 'pending'
  });

  const processed = await Shipment.countDocuments({
    status: { $in: ['in-transit', 'out-for-delivery'] },
    createdAt: { $gte: weekAgo }
  });

  const dispatched = await Shipment.countDocuments({
    status: { $in: ['delivered'] },
    createdAt: { $gte: weekAgo }
  });

  return apiSuccess(res, {
    registeredToday,
    inQueue,
    processed,
    dispatched
  });
});

// Get shipment by tracking ID (public)
exports.trackShipment = catchAsync(async (req, res) => {
  const shipment = await Shipment.findOne({ 
    tracking: req.params.trackingId 
  });
  
  if (!shipment) {
    return apiError(res, 'Shipment not found', 404);
  }
  
  return apiSuccess(res, shipment);
});
