export interface Product {
  name: string;
  stock: number;
  price: number;
  category: string;
  image?: string;
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
  /** UUID of the shop_products row in Supabase */
  supabaseId?: string;
  /** UUID of the shop row in Supabase */
  shopId?: string;
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
  /** Full address string for display */
  address?: string;
  /** UUID of the shops row in Supabase (used to scope owner operations) */
  shopDbId?: string;
}

export interface StoreResult extends Store {
  matchedProducts: Product[];
}

export interface LedgerEntry {
  supabaseId?: string;
  date: string;
  desc: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
}

export interface Expense {
  supabaseId?: string;
  date: string;
  name: string;
  category: string;
  amount: number;
}

export interface Reservation {
  id: string;
  supabaseId?: string;
  customer: string;
  product: string;
  qty: number;
  time: string;
  status: 'pending' | 'confirmed' | 'ready' | 'picked_up' | 'cancelled' | 'expired';
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
  /** Purchase rate / cost price (from the bill) */
  unitPrice: number;
  /** Selling price the owner sets (defaults to a margin above unitPrice) */
  sellingPrice: number;
  category: string;
  hsn: string;
  /** Whether this item is included in the import */
  include: boolean;
}

export interface RiderContext {
  storeId: number;
  productName: string;
  price: number;
  storeName?: string;
}

export interface Promotion {
  supabaseId?: string;
  id: string;
  name: string;
  products: string[];
  discountPct: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Payment {
  supabaseId?: string;
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

export type Mode = 'customer' | 'owner' | 'rider';

export type ToastType = 'success' | 'error' | 'info';

export interface DeliveryJob {
  id: string;
  shopName: string;
  shopAddress: string;
  customerAddress: string;
  distanceKm: number;
  fee: number;
  status: 'available' | 'accepted' | 'picked_up' | 'delivered';
  shopCoords?: [number, number];
  customerCoords?: [number, number];
}