import React from 'react';
import { MONTHLY_STATS, REVENUE_DATA } from '../../utils/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const Tooltip_ = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
  return null;
};

const PIE_DATA = [
  { name: 'Delivered', value: 580, color: '#22c55e' },
  { name: 'In Transit', value: 120, color: '#3b82f6' },
  { name: 'Pending',   value: 80,  color: '#eab308' },
  { name: 'Failed',    value: 40,  color: '#ef4444' },
];

export default function Analytics() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary cards */}
        {[
          { label: 'On-Time Rate', value: '94.2%', color: '#22c55e', desc: '+2.1% vs last month' },
          { label: 'Avg Delivery Time', value: '2.4d', color: '#3b82f6', desc: '-0.3 days vs last month' },
          { label: 'Failed Rate', value: '5.8%', color: '#ef4444', desc: '-1.2% vs last month' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{s.label}</p>
            <p className="text-4xl font-display mt-2" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-heading font-semibold mb-4">Monthly Shipment Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MONTHLY_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }} />
              <Bar dataKey="delivered" name="Delivered" fill="#22c55e" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-heading font-semibold mb-4">Shipment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<Tooltip_ />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
