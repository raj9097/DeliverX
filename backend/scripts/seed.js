require('dotenv').config();
const mongoose = require('mongoose');
const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deliverx';

// Sample data matching the original mock data
const shipments = [
    { id: 'SHP-001', tracking: 'DX-7842-KL', origin: 'New York, NY', destination: 'Los Angeles, CA', status: 'transit', weight: '12.4 kg', customer: 'Acme Corp', driver: 'Taylor Quinn', eta: '2025-02-20', priority: 'high', created: '2025-02-15' },
    { id: 'SHP-002', tracking: 'DX-7843-MN', origin: 'Chicago, IL', destination: 'Houston, TX', status: 'delivered', weight: '3.2 kg', customer: 'TechFlow Inc', driver: 'Casey Park', eta: '2025-02-17', priority: 'medium', created: '2025-02-14' },
    { id: 'SHP-003', tracking: 'DX-7844-PQ', origin: 'Seattle, WA', destination: 'Miami, FL', status: 'pending', weight: '28.1 kg', customer: 'Global Retail', driver: 'Unassigned', eta: '2025-02-22', priority: 'low', created: '2025-02-16' },
    { id: 'SHP-004', tracking: 'DX-7845-RS', origin: 'Boston, MA', destination: 'Denver, CO', status: 'processing', weight: '5.7 kg', customer: 'Swift Goods', driver: 'Taylor Quinn', eta: '2025-02-21', priority: 'high', created: '2025-02-16' },
    { id: 'SHP-005', tracking: 'DX-7846-TU', origin: 'Phoenix, AZ', destination: 'Portland, OR', status: 'failed', weight: '9.3 kg', customer: 'BestBuy Pro', driver: 'Casey Park', eta: '2025-02-18', priority: 'medium', created: '2025-02-13' },
    { id: 'SHP-006', tracking: 'DX-7847-VW', origin: 'Atlanta, GA', destination: 'Las Vegas, NV', status: 'transit', weight: '15.6 kg', customer: 'FastShip LLC', driver: 'Taylor Quinn', eta: '2025-02-19', priority: 'high', created: '2025-02-15' },
    { id: 'SHP-007', tracking: 'DX-7848-XY', origin: 'Dallas, TX', destination: 'San Diego, CA', status: 'delivered', weight: '2.1 kg', customer: 'NovaMart', driver: 'Casey Park', eta: '2025-02-17', priority: 'low', created: '2025-02-14' },
    { id: 'SHP-008', tracking: 'DX-7849-ZA', origin: 'Minneapolis, MN', destination: 'Nashville, TN', status: 'pending', weight: '6.8 kg', customer: 'PrimeShip Co', driver: 'Unassigned', eta: '2025-02-23', priority: 'medium', created: '2025-02-16' },
];

const drivers = [
    { name: 'Taylor Quinn', vehicle: 'Ford Transit – TX-847', status: 'on_route', deliveries: 12, rating: 4.8, phone: '+1 555-0101', zone: 'Route 7 – North', todayTrips: 3 },
    { name: 'Casey Park', vehicle: 'Mercedes Sprinter – CA-293', status: 'available', deliveries: 8, rating: 4.6, phone: '+1 555-0102', zone: 'Last Mile – Zone 3', todayTrips: 2 },
    { name: 'Jamie Lee', vehicle: 'Ram ProMaster – NY-512', status: 'break', deliveries: 15, rating: 4.9, phone: '+1 555-0103', zone: 'Route 2 – East', todayTrips: 4 },
    { name: 'Robin Cruz', vehicle: 'Chevy Express – IL-774', status: 'on_route', deliveries: 6, rating: 4.5, phone: '+1 555-0104', zone: 'Route 5 – West', todayTrips: 2 },
];

const notifications = [
    { type: 'alert', message: 'SHP-005 delivery failed – customer not available', time: '2m ago' },
    { type: 'success', message: 'SHP-002 successfully delivered to TechFlow Inc', time: '18m ago' },
    { type: 'info', message: 'Driver Taylor Quinn started route 7', time: '45m ago' },
    { type: 'warning', message: 'SHP-003 pending assignment for 2 hours', time: '1h ago' },
    { type: 'info', message: 'New shipment SHP-008 registered by Jordan Smith', time: '2h ago' },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Shipment.deleteMany({});
        await Driver.deleteMany({});
        await Notification.deleteMany({});
        console.log('Cleared existing data');

        // Insert new data
        await Shipment.insertMany(shipments);
        await Driver.insertMany(drivers);
        await Notification.insertMany(notifications);
        console.log('✅ Seed data inserted successfully');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
}

seed();
