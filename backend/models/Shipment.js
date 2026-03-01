const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. SHP-001
    tracking: { type: String, required: true, unique: true }, // e.g. DX-7842-KL
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'transit', 'delivered', 'failed'],
      default: 'pending',
    },
    weight: { type: String },
    customer: { type: String },
    driver: { type: String, default: 'Unassigned' },
    eta: { type: String },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    created: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
