import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  Package, 
  User, 
  Calendar,
  Calculator,
  Search,
  ChevronDown,
  Gift,
  Truck
} from 'lucide-react';
import { SIZES } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { Product, Size, SaleItem, Customer, Sale } from '../types';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

import { exportToPDF } from '../lib/export';

export const Billing: React.FC = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePrint = () => {
    if (!selectedCustomer || items.length === 0) return;
    
    const headers = ['Product', 'Sizes & Qty', 'Rate', 'Total'];
    const rows = items.map(item => {
      const qties = Object.entries(item.sizeQuantities)
        .filter(([_, qty]) => (Number(qty) || 0) > 0)
        .map(([size, qty]) => `${size}:${qty}`)
        .join(', ');
      
      return [
        item.productName,
        qties,
        formatCurrency(item.price),
        formatCurrency(item.total)
      ];
    });

    rows.push(['', '', 'Subtotal', formatCurrency(subTotal)]);
    rows.push(['', '', 'GST (5%)', formatCurrency(tax)]);
    rows.push(['', '', 'Grand Total', formatCurrency(grandTotal)]);

    exportToPDF(
      headers, 
      rows, 
      `Bill_${selectedCustomer.name.replace(/\s/g, '_')}`, 
      `Tax Invoice - ${selectedCustomer.name}`
    );
  };

  useEffect(() => {
    const prods = storage.getProducts();
    const custs = storage.getCustomers();
    setAvailableProducts(prods);
    setCustomers(custs);
    if (custs.length > 0) setSelectedCustomer(custs[0]);
  }, []);

  const handleSaveInvoice = () => {
    if (!selectedCustomer || items.length === 0) return;
    
    setIsSaving(true);
    const newSale: Sale = {
      id: uuidv4(),
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      date: new Date().toISOString(),
      items,
      totalAmount: subTotal,
      taxAmount: tax,
      discountAmount: 0,
      grandTotal: grandTotal,
      paymentStatus: 'Unpaid'
    };

    setTimeout(() => {
      storage.saveSale(newSale);
      alert(`Invoice ${newSale.invoiceNumber} saved successfully to Local Storage!`);
      setItems([]);
      setIsSaving(false);
    }, 800);
  };

  const addItem = (product: Product) => {
    const newItem: SaleItem = {
      productId: product.id,
      productName: product.name,
      sizeQuantities: {},
      price: product.sellingPrice,
      total: 0
    };
    setItems([...items, newItem]);
    setShowSearch(false);
    setSearchTerm('');
  };

  const updateQuantity = (itemIndex: number, size: Size, qty: number) => {
    const newItems = [...items];
    newItems[itemIndex].sizeQuantities[size] = Math.max(0, qty);
    
    // Recalculate item total
    const totalQty = Object.values(newItems[itemIndex].sizeQuantities).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    newItems[itemIndex].total = (Number(totalQty) || 0) * newItems[itemIndex].price;
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subTotal * 0.05; // 5% GST for garments (usually)
  const grandTotal = subTotal + tax;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">Wholesale Billing</h1>
          <p className="text-gray-500 mt-1">Generate bulk invoices with size-matrix input</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl text-amber-700 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Credit Limit: {formatCurrency(selectedCustomer.creditLimit)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Header: Customer Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Billed To (B2B)</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value) || null)}
                  >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                {selectedCustomer && (
                  <div className="flex gap-4 text-[10px] font-bold text-blue-600 uppercase">
                    <span>GSTIN: {selectedCustomer.gstin}</span>
                    <span>Region: {selectedCustomer.region}</span>
                  </div>
                )}
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
             </div>
          </div>

          {/* Billing Matrix Grid */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
               <h3 className="text-sm font-bold text-gray-700">Order Items (Size Matrix)</h3>
               <div className="relative">
                 <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                   <Plus size={14} /> Add Product
                 </button>
                 
                 {showSearch && (
                   <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="p-2">
                       <input 
                        autoFocus
                        className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none outline-none" 
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                       />
                     </div>
                     <div className="max-h-60 overflow-y-auto">
                        {availableProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                          <button 
                            key={p.id}
                            onClick={() => addItem(p)}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm flex justify-between items-center transition-colors"
                          >
                            <div>
                               <p className="font-bold text-gray-900">{p.name}</p>
                               <p className="text-[10px] text-gray-400">{p.brand} • {formatCurrency(p.sellingPrice)}</p>
                            </div>
                            <Plus size={14} className="text-blue-500" />
                          </button>
                        ))}
                     </div>
                   </div>
                 )}
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] uppercase font-extrabold text-gray-400 bg-gray-50/30">
                    <th className="px-6 py-3 text-left">Item Details</th>
                    {SIZES.map(s => <th key={s} className="px-1 py-3 text-center w-12">{s}</th>)}
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={SIZES.length + 4} className="px-6 py-20 text-center text-gray-400 bg-gray-50/20 italic text-sm">
                        No items added. Use the "Add Product" button to start billing.
                      </td>
                    </tr>
                  ) : items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{item.productName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {item.productId}</p>
                      </td>
                      {SIZES.map(size => (
                        <td key={size} className="px-1 py-4">
                           <input 
                            type="number"
                            className="w-12 h-10 text-center bg-gray-50 border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                            min="0"
                            value={item.sizeQuantities[size as Size] || ''}
                            onChange={(e) => updateQuantity(index, size as Size, parseInt(e.target.value) || 0)}
                           />
                        </td>
                      ))}
                      <td className="px-4 py-4 text-right">
                         <p className="text-sm font-bold text-gray-900">{formatCurrency(item.price)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <p className="text-md font-extrabold text-blue-600">{formatCurrency(item.total)}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => removeItem(index)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div className="space-y-6">
          <div className="bg-[#1E1E2D] p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-500/10 rounded-full blur-[40px]" />
             
             <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
               <Receipt className="text-blue-400" />
               Summary
             </h3>

             <div className="space-y-4 pb-6 border-b border-white/10">
                <div className="flex justify-between text-sm text-gray-400 font-medium">
                   <span>Gross Amount</span>
                   <span className="text-white font-bold">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 font-medium">
                   <span>GST (Tax) 5%</span>
                   <span className="text-white font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-400 font-bold">
                   <span>Bulk Discount</span>
                   <span>- {formatCurrency(0)}</span>
                </div>
             </div>

             <div className="pt-6 mb-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[2px] mb-2">Total Amount Payable</p>
                <h2 className="text-4xl font-extrabold text-blue-400 tracking-tight">
                  {formatCurrency(grandTotal)}
                </h2>
                {items.length > 0 && subTotal > 50000 && (
                  <div className="mt-4 flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold animate-pulse">
                    <Gift size={16} />
                    Volume Scheme Applied: ₹2,500 Discount
                  </div>
                )}
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handlePrint}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider group"
                >
                   <Printer size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                   Print Bill
                </button>
                <button 
                  onClick={handleSaveInvoice}
                  disabled={isSaving || items.length === 0}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-600 rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {isSaving ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <Save size={20} />
                   )}
                   {isSaving ? 'Saving...' : 'Save & Sync'}
                </button>
             </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
             <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Calculator size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-emerald-800 uppercase">Margin Estimate</p>
                <p className="text-lg font-extrabold text-emerald-600">≈ 24.5% Profit</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Receipt = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
    <path d="M16 8h-6"/>
    <path d="M16 12H8"/>
    <path d="M13 16H8"/>
  </svg>
);
