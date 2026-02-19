import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Search } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

const roleColors = {
  admin: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  manager: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  clerk: { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' },
  driver: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  delivery: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
};

export default function UsersManagement() {
  const { users, addUser, user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', role: 'clerk', password: ''
  });

  const filtered = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.password) return;

    // Create new user mapping
    const newUser = {
      ...formData,
      avatar: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      status: 'active',
      joined: new Date().toISOString().split('T')[0]
    };

    addUser(newUser);
    setShowModal(false);
    setFormData({ name: '', email: '', department: '', role: 'clerk', password: '' });
  };

  const allowedRoles = currentUser?.role === ROLES.MANAGER
    ? [ROLES.CLERK, ROLES.DRIVER, ROLES.DELIVERY]
    : Object.values(ROLES);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search users…"
                value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, height: 36 }} />
            </div>
            <select className="input-field py-2 text-sm" value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)} style={{ height: 36, width: 160 }}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="clerk">Clerk</option>
              <option value="driver">Driver</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add User
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="table-header">
            <tr>
              {['User', 'Email', 'Role', 'Department', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                  style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = roleColors[u.role] || {};
              const initials = u.avatar || u.name.substring(0, 2).toUpperCase();
              return (
                <tr key={u.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: rc.bg, color: rc.color }}>{initials}</div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge flex items-center gap-1 w-fit"
                      style={{ background: rc.bg, color: rc.color }}>
                      <Shield size={10} /> {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{u.department || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="badge" style={{
                      background: (u.status || 'active') === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)',
                      color: (u.status || 'active') === 'active' ? '#22c55e' : '#71717a'
                    }}>
                      {(u.status || 'active') === 'active' ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{u.joined || '2023-01-01'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-zinc-700"><Edit2 size={13} /></button>
                      <button className="p-1.5 rounded hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-md animate-fade-in" style={{ padding: 28 }}>
            <h2 className="font-heading text-xl font-bold mb-5">Add New User</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" placeholder="John Doe" className="input-field"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" placeholder="john@deliverx.com" className="input-field"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Department</label>
                <input type="text" placeholder="Operations" className="input-field"
                  value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Role</label>
                <select className="input-field"
                  value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  {allowedRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input type="password" placeholder="Min 8 characters" className="input-field"
                  value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-primary flex-1" onClick={handleCreateUser}>Create User</button>
              <button className="btn-ghost flex-1" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
