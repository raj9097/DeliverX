const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['alert', 'success', 'info', 'warning'],
      default: 'info',
    },
    message: { type: String, required: true },
    time: { type: String, default: 'just now' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
