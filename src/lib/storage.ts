
import { Product, Customer, Sale, Size } from '../types';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../constants';

const STORAGE_KEYS = {
  PRODUCTS: 'vastra_products',
  CUSTOMERS: 'vastra_customers',
  SALES: 'vastra_sales',
};

export const storage = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : MOCK_PRODUCTS;
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  saveProduct: (product: Product) => {
    const products = storage.getProducts();
    storage.saveProducts([...products, product]);
  },

  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : MOCK_CUSTOMERS;
  },
  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  saveCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    storage.saveCustomers([...customers, customer]);
  },

  getSales: (): Sale[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },
  saveSale: (sale: Sale) => {
    const sales = storage.getSales();
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([...sales, sale]));

    // Deduct stock after sale if it's a real sale
    const products = storage.getProducts();
    const updatedProducts = products.map(p => {
      const saleItem = sale.items.find(item => item.productId === p.id);
      if (saleItem) {
        const newStock = { ...p.stock };
        Object.entries(saleItem.sizeQuantities).forEach(([size, qty]) => {
          newStock[size as Size] = Math.max(0, (newStock[size as Size] || 0) - (Number(qty) || 0));
        });
        return { ...p, stock: newStock };
      }
      return p;
    });
    storage.saveProducts(updatedProducts);
  },

  // Stock Purchase/Receipt handling
  addStock: (productId: string, sizeQuantities: Record<string, number>) => {
    const products = storage.getProducts();
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newStock = { ...p.stock };
        Object.entries(sizeQuantities).forEach(([size, qty]) => {
          newStock[size as Size] = (newStock[size as Size] || 0) + (Number(qty) || 0);
        });
        return { ...p, stock: newStock };
      }
      return p;
    });
    storage.saveProducts(updatedProducts);
  }
};
