require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import Mongoose Models
const Shipment = require('./models/Shipment');
const Driver = require('./models/Driver');
const Notification = require('./models/Notification');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/DeliverX';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Routes - Now using MongoDB

// Get all shipments
app.get('/api/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ created: -1 });
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new shipment
app.post('/api/shipments', async (req, res) => {
    try {
        const shipment = new Shipment(req.body);
        await shipment.save();
        res.status(201).json(shipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update shipment
app.put('/api/shipments/:id', async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (shipment) {
            res.json(shipment);
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete shipment
app.delete('/api/shipments/:id', async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if (shipment) {
            res.json({ message: 'Shipment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all drivers
app.get('/api/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get monthly stats (mock calculation from shipments)
app.get('/api/stats/monthly', async (req, res) => {
    try {
        const shipments = await Shipment.find();
        // Group by month from created date
        const stats = {};
        shipments.forEach(s => {
            const month = new Date(s.created).toLocaleString('default', { month: 'short' });
            if (!stats[month]) {
                stats[month] = { shipments: 0, delivered: 0, failed: 0 };
            }
            stats[month].shipments++;
            if (s.status === 'delivered') stats[month].delivered++;
            if (s.status === 'failed') stats[month].failed++;
        });
        res.json(Object.entries(stats).map(([month, data]) => ({ month, ...data })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get revenue data (mock - would need price field)
app.get('/api/stats/revenue', async (req, res) => {
    try {
        const shipments = await Shipment.find();
        const revenueByMonth = {};
        shipments.forEach(s => {
            const month = new Date(s.created).toLocaleString('default', { month: 'short' });
            if (!revenueByMonth[month]) {
                revenueByMonth[month] = 0;
            }
            // Mock revenue calculation - would need actual price field
            revenueByMonth[month] += 100; 
        });
        res.json(Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get notifications
app.get('/api/notifications', async (req, res) => {
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update driver status
app.patch('/api/drivers/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const driver = await Driver.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (driver) {
            res.json(driver);
        } else {
            res.status(404).json({ error: 'Driver not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
        status: 'ok', 
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
