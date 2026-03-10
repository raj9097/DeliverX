import React, { useState, useEffect } from 'react';
import { ClipboardList, Package, Clock, CheckCircle, Loader2, X, Check } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import ShipmentsTable from '../../components/common/ShipmentsTable';

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    recipientName: '',
    recipientPhone: '',
    originAddress: '',
    destinationAddress: '',
    weight: '',
    dimensions: '',
    priority: 'medium',
    serviceType: 'Standard (3-5 days)',
    notes: ''
  });

  // Stats state
  const [stats, setStats] = useState({
    registeredToday: 0,
    inQueue: 0,
    processed: 0,
    dispatched: 0
  });

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shipments/stats/clerk', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateTrackingId = () => {
    const prefix = 'DX';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}-${random}-${suffix}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const trackingId = generateTrackingId();
      
      const shipmentData = {
        tracking: trackingId,
        sender: formData.senderName,
        senderPhone: formData.senderPhone,
        recipient: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        origin: formData.originAddress,
        destination: formData.destinationAddress,
        weight: parseFloat(formData.weight),
        dimensions: formData.dimensions,
        priority: formData.priority,
        serviceType: formData.serviceType,
        notes: formData.notes,
        status: 'pending',
        createdBy: 'clerk'
      };

      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shipmentData)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: `Shipment registered successfully! Tracking: ${trackingId}` });
        
        // Reset form
        setFormData({
          senderName: '',
          senderPhone: '',
          recipientName: '',
          recipientPhone: '',
          originAddress: '',
          destinationAddress: '',
          weight: '',
          dimensions: '',
          priority: 'medium',
          serviceType: 'Standard (3-5 days)',
          notes: ''
        });
        
        // Refresh stats
        fetchStats();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to register shipment' });
      }
    } catch (error) {
      console.error('Error registering shipment:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ClipboardList} label="Registered Today" value={stats.registeredToday} color="#a855f7" subtitle="By you" />
        <StatsCard icon={Clock} label="In Queue" value={stats.inQueue} color="#eab308" subtitle="Awaiting processing" />
        <StatsCard icon={Package} label="Processed" value={stats.processed} color="#3b82f6" subtitle="This week" />
        <StatsCard icon={CheckCircle} label="Dispatched" value={stats.dispatched} color="#22c55e" subtitle="This week" />
      </div>

      {/* Message/Notification */}
      {message && (
        <div className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
            : 'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
          <span className="text-sm">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[['register', 'Register Shipment'], ['queue', 'Processing Queue'], ['all', 'All Shipments']].map(([id, label]) => (
          <button key={id}
            onClick={() => setActiveTab(id)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              background: activeTab === id ? 'var(--accent)' : 'transparent',
              color: activeTab === id ? 'white' : 'var(--text-secondary)'
            }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'register' && (
        <div className="card max-w-2xl animate-fade-in" style={{ padding: 28 }}>
          <h2 className="font-heading text-xl font-bold mb-5">Register New Shipment</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Sender Name *</label>
                <input 
                  type="text" 
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Sender Phone *</label>
                <input 
                  type="tel" 
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Recipient Name *</label>
                <input 
                  type="text" 
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Recipient Phone *</label>
                <input 
                  type="tel" 
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Origin Address *</label>
                <input 
                  type="text" 
                  name="originAddress"
                  value={formData.originAddress}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Destination Address *</label>
                <input 
                  type="text" 
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleInputChange}
                  className="input-field" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Package Weight (kg) *</label>
                <input 
                  type="number" 
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                  min="0.1"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Package Dimensions</label>
                <input 
                  type="text" 
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="L x W x H (cm)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Service Type</label>
                <select 
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option>Standard (3-5 days)</option>
                  <option>Express (1-2 days)</option>
                  <option>Same Day</option>
                </select>
              </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field" 
                rows={2} 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary mt-5 w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Registering...
                </>
              ) : (
                'Generate Tracking & Register'
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="card animate-fade-in">
          <h3 className="font-heading font-semibold mb-4">Processing Queue</h3>
          <ShipmentsTable canEdit statusFilter="pending" />
        </div>
      )}

      {activeTab === 'all' && (
        <div className="animate-fade-in">
          <ShipmentsTable />
        </div>
      )}
    </div>
  );
}
