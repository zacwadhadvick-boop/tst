import { Product, Customer } from './types';

export const COLORS = {
  primary: '#1E3A8A', // Royal Blue
  secondary: '#10B981', // Emerald Green
  accent: '#FF6B35', // Coral Orange
  neutral: '#2E2E2E', // Dark Charcoal
  background: '#F3F4F6', // Light Grey
  fashion: '#F5F5DC', // Soft Beige
};

export const SIZES: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'NK-TEE-001',
    name: 'Essential Cotton T-Shirt',
    brand: 'Nike',
    category: 'Men',
    subCategory: 'T-Shirts',
    gender: 'Men',
    basePrice: 450,
    sellingPrice: 899,
    color: 'Navy Blue',
    season: 'Summer 2024',
    stock: {
      'S': 45,
      'M': 120,
      'L': 80,
      'XL': 30,
      'XS': 0,
      'XXL': 10,
      'Free Size': 0
    }
  },
  {
    id: '2',
    sku: 'LV-JNS-002',
    name: '501 Original Fit Jeans',
    brand: 'Levi\'s',
    category: 'Men',
    subCategory: 'Jeans',
    gender: 'Men',
    basePrice: 1200,
    sellingPrice: 2499,
    color: 'Indigo Indigo',
    season: 'Regular',
    stock: {
      'S': 12,
      'M': 45,
      'L': 50,
      'XL': 15,
      'XS': 5,
      'XXL': 5,
      'Free Size': 0
    }
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Elite Garments Mumbai',
    type: 'Distributor',
    gstin: '27AAAAA0000A1Z5',
    creditLimit: 500000,
    outstanding: 125000,
    region: 'Maharashtra',
    city: 'Mumbai',
  },
  {
    id: 'c2',
    name: 'Fashion Hub Delhi',
    type: 'Retailer',
    gstin: '07BBBBB1111B2Z6',
    creditLimit: 200000,
    outstanding: 45000,
    region: 'Delhi',
    city: 'New Delhi',
  }
];
