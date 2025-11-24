import React, { useState } from 'react';
import { InventoryItem, View, HardwareCategory, ItemStatus } from './types';
import { Dashboard } from './components/Dashboard';
import { InventoryManager } from './components/InventoryManager';
import { AIAssistant } from './components/AIAssistant';
import { LayoutDashboard, List, MessageSquareText, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Initial Mock Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Dell XPS 15',
      category: HardwareCategory.LAPTOP,
      vendor: 'Dell Enterprise',
      purchaseDate: '2023-01-15',
      warrantyPeriodYears: 3,
      warrantyExpirationDate: '2026-01-15',
      serialNumber: 'DXP-99283',
      cost: 2199,
      status: ItemStatus.ACTIVE
    },
    {
      id: '2',
      name: 'Cisco Meraki MR46',
      category: HardwareCategory.NETWORKING,
      vendor: 'CDW',
      purchaseDate: '2021-06-10',
      warrantyPeriodYears: 5,
      warrantyExpirationDate: '2026-06-10',
      serialNumber: 'Q2KD-99A1-X',
      cost: 850,
      status: ItemStatus.ACTIVE
    },
    {
      id: '3',
      name: 'MacBook Pro 14"',
      category: HardwareCategory.LAPTOP,
      vendor: 'Apple Business',
      purchaseDate: '2022-03-01',
      warrantyPeriodYears: 1,
      warrantyExpirationDate: '2023-03-01', // Expired
      serialNumber: 'FVFX9283',
      cost: 1999,
      status: ItemStatus.IN_REPAIR
    },
    {
      id: '4',
      name: 'HP ProLiant Server',
      category: HardwareCategory.SERVER,
      vendor: 'HPE',
      purchaseDate: '2020-05-20',
      warrantyPeriodYears: 4,
      warrantyExpirationDate: '2024-05-20', // Expiring Soon/Expired
      serialNumber: 'HP-SRV-001',
      cost: 4500,
      status: ItemStatus.ACTIVE
    },
     {
      id: '5',
      name: 'Samsung 34" Monitor',
      category: HardwareCategory.PERIPHERAL,
      vendor: 'Amazon Business',
      purchaseDate: '2023-11-05',
      warrantyPeriodYears: 2,
      warrantyExpirationDate: '2025-11-05',
      serialNumber: 'SAM-34-W',
      cost: 450,
      status: ItemStatus.ACTIVE
    }
  ]);

  const handleAddItem = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <ShieldCheck className="text-indigo-500 h-6 w-6" />
            <span>TechTrack</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <SidebarItem 
            active={currentView === 'inventory'} 
            onClick={() => setCurrentView('inventory')} 
            icon={<List size={20} />} 
            label="Inventory" 
          />
          <SidebarItem 
            active={currentView === 'assistant'} 
            onClick={() => setCurrentView('assistant')} 
            icon={<MessageSquareText size={20} />} 
            label="AI Assistant" 
          />
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          &copy; 2024 TechTrack Systems
        </div>
      </aside>

      {/* Mobile Header / Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Nav */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="text-indigo-500 h-6 w-6" />
            <span>TechTrack</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'}><LayoutDashboard size={20}/></button>
             <button onClick={() => setCurrentView('inventory')} className={currentView === 'inventory' ? 'text-indigo-400' : 'text-slate-400'}><List size={20}/></button>
             <button onClick={() => setCurrentView('assistant')} className={currentView === 'assistant' ? 'text-indigo-400' : 'text-slate-400'}><MessageSquareText size={20}/></button>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard inventory={inventory} />}
            {currentView === 'inventory' && (
              <InventoryManager 
                inventory={inventory} 
                onAddItem={handleAddItem} 
                onDeleteItem={handleDeleteItem} 
              />
            )}
            {currentView === 'assistant' && <AIAssistant inventory={inventory} />}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default App;
