import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Save, Users } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { storage } from '../lib/storage';
import { Product, Size } from '../types';
import { SIZES } from '../constants';

export const Purchase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [purchaseQuantities, setPurchaseQuantities] = useState<Record<string, number>>({});
  const [totalCost, setTotalCost] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    setIsSaving(true);
    setTimeout(() => {
      storage.addStock(selectedProductId, purchaseQuantities);
      alert('Stock Updated Successfully!');
      setSelectedProductId('');
      setPurchaseQuantities({});
      setTotalCost(0);
      setIsSaving(false);
    }, 600);
  };

  const handleQtyChange = (size: string, qty: number) => {
    setPurchaseQuantities(prev => ({ ...prev, [size]: qty }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Purchase Management</h1>
        <p className="text-gray-500 mt-1">Record bulk stock receipts and supplier invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <ShoppingBag size={24} />
             </div>
             <h2 className="text-xl font-bold">New Purchase Entry</h2>
          </div>
          
          <form onSubmit={handleAddStock} className="space-y-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Select Product to Stock</label>
                <select 
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                >
                   <option value="">Choose item...</option>
                   {products.map(p => (
                     <option key={p.id} value={p.id}>{p.brand} - {p.name} ({p.sku})</option>
                   ))}
                </select>
             </div>

             <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase block">Purchase Qty (Size Wise)</label>
                <div className="grid grid-cols-4 gap-2">
                  {SIZES.map(size => (
                    <div key={size} className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 block text-center">{size}</span>
                      <input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs text-center font-bold"
                        onChange={(e) => handleQtyChange(size, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Supplier Invoice No</label>
                   <input className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" placeholder="PUR-2024-001" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Total Bill Cost (₹)</label>
                   <input 
                    type="number" 
                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    placeholder="10,000"
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                  />
                </div>
             </div>

             <button 
              disabled={isSaving || !selectedProductId}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Updating...' : 'Update Inventory Stock'}
             </button>
          </form>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-[40px]" />
              <h3 className="text-lg font-bold mb-4">Supplier Outstanding</h3>
              <p className="text-4xl font-extrabold mb-2">₹ 24.50 Lakh</p>
              <p className="text-sm text-indigo-100 mb-6">Total payables to 12 vendors</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm">View Supplier Ledger</button>
           </div>

           <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recent Receipts (GRN)</h3>
              <div className="space-y-4">
                 {[
                   { ref: 'GRN-991', supplier: 'Textile Hub', qty: 1200, status: 'Completed' },
                   { ref: 'GRN-992', supplier: 'Gupta Fabrics', qty: 450, status: 'Pending' }
                 ].map(receipt => (
                   <div key={receipt.ref} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                         <p className="text-sm font-bold text-gray-900">{receipt.ref}</p>
                         <p className="text-xs text-gray-500">{receipt.supplier} • {receipt.qty} Pcs</p>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">{receipt.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
