import React, { useState } from 'react';
import { ClipboardList, Package, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import ShipmentsTable from '../../components/common/ShipmentsTable';

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={ClipboardList} label="Registered Today" value="34"   color="#a855f7" subtitle="By you" />
        <StatsCard icon={Clock}         label="In Queue"         value="12"   color="#eab308" subtitle="Awaiting processing" />
        <StatsCard icon={Package}       label="Processed"        value="128"  color="#3b82f6" subtitle="This week" />
        <StatsCard icon={CheckCircle}   label="Dispatched"       value="98"   color="#22c55e" subtitle="This week" />
      </div>

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
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Sender Name', 'text', 'Full name'],
              ['Sender Phone', 'tel', '+1 555-0000'],
              ['Recipient Name', 'text', 'Full name'],
              ['Recipient Phone', 'tel', '+1 555-0001'],
              ['Origin Address', 'text', 'Street, City, State'],
              ['Destination Address', 'text', 'Street, City, State'],
              ['Package Weight (kg)', 'number', '0.0'],
              ['Package Dimensions', 'text', 'L×W×H cm'],
            ].map(([l, t, p]) => (
              <div key={l}>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{l}</label>
                <input type={t} placeholder={p} className="input-field" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
              <select className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Service Type</label>
              <select className="input-field">
                <option>Standard (3-5 days)</option>
                <option>Express (1-2 days)</option>
                <option>Same Day</option>
              </select>
            </div>
          </div>
          <div className="mt-2 col-span-2">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea className="input-field" rows={2} placeholder="Special handling instructions…" />
          </div>
          <button className="btn-primary mt-5 w-full">Generate Tracking & Register</button>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="card animate-fade-in">
          <h3 className="font-heading font-semibold mb-4">Processing Queue</h3>
          <ShipmentsTable canEdit />
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
