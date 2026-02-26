import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import AppShell from './components/common/AppShell';
import { initializeData } from './utils/mockData';

function AppContent() {
  const { user } = useAuth();
  return user ? <AppShell /> : <Login />;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeData().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
