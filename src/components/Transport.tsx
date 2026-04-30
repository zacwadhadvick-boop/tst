import React from 'react';
import { Truck, MapPin, ClipboardList, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const Transport: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Logistics & Dispatches</h1>
          <p className="text-gray-500 mt-1">Track LR (Lorry Receipts) and vehicle status</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700">
            <ClipboardList size={18} /> New Dispatch LR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Truck size={28} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase">On the Way</p>
              <h4 className="text-2xl font-bold">12 Shipments</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <MapPin size={28} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Pending Delivery</p>
              <h4 className="text-2xl font-bold">45 Regions</h4>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <CheckCircle2 size={28} />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Freight</p>
              <h4 className="text-2xl font-bold">{formatCurrency(45000)}</h4>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-gray-900">Transport Register (Last 30 Days)</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
              <th className="px-6 py-4">LR Number</th>
              <th className="px-6 py-4">Transporter</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Vehicle No</th>
              <th className="px-6 py-4">Freight</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { lr: 'LR-SUR-501', transporter: 'Anil Roadlines', customer: 'Elite Garments', vehicle: 'GJ-05-YT-2101', freight: 1200, status: 'In Transit' },
              { lr: 'LR-LUD-502', transporter: 'Bharat Cargo', customer: 'Fashion Hub', vehicle: 'PB-10-BX-9982', freight: 2500, status: 'Delivered' },
              { lr: 'LR-MUM-503', transporter: 'Safe Logistics', customer: 'Global Textiles', vehicle: 'MH-01-AX-3300', freight: 1800, status: 'Pending' }
            ].map(row => (
              <tr key={row.lr} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.lr}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.transporter}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.customer}</td>
                <td className="px-6 py-4 text-[11px] font-mono font-bold text-gray-500">{row.vehicle}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(row.freight)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    row.status === 'In Transit' ? "bg-blue-50 text-blue-600" : 
                    row.status === 'Delivered' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
