
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Plus, X, Edit, Trash2, Route, ChevronDown } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const officeTypes = [
  { value: 'hub', label: 'Hub (Main Transit Center)', color: '#f97316' },
  { value: 'branch', label: 'Branch (Local Office)', color: '#3b82f6' },
  { value: 'franchise', label: 'Franchise', color: '#22c55e' }
];

const indianStates = [
  'Maharashtra', 'Gujarat', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana',
  'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Kerala',
  'Punjab', 'Haryana', ' Bihar', 'Odisha', 'Jharkhand', 'Chhattisgarh'
];

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    coordinates: { lat: '', lng: '' },
    services: ['pickup', 'delivery'],
    operatingHours: { open: '09:00', close: '18:00' }
  });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch(`${API_BASE}/offices`);
      const data = await res.json();
      setOffices(data);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        coordinates: formData.coordinates.lat ? {
          lat: parseFloat(formData.coordinates.lat),
          lng: parseFloat(formData.coordinates.lng)
        } : undefined
      };

      if (editingOffice) {
        await fetch(`${API_BASE}/offices/${editingOffice._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_BASE}/offices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      await fetchOffices();
      closeModal();
    } catch (err) {
      console.error('Failed to save office:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this office?')) return;
    try {
      await fetch(`${API_BASE}/offices/${id}`, { method: 'DELETE' });
      await fetchOffices();
    } catch (err) {
      console.error('Failed to delete office:', err);
    }
  };

  const openEditModal = (office) => {
    setEditingOffice(office);
    setFormData({
      name: office.name || '',
      code: office.code || '',
      type: office.type || 'branch',
      address: office.address || '',
      city: office.city || '',
      state: office.state || '',
      pincode: office.pincode || '',
      phone: office.phone || '',
      email: office.email || '',
      coordinates: {
        lat: office.coordinates?.lat?.toString() || '',
        lng: office.coordinates?.lng?.toString() || ''
      },
      services: office.services || ['pickup', 'delivery'],
      operatingHours: office.operatingHours || { open: '09:00', close: '18:00' }
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffice(null);
    setFormData({
      name: '', code: '', type: 'branch', address: '', city: '', state: '',
      pincode: '', phone: '', email: '', coordinates: { lat: '', lng: '' },
      services: ['pickup', 'delivery'], operatingHours: { open: '09:00', close: '18:00' }
    });
  };

  const calculateRoute = async (originId, destId) => {
    try {
      const res = await fetch(`${API_BASE}/offices/route/calculate?originId=${originId}&destinationId=${destId}`);
      const data = await res.json();
      setRouteInfo(data);
      setShowRouteModal(true);
    } catch (err) {
      console.error('Failed to calculate route:', err);
    }
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hubs = offices.filter(o => o.type === 'hub');
  const branches = offices.filter(o => o.type === 'branch');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Office Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage your {offices.length} offices across India
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Office
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Building2 size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
          <p className="text-2xl font-display font-bold">{offices.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Offices</p>
        </div>
        <div className="card text-center">
          <Route size={24} className="mx-auto mb-2" style={{ color: '#f97316' }} />
          <p className="text-2xl font-display font-bold" style={{ color: '#f97316' }}>{hubs.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Hubs</p>
        </div>
        <div className="card text-center">
          <MapPin size={24} className="mx-auto mb-2" style={{ color: '#3b82f6' }} />
          <p className="text-2xl font-display font-bold" style={{ color: '#3b82f6' }}>{branches.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Branches</p>
        </div>
      </div>

      {/* Route Calculator */}
      {offices.length >= 2 && (
        <div className="card border-orange-500/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Route size={18} style={{ color: 'var(--accent)' }} />
            Calculate Route Between Offices
          </h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Origin Office</label>
              <select id="routeOrigin" className="input-field">
                <option value="">Select Origin</option>
                {offices.map(o => (
                  <option key={o._id} value={o._id}>{o.name} - {o.city}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Destination Office</label>
              <select id="routeDest" className="input-field">
                <option value="">Select Destination</option>
                {offices.map(o => (
                  <option key={o._id} value={o._id}>{o.name} - {o.city}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => {
                const origin = document.getElementById('routeOrigin').value;
                const dest = document.getElementById('routeDest').value;
                if (origin && dest) calculateRoute(origin, dest);
              }}
              className="btn-primary"
            >
              Calculate Route
            </button>
          </div>
        </div>
      )}

      {/* Offices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.map(office => {
          const typeInfo = officeTypes.find(t => t.value === office.type) || officeTypes[1];
          return (
            <div key={office._id} className="card hover:border-orange-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${typeInfo.color}20` }}>
                    <Building2 size={20} style={{ color: typeInfo.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{office.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{office.code}</p>
                  </div>
                </div>
                <span className="badge text-xs" style={{ 
                  background: `${typeInfo.color}20`, 
                  color: typeInfo.color 
                }}>
                  {office.type.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2">
                  <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                  <span>{office.city}, {office.state}</span>
                </div>
                {office.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>{office.phone}</span>
                  </div>
                )}
                {office.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>{office.email}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-1 flex-wrap">
                {office.services?.map(s => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded" 
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => openEditModal(office)} 
                  className="btn-ghost text-xs py-1.5 flex-1 flex items-center justify-center gap-1">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(office._id)}
                  className="btn-ghost text-xs py-1.5 flex-1 flex items-center justify-center gap-1"
                  style={{ color: '#ef4444' }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {offices.length === 0 && (
        <div className="card text-center py-12">
          <Building2 size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2">No Offices Yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Add your first office to start managing hub-based routing
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            Add First Office
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" 
            style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">
                {editingOffice ? 'Edit Office' : 'Add New Office'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Office Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field" placeholder="e.g., Pune Main Hub" required />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Office Code</label>
                  <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                    className="input-field" placeholder="Auto-generated if empty" />
                </div>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Office Type *</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  className="input-field">
                  {officeTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Address *</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="input-field" placeholder="Full address" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>City *</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="input-field" placeholder="e.g., Pune" required />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>State *</label>
                  <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                    className="input-field" required>
                    <option value="">Select State</option>
                    {indianStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Pincode</label>
                  <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})}
                    className="input-field" placeholder="411001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="input-field" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-field" placeholder="pune@deliverx.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Latitude</label>
                  <input type="number" step="any" value={formData.coordinates.lat} 
                    onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lat: e.target.value}})}
                    className="input-field" placeholder="18.5204" />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Longitude</label>
                  <input type="number" step="any" value={formData.coordinates.lng}
                    onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lng: e.target.value}})}
                    className="input-field" placeholder="73.8567" />
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Services</label>
                <div className="flex gap-3 flex-wrap">
                  {['pickup', 'delivery', 'transit', 'cod', 'reverse-pickup'].map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.services.includes(s)}
                        onChange={() => handleServiceToggle(s)}
                        className="rounded" style={{ accentColor: 'var(--accent)' }} />
                      <span className="text-xs capitalize">{s.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingOffice ? 'Update Office' : 'Add Office'}
                </button>
                <button type="button" onClick={closeModal} className="btn-ghost flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {showRouteModal && routeInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">Shipment Route</h2>
              <button onClick={() => setShowRouteModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Origin</p>
                <p className="font-semibold">{routeInfo.origin?.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{routeInfo.origin?.city}, {routeInfo.origin?.state}</p>
              </div>

              <div className="relative pl-6 space-y-4">
                {routeInfo.route.slice(1, -1).map((stop, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-0 w-4 h-4 rounded-full border-2 border-orange-500 bg-zinc-900"></div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="badge text-xs" style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316' }}>
                        HUB
                      </span>
                      <p className="font-semibold mt-1">{stop.name}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stop.city}, {stop.state}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Destination</p>
                <p className="font-semibold">{routeInfo.destination?.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{routeInfo.destination?.city}, {routeInfo.destination?.state}</p>
              </div>

              <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(249,115,22,0.1)' }}>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Stops</p>
                <p className="text-2xl font-display font-bold" style={{ color: 'var(--accent)' }}>
                  {routeInfo.totalStops}
                </p>
              </div>
            </div>
          </div>
