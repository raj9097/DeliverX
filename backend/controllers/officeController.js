const Office = require('../models/Office');

// Get all offices
exports.getAllOffices = async (req, res) => {
    try {
        const offices = await Office.find().sort({ type: 1, name: 1 });
        res.json(offices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get office by ID
exports.getOfficeById = async (req, res) => {
    try {
        const office = await Office.findById(req.params.id);
        if (office) {
            res.json(office);
        } else {
            res.status(404).json({ error: 'Office not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new office
exports.createOffice = async (req, res) => {
    try {
        // Generate code if not provided
        let code = req.body.code;
        if (!code) {
            const cityCode = req.body.city?.substring(0, 3).toUpperCase() || 'OFF';
            const count = await Office.countDocuments({ city: new RegExp(req.body.city, 'i') });
            code = `${cityCode}-${req.body.type === 'hub' ? 'HUB' : 'BRN'}-${String(count + 1).padStart(3, '0')}`;
        }

        const office = new Office({
            ...req.body,
            code
        });
        
        await office.save();
        res.status(201).json(office);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update office
exports.updateOffice = async (req, res) => {
    try {
        const office = await Office.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (office) {
            res.json(office);
        } else {
            res.status(404).json({ error: 'Office not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete office
exports.deleteOffice = async (req, res) => {
    try {
        const office = await Office.findByIdAndDelete(req.params.id);
        if (office) {
            // Check if any other offices reference this as parent
            await Office.updateMany(
                { parentOffice: req.params.id },
                { $set: { parentOffice: null } }
            );
            res.json({ message: 'Office deleted successfully' });
        } else {
            res.status(404).json({ error: 'Office not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get hubs only
exports.getHubs = async (req, res) => {
    try {
        const hubs = await Office.find({ type: 'hub', isActive: true }).sort({ name: 1 });
        res.json(hubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get branches by state/city
exports.getBranches = async (req, res) => {
    try {
        const { state, city } = req.query;
        let query = { type: 'branch', isActive: true };
        if (state) query.state = state;
        if (city) query.city = new RegExp(city, 'i');
        
        const branches = await Office.find(query).sort({ name: 1 });
        res.json(branches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Calculate route between two offices through hubs
exports.calculateRoute = async (req, res) => {
    try {
        const { originId, destinationId } = req.query;
        
        const origin = await Office.findById(originId);
        const destination = await Office.findById(destinationId);
        
        if (!origin || !destination) {
            return res.status(404).json({ error: 'Origin or destination office not found' });
        }

        // Find all hubs
        const hubs = await Office.find({ type: 'hub', isActive: true });
        
        // Simple routing logic: Find nearest hubs to origin and destination
        // In a real app, this would use more sophisticated routing algorithms
        
        const route = [origin];
        
        // If origin is a branch, route through a hub
        if (origin.type === 'branch') {
            const nearestHub = findNearestHub(origin, hubs);
            if (nearestHub && nearestHub._id.toString() !== origin._id.toString()) {
                route.push(nearestHub);
            }
        }
        
        // If destination is a branch, route through a hub
        if (destination.type === 'branch') {
            const nearestHub = findNearestHub(destination, hubs);
            if (nearestHub && nearestHub._id.toString() !== destination._id.toString()) {
                // Check if we already have this hub in route
                const alreadyInRoute = route.some(o => o._id.toString() === nearestHub._id.toString());
                if (!alreadyInRoute) {
                    route.push(nearestHub);
                }
            }
        }
        
        // Add destination
        if (destination._id.toString() !== route[route.length - 1]._id.toString()) {
            route.push(destination);
        }
        
        res.json({
            origin,
            destination,
            route,
            totalStops: route.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to find nearest hub
function findNearestHub(office, hubs) {
    if (!hubs || hubs.length === 0) return null;
    
    // If office has coordinates, use distance calculation
    if (office.coordinates?.lat && office.coordinates?.lng) {
        let nearestHub = null;
        let minDistance = Infinity;
        
        hubs.forEach(hub => {
            if (hub.coordinates?.lat && hub.coordinates?.lng) {
                const distance = calculateDistance(
                    office.coordinates.lat,
                    office.coordinates.lng,
                    hub.coordinates.lat,
                    hub.coordinates.lng
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestHub = hub;
                }
            }
        });
        
        return nearestHub;
    }
    
    // Fallback: return first hub
    return hubs[0];
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

