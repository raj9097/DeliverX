const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  tracking: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  sender: {
    type: String,
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  dimensions: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  serviceType: {
    type: String,
    enum: ['Standard (3-5 days)', 'Express (1-2 days)', 'Same Day'],
    default: 'Standard (3-5 days)'
  },
  status: {
    type: String,
    enum: ['pending', 'picked', 'in-transit', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdBy: {
    type: String,
    enum: ['admin', 'clerk', 'system'],
    default: 'clerk'
  },
  // Hub routing fields
  currentHub: String,
  destinationHub: String,
  route: [{
    hub: String,
    arrival: Date,
    departure: Date,
    status: String
  }],
  eta: String,
  // Driver assignment
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  // Timeline
  timeline: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
shipmentSchema.index({ status: 1, createdAt: -1 });
shipmentSchema.index({ tracking: 1 });
shipmentSchema.index({ recipient: 1 });
shipmentSchema.index({ origin: 1 });
shipmentSchema.index({ destination: 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
