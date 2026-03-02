import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Search, X, UserCheck, UserX } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const roleColors = {
  admin: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  manager: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  clerk: { bg: 'rgba(168,85,247,0.1)', color: '#a855f7' },
  driver: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
  delivery: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', role: 'clerk', password: '', status: 'active'
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filtered = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => !search || 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle create/update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = editingUser 
        ? `${API_BASE}/users/${editingUser._id}`
        : `${API_BASE}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save user');
      }

      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Failed to save user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete user');
      }

      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.message);
    }
  };

  // Open modal for editing
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      department: user.department || '',
      role: user.role || 'clerk',
      password: '',
      status: user.status || 'active'
    });
    setShowModal(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '', email: '', department: '', role: 'clerk', password: '', status: 'active'
    });
    setError('');
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

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
          <button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', department: '', role: 'clerk', password: '', status: 'active' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">
                  No users found
                </td>
              </tr>
            ) : filtered.map(u => {
              const rc = roleColors[u.role] || {};
              const initials = u.avatar || (u.name ? u.name.substring(0, 2).toUpperCase() : 'U');
              return (
                <tr key={u._id} className="table-row">
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
                    <span className="badge flex items-center gap-1 w-fit" style={{
                      background: u.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)',
                      color: u.status === 'active' ? '#22c55e' : '#71717a'
                    }}>
                      {u.status === 'active' ? <UserCheck size={10} /> : <UserX size={10} />}
                      {u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(u)} className="p-1.5 rounded hover:bg-zinc-700" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded hover:text-red-400" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card w-full max-w-md animate-fade-in" style={{ padding: 28 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-zinc-700 rounded">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                    className="input-field"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Email *
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="john@deliverx.com" 
                    className="input-field"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Department
                  </label>
                  <input 
                    type="text" 
                    name="department"
                    value={formData.department} 
                    onChange={handleInputChange}
                    placeholder="Operations" 
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Role
                    </label>
                    <select 
                      name="role"
                      value={formData.role} 
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="clerk">Clerk</option>
                      <option value="driver">Driver</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Status
                    </label>
                    <select 
                      name="status"
                      value={formData.status} 
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Password {editingUser && '(leave blank to keep current)'}
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password} 
                    onChange={handleInputChange}
                    placeholder={editingUser ? "••••••••" : "Min 6 characters"} 
                    className="input-field"
                    required={!editingUser}
                    minLength={6}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
                <button 
                  type="button" 
                  className="btn-ghost flex-1" 
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
