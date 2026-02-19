import React, { useState } from 'react';
import { Bell, Search, X, Package, MapPin, Calendar, Truck } from 'lucide-react';
import { NOTIFICATIONS, SHIPMENTS } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ pageTitle }) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [foundShipment, setFoundShipment] = useState(null);
  const unread = NOTIFICATIONS.length;

  const typeIcon = { alert: '🔴', success: '🟢', info: '🔵', warning: '🟡' };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const shipment = SHIPMENTS.find(s => s.tracking.toLowerCase() === trackingId.toLowerCase());
    if (shipment) {
      setFoundShipment(shipment);
    } else {
      alert('Shipment not found. Please check the tracking ID.');
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', height: 64 }}>
      <div>
        <h1 className="font-heading text-xl font-semibold tracking-wide">{pageTitle}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search tracking ID..."
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            style={{ width: 220, height: 36 }}
          />
        </form>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg transition-colors"
            style={{ background: showNotifs ? 'var(--accent-dim)' : 'transparent', border: '1px solid var(--border)' }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ background: 'var(--accent)', fontSize: 9 }}>
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 z-50 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
              style={{ width: 340, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold text-sm">Notifications</span>
                <button onClick={() => setShowNotifs(false)}><X size={16} /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className="p-3 border-b hover:bg-zinc-800 transition-colors"
                    style={{ borderColor: 'rgba(42,42,46,0.5)' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">{typeIcon[n.type]}</span>
                      <div>
                        <p className="text-xs leading-snug">{n.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '2px solid var(--accent)' }}>
          {user?.avatar}
        </div>
      </div>

      {/* Tracking Modal */}
      {foundShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => { setFoundShipment(null); setTrackingId(''); }}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} className="text-zinc-400" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <Package size={32} className="text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">{foundShipment.tracking}</h2>
              <p className="text-sm text-zinc-400 mt-1">Via {foundShipment.driver === 'Unassigned' ? 'Pending Assignment' : foundShipment.driver}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                <div className="text-center flex-1">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 capitalize
                     ${foundShipment.status === 'delivered' ? 'text-green-400 bg-green-400/10' :
                      foundShipment.status === 'transit' ? 'text-blue-400 bg-blue-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                    {foundShipment.status}
                  </span>
                </div>
                <div className="w-px h-8 bg-zinc-700"></div>
                <div className="text-center flex-1">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Est. Delivery</p>
                  <p className="text-sm font-mono text-white">{foundShipment.eta}</p>
                </div>
              </div>

              <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                <div className="relative">
                  <span className="absolute -left-8 w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                    <MapPin size={10} className="text-zinc-400" />
                  </span>
                  <p className="text-xs text-zinc-500 font-bold mb-0.5">ORIGIN</p>
                  <p className="text-sm text-white">{foundShipment.origin}</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-8 w-6 h-6 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                    <MapPin size={10} className="text-orange-500" />
                  </span>
                  <p className="text-xs text-zinc-500 font-bold mb-0.5">DESTINATION</p>
                  <p className="text-sm text-white">{foundShipment.destination}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                  {foundShipment.customer.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{foundShipment.customer}</p>
                  <p className="text-[10px] text-zinc-500">Customer</p>
                </div>
              </div>
              <button className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
                View Full Details <Truck size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
