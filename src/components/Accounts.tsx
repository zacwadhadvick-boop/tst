import React from 'react';
import { ShieldCheck, FileText, IndianRupee, PieChart as ChartIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const Accounts: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Accounts & Ledger</h1>
        <p className="text-gray-500 mt-1">Financial reconciliation and GST report management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 4850000, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Tax Collected', value: 242500, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Total Expenses', value: 1250000, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Net Profit', value: 3357500, icon: ChartIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map(item => (
          <div key={item.title} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className={`p-4 ${item.bg} ${item.color} rounded-2xl w-fit mb-4`}>
                <item.icon size={24} />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase mb-1">{item.title}</p>
             <h4 className="text-xl font-extrabold text-gray-900">{formatCurrency(item.value)}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-lg mb-6">GST Compliance (GSTR-1)</h3>
           <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-600">B2B Sales (Taxable)</span>
                 <span className="text-sm font-bold text-gray-900">{formatCurrency(3850000)}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-600">Inter-state Sales (IGST)</span>
                 <span className="text-sm font-bold text-gray-900">{formatCurrency(1200000)}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center text-emerald-600 font-bold">
                 <span className="text-sm">Net GST Payable</span>
                 <span className="text-sm">{formatCurrency(192500)}</span>
              </div>
           </div>
           <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20">
              Generate GST Report
           </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-lg mb-6">Expense Categories</h3>
           <div className="space-y-6">
              {[
                { name: 'Transport & Freight', value: 45000, color: 'bg-blue-500' },
                { name: 'Warehouse Rent', value: 85000, color: 'bg-indigo-500' },
                { name: 'Staff Salaries', value: 240000, color: 'bg-emerald-500' },
                { name: 'Utilities', value: 12000, color: 'bg-amber-500' }
              ].map(exp => (
                <div key={exp.name} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                      <span>{exp.name}</span>
                      <span>{formatCurrency(exp.value)}</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${exp.color}`} style={{ width: `${(exp.value/250000)*100}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
