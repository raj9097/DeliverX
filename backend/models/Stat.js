const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    shipments: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stat', statSchema);
