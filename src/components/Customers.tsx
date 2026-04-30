import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, User, MapPin, CreditCard } from 'lucide-react';
import { storage } from '../lib/storage';
import { Customer } from '../types';
import { formatCurrency } from '../lib/utils';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wholesale Customers</h1>
          <p className="text-gray-500 mt-1">Manage B2B retailers and distributors</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700">
          <Plus size={18} /> New Customer
        </button>
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

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
