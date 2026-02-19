import React from 'react';

export default function StatsCard({ icon: Icon, label, value, change, changeType = 'up', color = 'var(--accent)', subtitle }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            {label}
          </p>
          <p className="text-3xl font-display mt-1 tracking-wide" style={{ color }}>
            {value}
          </p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'up' ? '↑' : '↓'} {change}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
