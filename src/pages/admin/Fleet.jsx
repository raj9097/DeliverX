import React from 'react';
import { Truck, Star, Phone, MapPin, Package } from 'lucide-react';
import { DRIVERS } from '../../utils/mockData';

const statusStyle = {
  on_route:  { bg: 'rgba(249,115,22,0.1)', color: '#f97316', label: '▶ On Route' },
  available: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', label: '● Available' },
  break:     { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', label: '⏸ On Break' },
};

export default function Fleet() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Drivers', value: DRIVERS.length, color: '#f97316' },
          { label: 'On Route',      value: DRIVERS.filter(d => d.status === 'on_route').length, color: '#3b82f6' },
          { label: 'Available',     value: DRIVERS.filter(d => d.status === 'available').length, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{s.label}</p>
            <p className="text-4xl font-display mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DRIVERS.map(d => {
          const ss = statusStyle[d.status];
          const initials = d.name.split(' ').map(n => n[0]).join('');
          return (
            <div key={d.id} className="card animate-fade-in">
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
                      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({d.deliveries} trips)</span>
                    </div>
                  </div>
                </div>
                <span className="badge" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
              </div>

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
                  <span>{d.todayTrips} trips today</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="btn-ghost text-xs py-1.5 flex-1">View Route</button>
                <button className="btn-primary text-xs py-1.5 flex-1">Assign Package</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
