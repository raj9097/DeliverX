const Shipment = require('../models/Shipment');

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ created: -1 });
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createShipment = async (req, res) => {
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
};

exports.updateShipment = async (req, res) => {
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
};

exports.deleteShipment = async (req, res) => {
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
};
