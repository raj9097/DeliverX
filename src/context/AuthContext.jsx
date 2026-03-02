import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CLERK: 'clerk',
  DRIVER: 'driver',
  DELIVERY: 'delivery',
};

// Demo users for fallback when API is not available
const DEMO_USERS = [
  { _id: '1', id: 1, name: 'Alex Rivera',    email: 'admin@deliverx.com',    password: 'admin123',   role: ROLES.ADMIN,    avatar: 'AR', department: 'Operations HQ', status: 'active' },
  { _id: '2', id: 2, name: 'Morgan Chen',    email: 'manager@deliverx.com',  password: 'manager123', role: ROLES.MANAGER,  avatar: 'MC', department: 'Regional East', status: 'active' },
  { _id: '3', id: 3, name: 'Jordan Smith',   email: 'clerk@deliverx.com',    password: 'clerk123',   role: ROLES.CLERK,    avatar: 'JS', department: 'Intake & Processing', status: 'active' },
  { _id: '4', id: 4, name: 'Taylor Quinn',   email: 'driver@deliverx.com',   password: 'driver123',  role: ROLES.DRIVER,   avatar: 'TQ', department: 'Route 7 – North', status: 'active' },
  { _id: '5', id: 5, name: 'Casey Park',     email: 'delivery@deliverx.com', password: 'delivery123',role: ROLES.DELIVERY, avatar: 'CP', department: 'Last Mile – Zone 3', status: 'active' },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(DEMO_USERS);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Try to load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('deliverx_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('deliverx_user');
      }
    }
    setLoading(false);
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setUsers(data);
        }
      }
    } catch (err) {
      console.log('Using demo users - API not available');
    }
  };

  // Login function - tries API first, falls back to demo users
  const login = async (email, password) => {
    setError('');
    
    try {
      // Try API login first
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('deliverx_user', JSON.stringify(data.user));
        await fetchUsers();
        return true;
      }
      
      // If API fails, try demo users
      const errData = await res.json();
      
      // Check demo users as fallback
      const found = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (found) {
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem('deliverx_user', JSON.stringify(safeUser));
        return true;
      }
      
      setError(errData.error || 'Invalid credentials.');
      return false;
    } catch (err) {
      // Network error - try demo users
      const found = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (found) {
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem('deliverx_user', JSON.stringify(safeUser));
        return true;
      }
      
      setError('Unable to connect to server. Using demo mode.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deliverx_user');
  };

  const addUser = async (newUser) => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const createdUser = await res.json();
        setUsers(prev => [...prev, createdUser]);
        return createdUser;
      }
    } catch (err) {
      console.error('Failed to add user via API:', err);
    }
    
    // Fallback to local state
    const id = users.length + 1;
    const userWithId = { ...newUser, id, _id: String(id) };
    setUsers(prev => [...prev, userWithId]);
    return userWithId;
  };

  const updateUserInList = (updatedUser) => {
    setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
  };

  const removeUser = async (userId) => {
    try {
      await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setUsers(prev => prev.filter(u => u._id !== userId));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      addUser, 
      updateUserInList,
      removeUser,
      error,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
