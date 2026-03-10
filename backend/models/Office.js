const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // e.g. PUNE-HUB, AHMDBAD-HUB
  type: { 
    type: String, 
    enum: ['hub', 'branch', 'franchise'], 
    default: 'branch' 
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  phone: { type: String },
  email: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  parentOffice: { type: mongoose.Schema.Types.ObjectId, ref: 'Office' },
  isActive: { type: Boolean, default: true },
  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '18:00' }
  },
  services: [{
    type: String,
    enum: ['pickup', 'delivery', 'transit', 'cod', 'reverse-pickup']
  }]
}, { timestamps: true });

// Index for searching
officeSchema.index({ city: 1, state: 1 });
officeSchema.index({ type: 1 });

module.exports = mongoose.model('Office', officeSchema);

