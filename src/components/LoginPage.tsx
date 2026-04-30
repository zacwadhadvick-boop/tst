import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginPageProps {
  onLogin: (role: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin('SUPER_ADMIN');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2E2E2E] overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl h-[600px] flex rounded-3xl overflow-hidden shadow-2xl relative z-10 mx-4 border border-white/5">
        
        {/* Left Side: Fashion Image Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
            alt="Fashion Warehouse"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">VastraBill Pro</h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                Enterprise-grade garment wholesale management for the modern fashion trade.
              </p>
              <div className="mt-8 flex gap-6">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={16} /> Bulk Inventory
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={16} /> Smart Billing
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 bg-white/5 backdrop-blur-xl p-12 flex flex-col justify-center border-l border-white/10">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to manage your wholesale empire</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Enter admin username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors">
                  <input type="checkbox" className="rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Login to Dashboard
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                👉 “A Product of Digital Communique Private Limited”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
