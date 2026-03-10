import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, Package, X, Truck, User, MapPin, Calendar, Clock, Phone } from 'lucide-react';

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
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state for create
  const [formData, setFormData] = useState({
    customer: '',
    origin: '',
    destination: '',
    weight: '',
    eta: '',
    priority: 'medium',
    driver: '',
    status: 'pending',
    phone: '',
    notes: ''
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

  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_BASE}/drivers`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchDrivers();
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

  // Handle create form submission
  const handleCreate = async (e) => {
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
        priority: 'medium',
        driver: '',
        status: 'pending',
        phone: '',
        notes: ''
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create shipment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form submission
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/shipments/${selectedShipment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update shipment');
      }

      // Refresh the list
      await fetchShipments();
      
      // Close modal
      setShowEditModal(false);
      setSelectedShipment(null);
    } catch (err) {
      console.error('Failed to update shipment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle view
  const handleView = (shipment) => {
    setSelectedShipment(shipment);
    setShowViewModal(true);
  };

  // Handle edit click
  const handleEditClick = (shipment) => {
    setSelectedShipment(shipment);
    setFormData({
      customer: shipment.customer || '',
      origin: shipment.origin || '',
      destination: shipment.destination || '',
      weight: shipment.weight || '',
      eta: shipment.eta ? shipment.eta.split('T')[0] : '',
      priority: shipment.priority || 'medium',
      driver: shipment.driver === 'Unassigned' ? '' : (shipment.driver || ''),
      status: shipment.status || 'pending',
      phone: shipment.phone || '',
      notes: shipment.notes || ''
    });
    setShowEditModal(true);
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
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
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
                <td className="px-4 py-3 text-xs" style={{ color: s.driver === 'Unassigned' ? '#71717a' : 'inherit' }}>{s.driver || 'Unassigned'}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.eta ? s.eta.split('T')[0] : '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleView(s)} className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700" title="View"><Eye size={13} /></button>
                    {canEdit && <button onClick={() => handleEditClick(s)} className="p-1.5 rounded-lg transition-colors hover:bg-zinc-700" title="Edit"><Edit2 size={13} /></button>}
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

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" style={{ padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">Register New Shipment</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Customer Name *</label>
                    <input 
                      type="text" 
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      className="input-field" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Origin Address *</label>
                  <input 
                    type="text" 
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
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
                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Assign Driver</label>
                  <select 
                    name="driver"
                    value={formData.driver}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field" 
                    rows={2}
                  />
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
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Shipment Modal */}
      {showViewModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" style={{ padding: 28 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold">Shipment Details</h2>
                <p className="text-sm font-mono mt-1" style={{ color: 'var(--accent)' }}>{selectedShipment.tracking}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status & Priority */}
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Status</p>
                  <StatusBadge status={selectedShipment.status} />
                </div>
                <div className="flex-1 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Priority</p>
                  <PriorityBadge priority={selectedShipment.priority} />
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>CUSTOMER</span>
                </div>
                <p className="font-medium">{selectedShipment.customer}</p>
                {selectedShipment.phone && (
                  <p className="text-sm flex items-center gap-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <Phone size={12} /> {selectedShipment.phone}
                  </p>
                )}
              </div>

              {/* Route */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>ROUTE</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-zinc-500"></div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Origin</p>
                      <p>{selectedShipment.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 rounded-full" style={{ background: 'var(--accent)' }}></div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Destination</p>
                      <p>{selectedShipment.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={14} style={{ color: 'var(--accent)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>DRIVER</span>
                  </div>
                  <p>{selectedShipment.driver || 'Unassigned'}</p>
                </div>
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} style={{ color: 'var(--accent)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>ETA</span>
                  </div>
                  <p>{selectedShipment.eta ? selectedShipment.eta.split('T')[0] : 'Not set'}</p>
                </div>
              </div>

              {/* Package Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Weight</p>
                  <p className="font-mono">{selectedShipment.weight || '-'} kg</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Created</p>
                  <p className="font-mono text-xs">{selectedShipment.createdAt ? new Date(selectedShipment.createdAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedShipment.notes && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Notes</p>
                  <p className="text-sm">{selectedShipment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowViewModal(false)} className="btn-ghost flex-1">Close</button>
              {canEdit && (
                <button onClick={() => { setShowViewModal(false); handleEditClick(selectedShipment); }} className="btn-primary flex-1">
                  Edit Shipment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Shipment Modal */}
      {showEditModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" style={{ padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold">Edit Shipment</h2>
                <p className="text-sm font-mono mt-1" style={{ color: 'var(--accent)' }}>{selectedShipment.tracking}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Customer Name *</label>
                    <input 
                      type="text" 
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      className="input-field" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Origin Address *</label>
                  <input 
                    type="text" 
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
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
                <div className="grid grid-cols-2 gap-3">
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
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Assign Driver</label>
                  <select 
                    name="driver"
                    value={formData.driver}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field" 
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  className="btn-primary flex-1" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-ghost flex-1" 
                  onClick={() => setShowEditModal(false)}
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

