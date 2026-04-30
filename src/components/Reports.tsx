import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Users, Package, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { exportToExcel, exportToPDF } from '../lib/export';
import { storage } from '../lib/storage';

const DATA = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 2000, profit: 9800 },
  { month: 'Apr', sales: 2780, profit: 3908 },
  { month: 'May', sales: 1890, profit: 4800 },
  { month: 'Jun', sales: 2390, profit: 3800 },
];

export const Reports: React.FC = () => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExportSales = (type: 'pdf' | 'excel') => {
    const sales = storage.getSales();
    if (type === 'excel') {
      const data = sales.map(s => ({
        Invoice: s.invoiceNumber,
        Customer: s.customerName,
        Date: new Date(s.date).toLocaleDateString(),
        Total: s.grandTotal,
        Status: s.paymentStatus
      }));
      exportToExcel(data, 'Sales_Report');
    } else {
      const headers = ['Invoice', 'Customer', 'Date', 'Total', 'Status'];
      const rows = sales.map(s => [
        s.invoiceNumber,
        s.customerName,
        new Date(s.date).toLocaleDateString(),
        formatCurrency(s.grandTotal),
        s.paymentStatus
      ]);
      exportToPDF(headers, rows, 'Sales_Report', 'Monthly Sales Report');
    }
    setShowExportOptions(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Analytics</h1>
          <p className="text-gray-500 mt-1">Deep insights into brand performance and sales trends</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700"
          >
            <Download size={18} /> Export All Data
          </button>
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
              <button onClick={() => handleExportSales('pdf')} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700">
                <FileText size={16} className="text-red-500" /> Download PDF
              </button>
              <button onClick={() => handleExportSales('excel')} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700">
                <FileSpreadsheet size={16} className="text-emerald-500" /> Download Excel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
             <TrendingUp size={20} className="text-blue-600" />
             Revenue Growth
           </h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA}>
                 <defs>
                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                 <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="sales" stroke="#1E3A8A" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
             <Package size={20} className="text-indigo-600" />
             Brand Performance (Qty Sold)
           </h3>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={DATA}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                 <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[
           { label: 'Most Sold Brand', value: 'Levi\'s', sub: '12,450 Units' },
           { label: 'Fastest Moving Size', value: 'L (Large)', sub: '35% of Total' },
           { label: 'Top Region', value: 'Maharashtra', sub: '42% Sales Vol' }
         ].map((item, idx) => (
           <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.label}</p>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-1">{item.value}</h4>
              <p className="text-sm font-bold text-blue-600">{item.sub}</p>
           </div>
         ))}
      </div>
    </div>
  );
};
