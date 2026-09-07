export interface Product {
  name: string;
  stock: number;
  price: number;
  category: string;
}

export interface StoreProduct extends Product {
  id: number;
  listed: boolean;
  sku?: string;
  costPrice?: number;
  minThreshold?: number;
  supplier?: string;
  description?: string;
  image?: string;
}

export interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  distText: string;
  rating: number;
  phone: string;
  category: string;
  lastUpdated: string;
  openNow: boolean;
  hours: string;
  color: string;
  products: Product[];
}

export interface StoreResult extends Store {
  matchedProducts: Product[];
}

export interface LedgerEntry {
  date: string;
  desc: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
}

export interface Expense {
  date: string;
  name: string;
  category: string;
  amount: number;
}

export interface Reservation {
  id: string;
  customer: string;
  product: string;
  qty: number;
  time: string;
  status: 'pending' | 'confirmed';
}

export interface SnapProduct {
  name: string;
  desc: string;
  found: boolean;
  store: string;
  stock: number;
  dist: string;
}

export interface ScannedProduct {
  name: string;
  qty: number;
  unitPrice: number;
  category: string;
}

export interface RiderContext {
  storeId: number;
  productName: string;
  price: number;
  storeName?: string;
}

export interface Promotion {
  id: string;
  name: string;
  products: string[];
  discountPct: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: 'cash' | 'upi' | 'card' | 'online';
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

export type Mode = 'customer' | 'owner';

export type ToastType = 'success' | 'error' | 'info';