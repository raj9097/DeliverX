const Shipment = require('../models/Shipment');

exports.getMonthlyStats = async (req, res) => {
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
};

exports.getRevenueStats = async (req, res) => {
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
};

exports.getStatusDistribution = async (req, res) => {
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
};

exports.getSummaryStats = async (req, res) => {
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
};
