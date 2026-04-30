import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  IndianRupee,
  Calendar,
  Layers,
  Truck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { storage } from '../lib/storage';
import { Sale } from '../types';

const SALES_DATA = [
  { name: 'Mon', sales: 42000 },
  { name: 'Tue', sales: 38000 },
  { name: 'Wed', sales: 52000 },
  { name: 'Thu', sales: 61000 },
  { name: 'Fri', sales: 48000 },
  { name: 'Sat', sales: 75000 },
  { name: 'Sun', sales: 25000 },
];

const CATEGORY_DATA = [
  { name: 'Men\'s Wear', value: 45 },
  { name: 'Women\'s Wear', value: 35 },
  { name: 'Kids\' Wear', value: 20 },
];

const PIE_COLORS = ['#1E3A8A', '#10B981', '#FF6B35'];

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, isPositive, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [recentSales, setRecentSales] = React.useState<Sale[]>([]);

  React.useEffect(() => {
    const sales = storage.getSales();
    setRecentSales(sales.slice(-5).reverse());
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">Executive Overview</h1>
          <p className="text-gray-500 mt-1">Real-time performance analytics for your garment wholesale business</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-gray-700 shadow-sm">
            <Calendar size={18} className="text-gray-400" />
            Last 7 Days
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Wholesale Sales" 
          value={formatCurrency(485000)} 
          trend="+12.5%" 
          isPositive={true} 
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard 
          title="Monthly Bulk Orders" 
          value="1,245" 
          trend="+8.2%" 
          isPositive={true} 
          icon={Layers}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Inventory Alert" 
          value="18 Items" 
          trend="Critical" 
          isPositive={false} 
          icon={AlertTriangle}
          color="bg-amber-500"
        />
        {/* Total Receivables and Transport Widget */}
        <div className="space-y-6">
          <StatCard 
            title="Total Receivables" 
            value={formatCurrency(842000)} 
            trend="-2.4%" 
            isPositive={false} 
            icon={IndianRupee}
            color="bg-indigo-500"
          />
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} className="text-blue-600" />
              Active Dispatches
            </h3>
            <div className="space-y-4">
              {[
                { id: 'LR-101', city: 'Surat', status: 'In Transit' },
                { id: 'LR-102', city: 'Ludhiana', status: 'Dispatched' }
              ].map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">{t.id}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{t.city}</p>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-gray-900">Revenue Analysis</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
              <span className="text-xs font-bold text-gray-500">Daily Sales Trend</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#1E3A8A" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 mb-2">Inventory Mix</h3>
          <p className="text-sm text-gray-400 mb-8">Allocation by product category</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto space-y-3">
            {CATEGORY_DATA.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products / Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">Recent Bulk Sales</h3>
          <button className="text-blue-600 text-xs font-bold hover:underline">View All Exports</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Qty</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic text-sm">
                    No sales recorded yet. Start billing in the Sales module.
                  </td>
                </tr>
              ) : recentSales.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{row.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.items.reduce((acc, item) => acc + Object.values(item.sizeQuantities).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0), 0)} Pcs
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(row.grandTotal)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      row.paymentStatus === 'Paid' ? "bg-emerald-50 text-emerald-600" : 
                      row.paymentStatus === 'Unpaid' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
