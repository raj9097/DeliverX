import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CLERK: 'clerk',
  DRIVER: 'driver',
  DELIVERY: 'delivery',
};

const DEMO_USERS = [
  { id: 1, name: 'Alex Rivera',    email: 'admin@deliverx.com',    password: 'admin123',   role: ROLES.ADMIN,    avatar: 'AR', department: 'Operations HQ' },
  { id: 2, name: 'Morgan Chen',    email: 'manager@deliverx.com',  password: 'manager123', role: ROLES.MANAGER,  avatar: 'MC', department: 'Regional East' },
  { id: 3, name: 'Jordan Smith',   email: 'clerk@deliverx.com',    password: 'clerk123',   role: ROLES.CLERK,    avatar: 'JS', department: 'Intake & Processing' },
  { id: 4, name: 'Taylor Quinn',   email: 'driver@deliverx.com',   password: 'driver123',  role: ROLES.DRIVER,   avatar: 'TQ', department: 'Route 7 – North' },
  { id: 5, name: 'Casey Park',     email: 'delivery@deliverx.com', password: 'delivery123',role: ROLES.DELIVERY, avatar: 'CP', department: 'Last Mile – Zone 3' },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(DEMO_USERS);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      setError('');
      return true;
    }
    setError('Invalid credentials.');
    return false;
  };

  const logout = () => setUser(null);

  const addUser = (newUser) => {
    // Generate simple ID
    const id = users.length + 1;
    setUsers([...users, { ...newUser, id }]);
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { DEMO_USERS };
