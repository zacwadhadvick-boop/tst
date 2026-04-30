import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Receipt, 
  BarChart3, 
  Truck, 
  Settings, 
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Products & Inventory', icon: Package },
  { id: 'purchase', label: 'Purchase Entry', icon: ShoppingCart },
  { id: 'billing', label: 'Sales & Billing', icon: Receipt },
  { id: 'customers', label: 'Customers (B2B)', icon: Users },
  { id: 'transport', label: 'Logistics & Transport', icon: Truck },
  { id: 'accounts', label: 'Accounts & GST', icon: ShieldCheck },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-72 bg-[#1E1E2D] h-screen fixed left-0 top-0 text-white flex flex-col border-r border-white/5 z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl">V</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">VastraBill</h1>
            <p className="text-xs text-gray-400 font-medium">Enterprise Edition</p>
          </div>
        </div>
        
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110", activeTab === item.id ? "text-white" : "text-gray-500")} />
                {item.label}
              </div>
              {activeTab === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-3">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Super Admin</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Main Branch</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors border-t border-white/5 pt-3"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
        
        <p className="text-[10px] text-center text-gray-600 font-medium">
          Digital Communique v3.0.1
        </p>
      </div>
    </aside>
  );
};
