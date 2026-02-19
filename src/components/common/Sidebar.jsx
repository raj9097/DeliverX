import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Truck, Users, BarChart3, Settings,
  LogOut, Bell, ChevronRight, MapPin, ClipboardList, Route,
  CheckSquare, UserCog, Building2, Menu, X
} from 'lucide-react';

const NAV_CONFIG = {
  [ROLES.ADMIN]: [
    { icon: LayoutDashboard, label: 'Dashboard',    id: 'dashboard' },
    { icon: Package,         label: 'Shipments',    id: 'shipments' },
    { icon: Truck,           label: 'Fleet & Drivers', id: 'fleet' },
    { icon: Users,           label: 'User Management', id: 'users' },
    { icon: BarChart3,       label: 'Analytics',    id: 'analytics' },
    { icon: Building2,       label: 'Warehouses',   id: 'warehouses' },
    { icon: Settings,        label: 'Settings',     id: 'settings' },
  ],
  [ROLES.MANAGER]: [
    { icon: LayoutDashboard, label: 'Dashboard',    id: 'dashboard' },
    { icon: Package,         label: 'Shipments',    id: 'shipments' },
    { icon: Truck,           label: 'Fleet',        id: 'fleet' },
    { icon: BarChart3,       label: 'Reports',      id: 'analytics' },
    { icon: UserCog,         label: 'Staff',        id: 'users' },
  ],
  [ROLES.CLERK]: [
    { icon: LayoutDashboard, label: 'Dashboard',    id: 'dashboard' },
    { icon: ClipboardList,   label: 'Register Shipment', id: 'shipments' },
    { icon: Package,         label: 'All Shipments', id: 'all-shipments' },
    { icon: CheckSquare,     label: 'Processing Queue', id: 'queue' },
  ],
  [ROLES.DRIVER]: [
    { icon: LayoutDashboard, label: 'Dashboard',    id: 'dashboard' },
    { icon: Route,           label: 'My Route',     id: 'route' },
    { icon: Package,         label: 'My Shipments', id: 'shipments' },
    { icon: MapPin,          label: 'Live Map',     id: 'map' },
  ],
  [ROLES.DELIVERY]: [
    { icon: LayoutDashboard, label: 'Dashboard',    id: 'dashboard' },
    { icon: Package,         label: 'Deliveries',   id: 'shipments' },
    { icon: CheckSquare,     label: 'Proof of Delivery', id: 'pod' },
    { icon: MapPin,          label: 'Navigation',   id: 'map' },
  ],
};

const ROLE_COLORS = {
  [ROLES.ADMIN]:    { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444', label: 'Administrator' },
  [ROLES.MANAGER]:  { bg: 'rgba(59,130,246,0.15)',  text: '#3b82f6', label: 'Manager' },
  [ROLES.CLERK]:    { bg: 'rgba(168,85,247,0.15)',  text: '#a855f7', label: 'Clerk' },
  [ROLES.DRIVER]:   { bg: 'rgba(34,197,94,0.15)',   text: '#22c55e', label: 'Driver' },
  [ROLES.DELIVERY]: { bg: 'rgba(249,115,22,0.15)',  text: '#f97316', label: 'Delivery Person' },
};

export default function Sidebar({ activePage, onPageChange }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = NAV_CONFIG[user?.role] || [];
  const roleStyle = ROLE_COLORS[user?.role] || {};

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg"
            style={{ background: 'var(--accent)', color: 'white' }}>
            DX
          </div>
          {!collapsed && (
            <div>
              <div className="font-display text-xl tracking-wider" style={{ color: 'var(--accent)' }}>
                DELIVERX
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Shipment Management</div>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: roleStyle.bg, color: roleStyle.text }}>
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.department}</div>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: roleStyle.bg, color: roleStyle.text }}>
              {roleStyle.label}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onPageChange(item.id); setMobileOpen(false); }}
            className={`sidebar-item w-full ${activePage === item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && activePage === item.id && (
              <ChevronRight size={14} className="ml-auto opacity-50" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full hidden lg:flex"
          title="Toggle sidebar"
        >
          <Menu size={18} />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button onClick={logout} className="sidebar-item w-full text-red-400 hover:text-red-400">
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)' }} />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 260, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{ background: 'var(--bg-card)' }}>
          <X size={16} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen flex-shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 72 : 260, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <SidebarContent />
      </div>
    </>
  );
}
