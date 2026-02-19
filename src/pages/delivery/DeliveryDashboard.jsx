import React, { useState } from 'react';
import { Package, CheckCircle, XCircle, Camera, MapPin, Clock, User, Phone, Pen } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import { SHIPMENTS } from '../../utils/mockData';

const myParcels = SHIPMENTS.filter(s => s.driver === 'Casey Park');

export default function DeliveryDashboard() {
  const [parcels, setParcels] = useState(myParcels);
  const [podModal, setPodModal] = useState(null);
  const [signature, setSignature] = useState('');

  const confirmDelivery = (id) => {
    setParcels(prev => prev.map(p => p.id === id ? { ...p, status: 'delivered' } : p));
    setPodModal(null);
    setSignature('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Package}     label="Assigned Parcels" value={parcels.length}               color="#f97316" />
        <StatsCard icon={CheckCircle} label="Delivered"         value={parcels.filter(p=>p.status==='delivered').length} color="#22c55e" subtitle="Today" />
        <StatsCard icon={XCircle}     label="Failed/Returned"  value={parcels.filter(p=>p.status==='failed').length}    color="#ef4444" subtitle="Today" />
        <StatsCard icon={Clock}       label="Remaining"         value={parcels.filter(p=>['pending','transit'].includes(p.status)).length} color="#eab308" subtitle="To deliver" />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading font-semibold text-lg">Today's Deliveries</h2>
        {parcels.map((p, i) => {
          const done = p.status === 'delivered';
          const failed = p.status === 'failed';
          return (
            <div key={p.id} className="card animate-fade-in" style={{
              animationDelay: `${i*0.08}s`,
              borderColor: done ? 'rgba(34,197,94,0.3)' : failed ? 'rgba(239,68,68,0.3)' : 'var(--border)',
              opacity: done ? 0.7 : 1
            }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>{p.tracking}</span>
                    <span className={done ? 'status-delivered' : failed ? 'status-failed' : 'status-transit'}>
                      {done ? '✓ Delivered' : failed ? '✕ Failed' : '▶ In Transit'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <User size={12} />{p.customer}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={12} />+1 555-{1000 + i}
                    </div>
                    <div className="flex items-center gap-2 text-xs col-span-2" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin size={12} style={{ color: 'var(--accent)' }} />{p.destination}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Package size={12} />{p.weight}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Clock size={12} />ETA: {p.eta}
                    </div>
                  </div>
                </div>
                {!done && !failed && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setParcels(prev => prev.map(x => x.id === p.id ? {...x, status:'failed'} : x))}
                      className="btn-ghost text-xs py-1.5 flex items-center gap-1" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                      <XCircle size={13} /> Failed
                    </button>
                    <button onClick={() => setPodModal(p)}
                      className="btn-primary text-xs py-1.5 flex items-center gap-1">
                      <CheckCircle size={13} /> Confirm Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* POD Modal */}
      {podModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="card w-full max-w-md animate-fade-in" style={{ padding: 28 }}>
            <h2 className="font-heading text-xl font-bold mb-1">Proof of Delivery</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{podModal.tracking} · {podModal.customer}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Recipient Name</label>
                <input type="text" placeholder="Name of person who received" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Signature</label>
                <div className="input-field h-16 flex items-center justify-center cursor-pointer"
                  style={{ borderStyle: 'dashed' }} onClick={() => setSignature('Signed')}>
                  {signature
                    ? <p className="font-mono text-sm" style={{ color: '#22c55e' }}>✓ Signature captured</p>
                    : <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}><Pen size={14} /> Click to capture signature</div>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Photo Evidence</label>
                <div className="input-field h-14 flex items-center justify-center cursor-pointer" style={{ borderStyle: 'dashed' }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Camera size={14} /> Upload delivery photo
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                <textarea className="input-field" rows={2} placeholder="Left at door, handed to neighbour, etc." />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button className="btn-primary flex-1" onClick={() => confirmDelivery(podModal.id)}>Submit POD</button>
              <button className="btn-ghost flex-1" onClick={() => setPodModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
