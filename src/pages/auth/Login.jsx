import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Truck, Package, MapPin, X } from 'lucide-react';
import { SHIPMENTS } from '../../utils/mockData';

export default function Login() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Public Tracking State
  const [trackingId, setTrackingId] = useState('');
  const [foundShipment, setFoundShipment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = login(email, password);
    if (!success) setLoading(false);
  };

  const handleTrack = () => {
    if (!trackingId.trim()) return;
    const shipment = SHIPMENTS.find(s => s.tracking.toLowerCase() === trackingId.toLowerCase());
    if (shipment) {
      setFoundShipment(shipment);
    } else {
      alert('Shipment not found. Please check Tracking ID.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>


        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-xl shadow-lg shadow-orange-500/20"
              style={{ background: 'var(--accent)' }}>DX</div>
            <span className="font-display text-2xl tracking-wider text-white">DELIVERX</span>
          </div>

          <h2 className="font-display text-6xl leading-none tracking-wide mb-8 text-white">
            SHIP<br />SMARTER.<br />
            <span style={{ color: 'var(--accent)' }}>DELIVER</span><br />FASTER.
          </h2>

          <div className="mb-10 max-w-sm">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 block">Track your shipment</label>
            <div className="flex gap-2 p-1.5 rounded-xl border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
              <input
                className="flex-1 bg-transparent border-none text-sm text-white px-3 focus:outline-none placeholder-zinc-600"
                placeholder="Enter tracking ID (e.g. DX-7842-KL)"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
              />
              <button
                onClick={handleTrack}
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                TRACK
              </button>
            </div>
          </div>

          <p className="text-sm max-w-sm leading-relaxed text-zinc-400">
            End-to-end shipment management for modern logistics teams. Track, manage, and optimize every delivery in real time.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[['2,847', 'Shipments/mo'], ['94.2%', 'On-time rate'], ['24', 'Active vehicles']].map(([v, l]) => (
            <div key={l} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="font-display text-2xl" style={{ color: 'var(--accent)' }}>{v}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-xl"
              style={{ background: 'var(--accent)' }}>DX</div>
            <span className="font-display text-2xl tracking-wider" style={{ color: 'var(--accent)' }}>DELIVERX</span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to your DeliverX account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field pl-9" placeholder="you@deliverx.com" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field pl-9 pr-10" placeholder="Your password" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Truck size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo accounts */}

        </div>
      </div>
      {/* Public Tracking Modal */}
      {foundShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
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
          </div>
        </div>
      )}
    </div>
  );
}
