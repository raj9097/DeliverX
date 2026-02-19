import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import ShipmentsTable from '../common/ShipmentsTable';

// Role dashboards
import AdminDashboard from '../../pages/admin/AdminDashboard';
import UsersManagement from '../../pages/admin/UsersManagement';
import Analytics from '../../pages/admin/Analytics';
import Fleet from '../../pages/admin/Fleet';
import ManagerDashboard from '../../pages/manager/ManagerDashboard';
import ClerkDashboard from '../../pages/clerk/ClerkDashboard';
import DriverDashboard from '../../pages/driver/DriverDashboard';
import DeliveryDashboard from '../../pages/delivery/DeliveryDashboard';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  shipments: 'Shipments',
  'all-shipments': 'All Shipments',
  fleet: 'Fleet & Drivers',
  users: 'User Management',
  analytics: 'Analytics',
  warehouses: 'Warehouses',
  settings: 'Settings',
  queue: 'Processing Queue',
  route: 'My Route',
  map: 'Live Map',
  pod: 'Proof of Delivery',
};

function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
      <div className="text-6xl mb-4 opacity-20">🚧</div>
      <h2 className="font-heading text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>{title}</h2>
      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>This section is under construction</p>
    </div>
  );
}

function getContent(role, page) {
  // Admin
  if (role === ROLES.ADMIN) {
    if (page === 'dashboard') return <AdminDashboard />;
    if (page === 'shipments') return <ShipmentsTable canCreate canEdit canDelete />;
    if (page === 'fleet') return <Fleet />;
    if (page === 'users') return <UsersManagement />;
    if (page === 'analytics') return <Analytics />;
    return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
  }
  // Manager
  if (role === ROLES.MANAGER) {
    if (page === 'dashboard') return <ManagerDashboard />;
    if (page === 'shipments') return <ShipmentsTable canEdit />;
    if (page === 'fleet') return <Fleet />;
    if (page === 'analytics') return <Analytics />;
    if (page === 'users') return <UsersManagement />;
    return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
  }
  // Clerk
  if (role === ROLES.CLERK) {
    if (page === 'dashboard') return <ClerkDashboard />;
    if (page === 'shipments') return <ClerkDashboard />;
    if (page === 'all-shipments') return <ShipmentsTable />;
    if (page === 'queue') return <ShipmentsTable canEdit />;
    return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
  }
  // Driver
  if (role === ROLES.DRIVER) {
    if (page === 'dashboard' || page === 'shipments' || page === 'route') return <DriverDashboard />;
    return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
  }
  // Delivery
  if (role === ROLES.DELIVERY) {
    if (page === 'dashboard' || page === 'shipments' || page === 'pod') return <DeliveryDashboard />;
    return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
  }
  return <PlaceholderPage title="Page Not Found" />;
}

export default function AppShell() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar pageTitle={PAGE_TITLES[activePage] || activePage} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6" style={{ background: 'var(--bg-primary)' }}>
          {getContent(user?.role, activePage)}
        </main>
      </div>
    </div>
  );
}
