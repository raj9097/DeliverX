import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, Package, X } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const StatusBadge = ({ status }) => {
  const cls = {
    pending: 'status-pending',
    transit: 'status-transit',
    delivered: 'status-delivered',
    failed: 'status-failed',
    processing: 'status-processing',
  };
  const labels = {
    pending: '● Pending',
    transit: '▶ In Transit',
    delivered: '✓ Delivered',
    failed: '✕ Failed',
    processing: '⟳ Processing',
  };
  return <span className={cls[status] || 'badge'}>{labels[status] || status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    medium: { bg: 'rgba(234,179,8,0.1)', color: '#eab308' },
    low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  };
  const s = styles[priority] || {};
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {priority?.toUpperCase()}
    </span>
  );
};

export default function ShipmentsTable({ canCreate = false, canEdit = false, canDelete = false, filterByDriver = null, onShipmentsUpdate }) {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    customer: '',
    origin: '',
    destination: '',
    weight: '',
    eta: '',
    priority: 'medium'
  });

  // Fetch shipments from API
  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API_BASE}/shipments`);
      const data = await res.json();
      setShipments(data);
      if (onShipmentsUpdate) {
        onShipmentsUpdate(data);
      }
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
      setError('Failed to load shipments');
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Filter data
  let data = shipments;
  if (filterByDriver) data = data.filter(s => s.driver === filterByDriver);
  if (search) data = data.filter(s =>
    (s.tracking?.toLowerCase().includes(search.toLowerCase()) ||
    s.customer?.toLowerCase().includes(search.toLowerCase()) ||
    s.destination?.toLowerCase().includes(search.toLowerCase()))
  );
  if (statusFilter !== 'all') data = data.filter(s => s.status === statusFilter);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create shipment');
      }

      const newShipment = await res.json();
      
      // Refresh the list
      await fetchShipments();
      
      // Reset form and close modal
      setFormData({
        customer: '',
        origin: '',
        destination: '',
        weight: '',
        eta: '',
        priority: 'medium'
      });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create shipment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/shipments/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        await fetchShipments();
      }
    } catch (err) {
      console.error('Failed to delete shipment:', err);
      setError('Failed to delete shipment');
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              className="input-field pl-8 py-2 text-sm"
              placeholder="Search tracking, customer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220, height: 36 }}
            />
          </div>
          <select
            className="input-field py-2 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ height: 36, width: 160 }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        {canCreate && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Shipment
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="table-header">
            <tr>
              {['Tracking', 'Customer', 'Origin → Destination', 'Status', 'Priority', 'Weight', 'Driver', 'ETA', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                  <Package size={32} className="mx-auto mb-2 opacity-40" />
                  No shipments found
                </td>
              </tr>
            ) : data.map(s => (
              <tr key={s._id || s.id} className="table-row">
                <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>{s.tracking}</td>
                <td className="px-4 py-3 font-medium text-sm">{s.customer}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', maxWidth: 200 }}>
                  <div className="truncate">{s.origin}</div>
                  <div className="truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>→ {s.destination}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={s.priority} /></td>
                <td className="px-4 py-3 font-mono text-xs">{s.weight}</td>
                <td className="px-4 py-3 text-xs" style={{ color: s.driver === 'Unassigned' ? '#71717a' : 'inherit' }}>{s.driver}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.eta}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700" title="View"><Eye size={13} /></button>
                    {canEdit && <button className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700" title="Edit"><Edit2 size={13} /></button>}
                    {canDelete && <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg transition-colors hover:text-red-400" title="Delete"><Trash2 size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Showing {data.length} of {shipments.length} shipments</span>
        <div className="flex gap-1">
          <button className="btn-ghost px-3 py-1 text-xs">Prev</button>
          <button className="btn-primary px-3 py-1 text-xs">1</button>
          <button className="btn-ghost px-3 py-1 text-xs">Next</button>
        </div>
      </div>

      {/* New Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" style={{ padding: 28 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">Register New Shipment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Customer Name *</label>
                  <input 
                    type="text" 
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    placeholder="Acme Corp" 
                    className="input-field" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Origin Address *</label>
                  <input 
                    type="text" 
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    placeholder="New York, NY" 
                    className="input-field" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Destination Address *</label>
                  <input 
                    type="text" 
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Los Angeles, CA" 
                    className="input-field" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Weight (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="5.0" 
                      step="0.1"
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>ETA</label>
                    <input 
                      type="date" 
                      name="eta"
                      value={formData.eta}
                      onChange={handleInputChange}
                      className="input-field" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  className="btn-primary flex-1" 
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Register Shipment'}
                </button>
                <button 
                  type="button" 
                  className="btn-ghost flex-1" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
