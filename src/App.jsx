import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import AppShell from './components/common/AppShell';

function AppContent() {
  const { user } = useAuth();
  return user ? <AppShell /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
