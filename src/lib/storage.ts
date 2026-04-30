
import { Product, Customer, Sale } from '../types';
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
  }
};
