require('dotenv').config();
const mongoose = require('mongoose');

const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');
const Notification = require('../models/Notification');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected to Atlas!');
        const s = await Shipment.countDocuments();
        const d = await Driver.countDocuments();
        const n = await Notification.countDocuments();
        const u = await User.countDocuments();
        console.log(`📦 Shipments: ${s}`);
        console.log(`🚛 Drivers: ${d}`);
        console.log(`🔔 Notifications: ${n}`);
        console.log(`👤 Users: ${u}`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
