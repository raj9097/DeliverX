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

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// Import User model
const User = require('./models/User');

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password, role, department, status } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        const user = new User({
            name,
            email,
            password,
            role: role || 'clerk',
            department: department || '',
            status: status || 'active'
        });
        
        await user.save();
        
        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, role, department, status, password } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (department !== undefined) user.department = department;
        if (status) user.status = status;
        if (password) user.password = password;
        
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        if (user.status === 'inactive') {
            return res.status(401).json({ error: 'Account is inactive' });
        }
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json({
            success: true,
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// DRIVER MANAGEMENT ROUTES
// ============================================

// Create new driver
app.post('/api/drivers', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update driver
app.put('/api/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (driver) {
            res.json(driver);
        } else {
            res.status(404).json({ error: 'Driver not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete driver
app.delete('/api/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (driver) {
            res.json({ message: 'Driver deleted successfully' });
        } else {
            res.status(404).json({ error: 'Driver not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// NOTIFICATION MANAGEMENT
// ============================================

// Create notification
app.post('/api/notifications', async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
