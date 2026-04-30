import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, User, MapPin, CreditCard, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { storage } from '../lib/storage';
import { Customer } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { exportToExcel, exportToPDF } from '../lib/export';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  // ... existing states ...

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'excel') {
      const data = customers.map(c => ({
        Name: c.name,
        GSTIN: c.gstin,
        City: c.city,
        Region: c.region,
        Outstanding: c.outstanding
      }));
      exportToExcel(data, 'Customers_List');
    } else {
      const headers = ['Firm Name', 'GSTIN', 'Location', 'Outstanding'];
      const rows = customers.map(c => [
        c.name,
        c.gstin,
        `${c.city}, ${c.region}`,
        formatCurrency(c.outstanding)
      ]);
      exportToPDF(headers, rows, 'Customers_Ledger', 'Customer Balance Report');
    }
    setShowExportOptions(false);
  };
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    gstin: '',
    city: '',
    region: 'North',
    type: 'Wholesaler',
    creditLimit: 500000,
    outstanding: 0
  });

  const loadCustomers = () => {
    setCustomers(storage.getCustomers());
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCustomer as Customer,
      id: Math.random().toString(36).substr(2, 9),
    };
    storage.saveCustomer(customer);
    loadCustomers();
    setIsAdding(false);
    setNewCustomer({ name: '', gstin: '', city: '', region: 'North', type: 'Wholesaler', creditLimit: 500000, outstanding: 0 });
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative">
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Register New Customer</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/60 hover:text-white">Close</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Firm Name</label>
                <input required className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">GSTIN</label>
                <input required className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                  onChange={e => setNewCustomer({...newCustomer, gstin: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                  <input required className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewCustomer({...newCustomer, city: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Credit Limit</label>
                  <input type="number" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewCustomer({...newCustomer, creditLimit: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold mt-4 shadow-xl shadow-blue-500/20">
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wholesale Customers</h1>
          <p className="text-gray-500 mt-1">Manage B2B retailers and distributors</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={18} className="text-gray-400" />
              Export
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                <button onClick={() => handleExport('pdf')} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700">
                  <FileText size={16} className="text-red-500" /> Download PDF
                </button>
                <button onClick={() => handleExport('excel')} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700">
                  <FileSpreadsheet size={16} className="text-emerald-500" /> Download Excel
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700"
          >
            <Plus size={18} /> New Customer
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search customers by name, city or GSTIN..."
          className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <User size={24} />
              </div>
              <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase">
                {customer.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{customer.name}</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={14} /> {customer.city}, {customer.region}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard size={14} /> Limit: {formatCurrency(customer.creditLimit)}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Outstanding</p>
                <p className={cn("text-lg font-extrabold", customer.outstanding > 100000 ? "text-red-500" : "text-gray-900")}>
                  {formatCurrency(customer.outstanding)}
                </p>
              </div>
              <button className="text-blue-600 text-xs font-bold hover:underline">View Ledger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
