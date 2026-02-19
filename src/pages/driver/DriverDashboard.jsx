import React, { useState } from 'react';
import { Truck, MapPin, Package, CheckCircle, Navigation, Clock, AlertCircle, Phone } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import { SHIPMENTS } from '../../utils/mockData';

const myShipments = SHIPMENTS.filter(s => s.driver === 'Taylor Quinn');

const STATUS_OPTIONS = ['pending', 'transit', 'delivered', 'failed'];

export default function DriverDashboard() {
  const [shipments, setShipments] = useState(myShipments);
  const [selected, setSelected] = useState(null);

  const updateStatus = (id, status) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setSelected(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Truck}       label="Today's Route"   value="3 stops"  color="#f97316" subtitle="Est 4.5 hrs" />
        <StatsCard icon={CheckCircle} label="Delivered"        value="2"        color="#22c55e" subtitle="Today" />
        <StatsCard icon={Package}     label="In Transit"       value="1"        color="#3b82f6" subtitle="Active now" />
        <StatsCard icon={Clock}       label="Hours Logged"     value="6.2h"     color="#a855f7" subtitle="Today" />
      </div>

      {/* Driver Info banner */}
      <div className="card flex items-center justify-between flex-wrap gap-4"
        style={{ background: 'var(--accent-dim)', borderColor: 'rgba(249,115,22,0.3)' }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--accent)' }}>
            <Truck size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Taylor Quinn – Route 7 North</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ford Transit TX-847 · Currently On Route</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2 text-sm"><Navigation size={15} /> Start Navigation</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Phone size={15} /> Dispatch</button>
        </div>
      </div>

      {/* Shipments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((s, i) => {
          const statusColors = {
            pending: { bg: 'rgba(234,179,8,0.1)', color: '#eab308', label: '● Pending' },
            transit: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: '▶ In Transit' },
            delivered: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: '✓ Delivered' },
            failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: '✕ Failed' },
            processing: { bg: 'rgba(168,85,247,0.1)', color: '#a855f7', label: '⟳ Processing' },
          };
          const ss = statusColors[s.status] || {};
          return (
            <div key={s.id} className="card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>{s.tracking}</p>
                  <p className="font-semibold text-sm mt-0.5">{s.customer}</p>
                </div>
                <span className="badge" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={12} style={{ color: 'var(--accent)' }} />
                  <span>{s.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Package size={12} style={{ color: 'var(--text-muted)' }} />
                  <span>{s.weight} · {s.priority} priority</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                  <span>ETA: {s.eta}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelected(s.id === selected ? null : s.id)}
                  className="btn-ghost text-xs py-1.5 flex-1">Update Status</button>
                <button className="btn-primary text-xs py-1.5 flex-1 flex items-center justify-center gap-1">
                  <Navigation size={12} /> Navigate
                </button>
              </div>

              {selected === s.id && (
                <div className="mt-3 grid grid-cols-2 gap-1.5 animate-fade-in">
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt}
                      onClick={() => updateStatus(s.id, opt)}
                      className="text-xs py-1.5 px-2 rounded-lg capitalize transition-all"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
