import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, LayoutGrid, List, Package, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { SIZES } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { Product, Size } from '../types';
import { storage } from '../lib/storage';
import { exportToExcel, exportToPDF } from '../lib/export';

export const Inventory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'Men',
    gender: 'Men',
    sku: '',
    basePrice: 0,
    sellingPrice: 0,
    color: '',
    season: 'Summer 2024',
    stock: { 'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'Free Size': 0 }
  });

  const loadProducts = () => {
    setProducts(storage.getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleExportExcel = () => {
    const data = products.map(p => ({
      Name: p.name,
      Brand: p.brand,
      SKU: p.sku,
      Price: p.sellingPrice,
      'Total Stock': Object.values(p.stock).reduce((a, b) => (Number(a)||0) + (Number(b)||0), 0)
    }));
    exportToExcel(data, 'Inventory_Stock');
    setShowExportOptions(false);
  };

  const handleExportPDF = () => {
    const headers = ['Product Name', 'Brand', 'SKU', 'Price', 'Total Stock'];
    const rows = products.map(p => [
      p.name,
      p.brand,
      p.sku,
      formatCurrency(p.sellingPrice),
      Object.values(p.stock).reduce((a, b) => (Number(a)||0) + (Number(b)||0), 0)
    ]);
    exportToPDF(headers, rows, 'Inventory_Stock', 'Stock Inventory Report');
    setShowExportOptions(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: Math.random().toString(36).substr(2, 9),
    };
    storage.saveProduct(product);
    loadProducts();
    setIsAdding(false);
    setNewProduct({
      name: '', brand: '', category: 'Men', gender: 'Men', sku: '', basePrice: 0, sellingPrice: 0, color: '', season: 'Summer 2024',
      stock: { 'XS': 0, 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'Free Size': 0 }
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative">
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Add New Wholesale Item</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/60 hover:text-white">Close</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                  <input required placeholder="e.g. Slim Fit Denim" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Brand</label>
                  <input required placeholder="e.g. Levi's" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">SKU / Barcode</label>
                  <input required placeholder="e.g. LV-001" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Purchase Price (CP)</label>
                  <input required type="number" placeholder="0" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold" 
                    onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <label className="text-xs font-bold text-gray-400 uppercase block">Size Matrix Stock Entry</label>
                <div className="grid grid-cols-4 gap-3">
                  {SIZES.map(size => (
                    <div key={size} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-center text-gray-500">{size}</span>
                      <input type="number" placeholder="0" className="w-full p-2 bg-gray-50 border-none rounded-lg text-sm text-center font-bold" 
                        onChange={e => {
                          const stock = {...newProduct.stock};
                          stock[size as Size] = Number(e.target.value);
                          setNewProduct({...newProduct, stock});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all">
                Save to Inventory
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">Stock Inventory</h1>
          <p className="text-gray-500 mt-1">Manage size-wise and color-wise clothing stock</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={18} className="text-gray-400" />
              Export
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={handleExportPDF}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                >
                  <FileText size={16} className="text-red-500" />
                  Download PDF
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors"
                >
                  <FileSpreadsheet size={16} className="text-emerald-500" />
                  Download Excel
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            New Product
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Brand, SKU, or Name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900")}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                <th className="px-6 py-4">Product Detail</th>
                <th className="px-6 py-4">Brand / Season</th>
                <th className="px-6 py-4">Pricing (Wholesale)</th>
                {SIZES.map(size => (
                  <th key={size} className="px-4 py-4 text-center">{size}</th>
                ))}
                <th className="px-6 py-4 text-right">Total Stock</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                          <Package className="text-gray-300" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{product.name}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">{product.brand}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{product.season}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(product.sellingPrice)}</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">CP: {formatCurrency(product.basePrice)}</p>
                    </td>
                    {SIZES.map(size => (
                      <td key={size} className="px-4 py-4 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-bold",
                          product.stock[size as Size] > 20 ? "bg-emerald-50 text-emerald-700" : 
                          product.stock[size as Size] > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                        )}>
                          {product.stock[size as Size] || 0}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-extrabold text-gray-900">{totalStock}</p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">PCS</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
