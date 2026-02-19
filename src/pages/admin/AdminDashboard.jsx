import React from 'react';
import { Package, Truck, Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import { MONTHLY_STATS, REVENUE_DATA, NOTIFICATIONS, DRIVERS } from '../../utils/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const driverStatusColor = { on_route: '#f97316', available: '#22c55e', break: '#eab308' };
const driverStatusLabel = { on_route: 'On Route', available: 'Available', break: 'On Break' };

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Package}    label="Total Shipments" value="2,847"  change="12.4%"  color="#f97316" subtitle="This month" />
        <StatsCard icon={CheckCircle} label="Delivered"       value="2,590"  change="8.1%"   color="#22c55e" subtitle="Success rate 91%" />
        <StatsCard icon={Truck}      label="Active Fleet"    value="24"     change="3 new"   color="#3b82f6" subtitle="6 on route now" />
        <StatsCard icon={DollarSign} label="Revenue"         value="$62K"   change="18.2%"  color="#a855f7" subtitle="Feb 2025" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Shipment trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Shipment Trends</h3>
            <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_STATS}>
              <defs>
                <linearGradient id="shipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="delGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }} />
              <Area type="monotone" dataKey="shipments" name="Total" stroke="#f97316" fill="url(#shipGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#22c55e" fill="url(#delGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue bar */}
        <div className="card">
          <h3 className="font-heading font-semibold mb-4">Revenue (USD)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Driver Status + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Drivers */}
        <div className="card">
          <h3 className="font-heading font-semibold mb-4">Driver Status</h3>
          <div className="space-y-3">
            {DRIVERS.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${driverStatusColor[d.status]}20`, color: driverStatusColor[d.status] }}>
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.vehicle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge" style={{ background: `${driverStatusColor[d.status]}20`, color: driverStatusColor[d.status] }}>
                    {driverStatusLabel[d.status]}
                  </span>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{d.deliveries} deliveries</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card">
          <h3 className="font-heading font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {NOTIFICATIONS.map(n => {
              const colors = { alert: '#ef4444', success: '#22c55e', info: '#3b82f6', warning: '#eab308' };
              const icons = { alert: AlertTriangle, success: CheckCircle, info: Clock, warning: AlertTriangle };
              const Icon = icons[n.type];
              return (
                <div key={n.id} className="flex gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${colors[n.type]}15` }}>
                    <Icon size={14} style={{ color: colors[n.type] }} />
                  </div>
                  <div>
                    <p className="text-xs leading-snug">{n.message}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
