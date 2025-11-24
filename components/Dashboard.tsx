import React from 'react';
import { InventoryItem, ItemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Monitor, AlertTriangle, CheckCircle, Package } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory }) => {
  // Stats Calculation
  const totalAssets = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.cost || 0), 0);
  
  const expiredWarrantyCount = inventory.filter(i => new Date(i.warrantyExpirationDate) < new Date()).length;
  const activeCount = inventory.filter(i => i.status === ItemStatus.ACTIVE).length;

  // Chart Data Preparation
  const categoryData = Object.entries(
    inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    inventory.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={totalAssets.toString()} 
          icon={<Monitor className="text-indigo-600" />} 
          trend="Hardware Items"
        />
        <StatCard 
          title="Total Value" 
          value={`$${totalValue.toLocaleString()}`} 
          icon={<Package className="text-emerald-600" />} 
          trend="Total Investment"
        />
        <StatCard 
          title="Warranty Expired" 
          value={expiredWarrantyCount.toString()} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="Requires Attention"
          alert={expiredWarrantyCount > 0}
        />
        <StatCard 
          title="Active Units" 
          value={activeCount.toString()} 
          icon={<CheckCircle className="text-blue-600" />} 
          trend="Deployed"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Assets by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, alert = false }: { title: string, value: string, icon: React.ReactNode, trend: string, alert?: boolean }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border ${alert ? 'border-rose-200 bg-rose-50' : 'border-slate-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${alert ? 'bg-rose-100' : 'bg-slate-100'}`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-slate-500">{title}</h4>
      <p className={`text-2xl font-bold ${alert ? 'text-rose-700' : 'text-slate-800'}`}>{value}</p>
      <p className="text-xs text-slate-400">{trend}</p>
    </div>
  </div>
);
