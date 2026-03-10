import React, { useState, useEffect } from 'react';
import { Truck, Star, Phone, MapPin, Package, X, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const statusStyle = {
  on_route:  { bg: 'rgba(249,115,22,0.1)', color: '#f97316', label: '▶ On Route' },
  available: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', label: '● Available' },
  break:     { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', label: '⏸ On Break' },
};

export default function Fleet() {
  const [drivers, setDrivers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, shipmentsRes] = await Promise.all([
        fetch(`${API_BASE}/drivers`),
        fetch(`${API_BASE}/shipments`)
      ]);
      const driversData = await driversRes.json();
      const shipmentsData = await shipmentsRes.json();
      setDrivers(driversData);
      setShipments(shipmentsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const unassignedShipments = shipments.filter(s => !s.driver || s.driver === 'Unassigned');

  const getDriverShipments = (driverName) => {
    return shipments.filter(s => s.driver === driverName);
  };

  const openAssignModal = (driver) => {
    setSelectedDriver(driver);
    setSelectedShipments([]);
    setShowAssignModal(true);
  };

  const toggleShipment = (tracking) => {
    setSelectedShipments(prev => 
      prev.includes(tracking) 
        ? prev.filter(t => t !== tracking)
        : [...prev, tracking]
    );
  };

  const handleAssign = async () => {
    if (selectedShipments.length === 0) return;
    
    setAssigning(true);
    try {
      for (const tracking of selectedShipments) {
        const shipment = shipments.find(s => s.tracking === tracking);
        if (shipment && shipment._id) {
          await fetch(`${API_BASE}/shipments/${shipment._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driver: selectedDriver.name })
          });
        }
      }
      
      await fetchData();
      setShowAssignModal(false);
      setSelectedShipments([]);
      setSelectedDriver(null);
    } catch (err) {
      console.error('Failed to assign shipments:', err);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalDrivers = drivers.length;
  const onRouteCount = drivers.filter(d => d.status === 'on_route').length;
  const availableCount = drivers.filter(d => d.status === 'available').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Drivers', value: totalDrivers, color: '#f97316' },
          { label: 'On Route',      value: onRouteCount, color: '#3b82f6' },
          { label: 'Available',     value: availableCount, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{s.label}</p>
            <p className="text-4xl font-display mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {unassignedShipments.length > 0 && (
        <div className="card border-orange-500/30 bg-orange-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-orange-500" />
              <div>
                <p className="font-medium">Unassigned Shipments</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{unassignedShipments.length} shipments need driver assignment</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {drivers.filter(d => d.status === 'available').slice(0, 3).map(d => (
                <button 
                  key={d._id}
                  onClick={() => openAssignModal(d)}
                  className="btn-primary text-xs py-1.5"
                >
                  Assign to {d.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers.map(d => {
          const ss = statusStyle[d.status] || statusStyle.available;
          const initials = d.name ? d.name.split(' ').map(n => n[0]).join('') : 'D';
          const driverShipments = getDriverShipments(d.name);
          
          return (
            <div key={d._id || d.id} className="card animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base"
                    style={{ background: ss.bg, color: ss.color }}>
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base">{d.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold" style={{ color: '#eab308' }}>{d.rating}</span>
                      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({d.deliveries || 0} trips)</span>
                    </div>
                  </div>
                </div>
                <span className="badge" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
              </div>

              {driverShipments.length > 0 && (
                <div className="mt-3 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Assigned Shipments ({driverShipments.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {driverShipments.slice(0, 4).map(s => (
                      <span key={s._id} className="px-2 py-0.5 text-xs rounded font-mono" 
                        style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}>
                        {s.tracking}
                      </span>
                    ))}
                    {driverShipments.length > 4 && (
                      <span className="px-2 py-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        +{driverShipments.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Truck size={13} style={{ color: 'var(--text-muted)' }} />
                  <span className="truncate">{d.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                  <span>{d.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                  <span className="truncate">{d.zone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Package size={13} style={{ color: 'var(--text-muted)' }} />
                  <span>{driverShipments.length} active</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="btn-ghost text-xs py-1.5 flex-1">View Route</button>
                <button 
                  onClick={() => openAssignModal(d)}
                  className="btn-primary text-xs py-1.5 flex-1"
                >
                  Assign Shipment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAssignModal && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-lg animate-fade-in" style={{ padding: 28, maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-bold">Assign Shipments</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Assign to: <span className="font-medium" style={{ color: 'var(--accent)' }}>{selectedDriver.name}</span>
                </p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>

            {unassignedShipments.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <p className="font-medium">All shipments are assigned!</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No unassigned shipments available</p>
              </div>
            ) : (
              <>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  Select shipments to assign ({selectedShipments.length} selected)
                </p>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {unassignedShipments.map(s => {
                    const isSelected = selectedShipments.includes(s.tracking);
                    return (
                      <div 
                        key={s._id}
                        onClick={() => toggleShipment(s.tracking)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'border-2 border-orange-500' : 'border border-transparent hover:border-zinc-600'
                        }`}
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              isSelected ? 'bg-orange-500' : 'border border-zinc-600'
                            }`}>
                              {isSelected && <CheckCircle size={14} className="text-white" />}
                            </div>
                            <div>
                              <p className="font-mono text-sm font-semibold" style={{ color: 'var(--accent)' }}>{s.tracking}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {s.customer} → {s.destination}
                              </p>
                            </div>
                          </div>
                          <span className="badge" style={{ 
                            background: s.priority === 'high' ? 'rgba(239,68,68,0.1)' : 
                                       s.priority === 'medium' ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)',
                            color: s.priority === 'high' ? '#ef4444' : 
                                   s.priority === 'medium' ? '#eab308' : '#22c55e'
                          }}>
                            {s.priority?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAssign}
                    disabled={selectedShipments.length === 0 || assigning}
                    className="btn-primary flex-1"
                  >
                    {assigning ? 'Assigning...' : `Assign ${selectedShipments.length} Shipment${selectedShipments.length !== 1 ? 's' : ''}`}
                  </button>
                  <button 
                    onClick={() => setShowAssignModal(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

