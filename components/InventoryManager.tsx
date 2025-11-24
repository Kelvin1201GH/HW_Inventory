import React, { useState } from 'react';
import { InventoryItem, HardwareCategory, ItemStatus } from '../types';
import { Plus, Search, Trash2, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, onAddItem, onDeleteItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    category: HardwareCategory.LAPTOP,
    status: ItemStatus.ACTIVE,
    warrantyPeriodYears: 3
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'warrantyPeriodYears' || name === 'cost' ? parseFloat(value) : value
    }));
  };

  const calculateExpiry = (purchaseDate: string, years: number) => {
    if (!purchaseDate) return '';
    const date = new Date(purchaseDate);
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.vendor || !newItem.purchaseDate) return;

    const purchaseDate = newItem.purchaseDate;
    const warrantyYears = newItem.warrantyPeriodYears || 1;
    const expirationDate = calculateExpiry(purchaseDate, warrantyYears);

    const item: InventoryItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      category: newItem.category as HardwareCategory,
      vendor: newItem.vendor,
      purchaseDate: purchaseDate,
      warrantyPeriodYears: warrantyYears,
      warrantyExpirationDate: expirationDate,
      serialNumber: newItem.serialNumber || 'N/A',
      cost: newItem.cost || 0,
      status: newItem.status as ItemStatus,
    };

    onAddItem(item);
    setIsModalOpen(false);
    setNewItem({ category: HardwareCategory.LAPTOP, status: ItemStatus.ACTIVE, warrantyPeriodYears: 3 });
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Assets</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Purchase Date</th>
                <th className="px-6 py-4">Warranty Exp.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isExpired = new Date(item.warrantyExpirationDate) < new Date();
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">SN: {item.serialNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.vendor}</td>
                      <td className="px-6 py-4">{item.purchaseDate}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                          {item.warrantyExpirationDate}
                          {isExpired && <AlertCircle className="h-4 w-4" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                           ${item.status === ItemStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                             item.status === ItemStatus.IN_REPAIR ? 'bg-yellow-100 text-yellow-800' : 
                             'bg-slate-100 text-slate-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onDeleteItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Add New Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                <input required name="name" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. MacBook Pro M2" onChange={handleInputChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={handleInputChange}>
                  {Object.values(HardwareCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                <input required name="vendor" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Dell, CDW" onChange={handleInputChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
                <input required type="date" name="purchaseDate" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={handleInputChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Warranty (Years)</label>
                <input required type="number" min="0" step="1" name="warrantyPeriodYears" defaultValue={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={handleInputChange} />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                <input name="serialNumber" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Optional" onChange={handleInputChange} />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
                <input type="number" min="0" name="cost" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" onChange={handleInputChange} />
              </div>
              
              <div className="col-span-2 pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};