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
        // Get the last shipment to generate sequential IDs
        const lastShipment = await Shipment.findOne().sort({ id: -1 });
        let newId = 'SHP-001';
        let newTracking = 'DX-0000-AA';
        
        if (lastShipment) {
            // Generate sequential ID (SHP-001, SHP-002, etc.)
            const lastNum = parseInt(lastShipment.id.replace('SHP-', ''));
            newId = `SHP-${String(lastNum + 1).padStart(3, '0')}`;
            
            // Generate random tracking number (DX-XXXX-XX)
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
            newTracking = `DX-${randomNum}-${randomLetters}`;
        }
        
        const shipmentData = {
            ...req.body,
            id: req.body.id || newId,
            tracking: req.body.tracking || newTracking,
            status: req.body.status || 'pending',
            priority: req.body.priority || 'medium',
            driver: req.body.driver || 'Unassigned',
            created: req.body.created || new Date().toISOString().split('T')[0]
        };
        
        const shipment = new Shipment(shipmentData);
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
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);
        res.json(notifications);
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

// Get shipment status distribution
app.get('/api/stats/status-distribution', async (req, res) => {
    try {
        const shipments = await Shipment.find();
        const distribution = {
            delivered: 0,
            transit: 0,
            pending: 0,
            failed: 0,
            processing: 0
        };
        
        shipments.forEach(s => {
            if (distribution.hasOwnProperty(s.status)) {
                distribution[s.status]++;
            }
        });
        
        const pieData = [
            { name: 'Delivered', value: distribution.delivered, color: '#22c55e' },
            { name: 'In Transit', value: distribution.transit, color: '#3b82f6' },
            { name: 'Pending', value: distribution.pending, color: '#eab308' },
            { name: 'Failed', value: distribution.failed, color: '#ef4444' },
            { name: 'Processing', value: distribution.processing, color: '#8b5cf6' },
        ].filter(d => d.value > 0);
        
        res.json(pieData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get summary stats
app.get('/api/stats/summary', async (req, res) => {
    try {
        const shipments = await Shipment.find();
        
        const total = shipments.length;
        const delivered = shipments.filter(s => s.status === 'delivered').length;
        const failed = shipments.filter(s => s.status === 'failed').length;
        
        const onTimeRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;
        const failedRate = total > 0 ? ((failed / total) * 100).toFixed(1) : 0;
        
        res.json({
            onTimeRate: `${onTimeRate}%`,
            avgDeliveryTime: '2.4d',
            failedRate: `${failedRate}%`,
            totalShipments: total,
            deliveredCount: delivered,
            failedCount: failed
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
