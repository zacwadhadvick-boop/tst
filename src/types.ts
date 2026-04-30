export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'SALES' | 'WAREHOUSE' | 'ACCOUNTANT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';
export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  gender: Gender;
  basePrice: number;
  sellingPrice: number;
  stock: Record<Size, number>;
  color: string;
  season?: string;
}

export interface Customer {
  id: string;
  name: string;
  type: 'Retailer' | 'Distributor' | 'Reseller';
  gstin: string;
  creditLimit: number;
  outstanding: number;
  region: string;
  city: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sizeQuantities: Partial<Record<Size, number>>;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  transportId?: string;
}

export interface DashboardStats {
  todaySales: number;
  monthlySales: number;
  activeOrders: number;
  lowStockItems: number;
  receivables: number;
}
