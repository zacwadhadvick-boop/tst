import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Billing } from './components/Billing';
import { Customers } from './components/Customers';
import { Purchase } from './components/Purchase';
import { Transport } from './components/Transport';
import { Accounts } from './components/Accounts';
import { Reports } from './components/Reports';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';
import { cn } from './lib/utils';
import { registerSW } from 'virtual:pwa-register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vastrabill_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register PWA service worker safely
    try {
      registerSW({ 
        immediate: true,
        onOfflineReady() {
          console.log('App ready for offline use');
        }
      });
    } catch (e) {
      console.warn('PWA registration error', e);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = () => {
    localStorage.setItem('vastrabill_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vastrabill_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-body">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Universal search (Ctrl+K)..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <div className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm border transition-all",
                  isOnline 
                    ? "bg-white text-gray-900 border-gray-100" 
                    : "bg-amber-500 text-white border-amber-600"
                )}>
                  {isOnline ? 'Live Server' : 'Offline Mode'}
                </div>
                <div className="px-3 py-1.5 text-xs font-bold text-gray-500 rounded-lg">
                  {isOnline ? 'Sync: Active' : 'Local Storage'}
                </div>
             </div>
             
             <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative">
                   <Bell size={20} />
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                   <HelpCircle size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                   <Settings size={20} />
                </button>
             </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'billing' && <Billing />}
              {activeTab === 'customers' && <Customers />}
              {activeTab === 'purchase' && <Purchase />}
              {activeTab === 'transport' && <Transport />}
              {activeTab === 'accounts' && <Accounts />}
              {activeTab === 'reports' && <Reports />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
