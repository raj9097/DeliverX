const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicle: { type: String },
    status: {
      type: String,
      enum: ['on_route', 'available', 'break', 'offline'],
      default: 'available',
    },
    deliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    phone: { type: String },
    zone: { type: String },
    todayTrips: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
