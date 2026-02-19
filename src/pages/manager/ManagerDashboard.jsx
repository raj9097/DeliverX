import React from 'react';
import { Package, TrendingUp, AlertCircle, Users } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import ShipmentsTable from '../../components/common/ShipmentsTable';

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Package}     label="Region Shipments" value="847"   change="7.2%"  color="#3b82f6" subtitle="East Region" />
        <StatsCard icon={TrendingUp}  label="Delivery Rate"   value="92.4%"  change="1.8%"  color="#22c55e" subtitle="This week" />
        <StatsCard icon={AlertCircle} label="Pending Review"  value="23"     changeType="down" change="5" color="#eab308" subtitle="Need action" />
        <StatsCard icon={Users}       label="Active Staff"    value="18"     change="2 new"  color="#a855f7" subtitle="Online now" />
      </div>

      <div>
        <h2 className="font-heading font-semibold text-lg mb-3">Shipment Overview</h2>
        <ShipmentsTable canEdit />
      </div>
    </div>
  );
}
