'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AI_RECS,
  STORES,
  INITIAL_EXPENSES,
  INITIAL_LEDGER,
  INITIAL_RESERVATIONS,
  INITIAL_PROMOTIONS,
  INITIAL_PAYMENTS,
  createOwnerInventory,
  LANG_KEYWORDS,
} from './data';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from './supabase/client';
import type {
  ChatMessage,
  DeliveryJob,
  Expense,
  LedgerEntry,
  Mode,
  Payment,
  Promotion,
  Reservation,
  RiderContext,
  StoreProduct,
  StoreResult,
  ToastType,
} from './types';

// ─── Supabase shop_products ↔ StoreProduct conversion ─────────────────────────
type RawShopProduct = {
  id: string;
  shop_id: string;
  product_id: string;
  price: number;
  mrp: number | null;
  quantity: number;
  low_stock_threshold: number | null;
  discount_percentage: number | null;
  is_available: boolean;
  products: {
    id: string;
    name: string;
    description: string | null;
    brand: string | null;
    sku: string | null;
    image_url: string | null;
  } | null;
};

// ─── DB row types for business data ─────────────────────────────────────────
type RawOrder = {
  id: string;
  customer_id: string;
  shop_id: string;
  status: string;
  subtotal: number;
  delivery_fee: number | null;
  platform_fee: number | null;
  discount: number | null;
  total_amount: number;
  payment_status: string;
  created_at: string;
};
type RawOrderItem = {
  id: string;
  order_id: string;
  shop_product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};
type RawPaymentRow = {
  id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  payment_method: string;
  status: string;
  paid_at: string | null;
  transaction_id: string | null;
  created_at: string;
};
type RawTransactionRow = {
  id: string;
  shop_id: string;
  order_id: string | null;
  transaction_type: string;
  amount: number;
  payment_method: string | null;
  description: string | null;
  reference_id: string | null;
  transaction_date: string | null;
  created_at: string;
};
type RawExpenseRow = {
  id: string;
  shop_id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: string | null;
  receipt_url: string | null;
};
type RawReservationRow = {
  id: string;
  customer_id: string;
  shop_id: string;
  status: string;
  notes: string | null;
  created_at: string;
};
type RawReservationItem = {
  id: string;
  reservation_id: string;
  shop_product_id: string;
  quantity: number;
  unit_price: number;
};
type RawShopViewRow = { id: number; created_at: string };
type RawPromotion = {
  id: string;
  shop_id: string;
  name: string;
  budget: number | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
};
type RawShopData = {
  id: string;
  name: string;
  description: string | null;
  rating: number | null;
  total_reviews: number | null;
  is_open: boolean | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  cover_image_url: string | null;
  status: string;
};

function rawToStoreProduct(raw: RawShopProduct, idx: number): StoreProduct {
  const prod = raw.products;
  return {
    id: idx,
    name: prod?.name ?? 'Unnamed Product',
    description: prod?.description ?? '',
    stock: raw.quantity,
    price: raw.price,
    costPrice: raw.mrp ? Math.round(raw.mrp * 0.65) : Math.round(raw.price * 0.65),
    category: 'General',
    sku: prod?.sku ?? '',
    supplier: prod?.brand ?? '',
    image: prod?.image_url ?? '',
    minThreshold: raw.low_stock_threshold ?? 10,
    listed: raw.is_available,
    supabaseId: raw.id,
    shopId: raw.shop_id,
  };
}

export type ModalName =
  | 'login'
  | 'reserve'
  | 'rider'
  | 'fashion'
  | 'snap'
  | 'voice'
  | 'product'
  | 'addProduct'
  | 'addTxn'
  | 'addExp'
  | null;

export type SortBy = 'distance' | 'stock' | 'updated' | 'rating';

interface ToastState {
  msg: string;
  type: ToastType;
}

interface ReserveContext {
  storeId: number;
  productName: string;
  price: number;
  storeName?: string;
}

export type ProfileRole = 'customer' | 'rider' | 'shop_owner' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  is_active: boolean | null;
  created_at?: string;
}

interface AppContextValue {
  mode: Mode;
  switchMode: (m: Mode) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  toast: ToastState | null;
  showToast: (msg: string, type?: ToastType) => void;

  activeModal: ModalName;
  openModal: (m: Exclude<ModalName, null>) => void;
  closeModal: (m: Exclude<ModalName, null>) => void;

  searchTerm: string;
  handleSearchInput: (value: string) => void;
  setSearchTerm: (v: string) => void;
  suggestions: string[];
  setSuggestions: (v: string[]) => void;
  currentQuery: string;
  currentResults: StoreResult[];
  currentResultView: 'list' | 'map';
  setCurrentResultView: (v: 'list' | 'map') => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  doSearch: (q?: string) => void;
  quickSearch: (term: string) => void;
  aiRecs: string[];
  resultsRef: React.RefObject<HTMLDivElement | null>;

  lang: string;
  setLang: (v: string) => void;

  supabase: SupabaseClient | null;
  session: Session | null;
  profile: Profile | null;
  loadingAuth: boolean;
  loginDemo: (role: 'shop_owner' | 'customer') => void;
  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  isOwner: boolean;
  ownerLogout: () => void;
  isRider: boolean;
  loginRider: () => void;
  riderLogout: () => void;
  ownerShopId: string | null;
  inventoryLoading: boolean;

  ownerInventory: StoreProduct[];
  toggleListing: (idx: number) => void;
  saveProduct: (p: Omit<StoreProduct, 'id'> & { id?: number }) => void;
  deleteProduct: (idx: number) => void;
  updateStock: (id: number, newStock: number) => void;
  editProduct: StoreProduct | null;
  setEditProduct: (p: StoreProduct | null) => void;

  ledger: LedgerEntry[];
  addTransaction: (t: Omit<LedgerEntry, 'balance'>) => void;

  expenses: Expense[];
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;

  reservations: Reservation[];
  addReservation: (r: Reservation) => void;

  promotions: Promotion[];
  addPromotion: (p: Promotion) => void;
  togglePromotion: (id: string) => void;
  deletePromotion: (id: string) => void;

  payments: Payment[];
  addPayment: (p: Payment) => void;

  // ─── Owner business data (Supabase-backed) ───────────────────────────────
  businessLoading: boolean;
  ownerOrders: RawOrder[];
  ownerOrderItems: RawOrderItem[];
  ownerPayments: RawPaymentRow[];
  ownerTransactions: RawTransactionRow[];
  ownerExpenses: RawExpenseRow[];
  ownerReservations: RawReservationRow[];
  ownerReservationItems: RawReservationItem[];
  ownerShopViews: RawShopViewRow[];
  ownerShopData: RawShopData | null;

  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;

  riderCtx: RiderContext | null;
  setRiderCtx: (c: RiderContext | null) => void;
  riderJobs: DeliveryJob[];
  riderLoading: boolean;
  loadRiderJobs: () => Promise<void>;
  reserveCtx: ReserveContext | null;
  setReserveCtx: (c: ReserveContext | null) => void;
  productStoreId: number | null;
  openProductModal: (storeId: number) => void;

  ownerSection: string;
  setOwnerSection: (s: string) => void;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

// ─── Rider jobs (Supabase-backed) ────────────────────────────────────────────
type RiderShopRow = {
  id: string;
  name: string;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
};

type RiderOrderRow = {
  id: string;
  status: string;
  delivery_fee: number | null;
  delivery_address_id: string | null;
  shops: {
    id: string;
    name: string;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  addresses: {
    label: string | null;
    address_line_1: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

const RIDER_DROPOFFS: { label: string; coords: [number, number] }[] = [
  { label: 'Hostel Block A, SVIT Campus', coords: [22.47, 73.079] },
  { label: 'Hostel Block C, SVIT Campus', coords: [22.4738, 73.0731] },
  { label: 'Gandhi Chowk, Vasad', coords: [22.4521, 73.0782] },
  { label: 'Shreenath Residency, Umreth Road', coords: [22.4609, 73.0854] },
];

const SVIT_FALLBACK: [number, number] = [22.4674, 73.0763];

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function roundDistanceKm(km: number): number {
  return Math.max(0.5, Math.round(km * 10) / 10);
}

function feeFromDistance(km: number): number {
  const raw = 30 + km * 8;
  return Math.round(raw / 5) * 5;
}

function formatShopAddress(s: { address_line_1: string | null; address_line_2?: string | null; city: string | null }): string {
  return [s.address_line_1, s.address_line_2, s.city].filter(Boolean).join(', ');
}

function shopCoords(s: { latitude: number | null; longitude: number | null }): [number, number] | null {
  return typeof s.latitude === 'number' && typeof s.longitude === 'number'
    ? [s.latitude, s.longitude]
    : null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('customer');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [rawResults, setRawResults] = useState<StoreResult[]>([]);
  const [currentResultView, setCurrentResultView] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [lang, setLang] = useState('en-US');
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isRider, setIsRider] = useState(false);

  // ─── Owner inventory state (must be declared before auth useEffect) ──────────
  const [ownerShopId, setOwnerShopId] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [ownerInventory, setOwnerInventory] = useState<StoreProduct[]>(() => createOwnerInventory());
  const [editProduct, setEditProduct] = useState<StoreProduct | null>(null);

  // ─── Fetch owner's shop_products from Supabase ──────────────────────────────
  const fetchOwnerInventory = useCallback(async (client: SupabaseClient, userId: string) => {
    setInventoryLoading(true);
    try {
      const { data: shopData } = await client
        .from('shops')
        .select('id')
        .eq('owner_id', userId)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (!shopData?.id) { setInventoryLoading(false); return; }
      setOwnerShopId(shopData.id);

      const { data: spData, error } = await client
        .from('shop_products')
        .select(`
          id, shop_id, product_id, price, mrp, quantity,
          low_stock_threshold, discount_percentage, is_available,
          products ( id, name, description, brand, sku, image_url )
        `)
        .eq('shop_id', shopData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('fetchOwnerInventory:', error.message);
      } else if (spData) {
        setOwnerInventory((spData as unknown as RawShopProduct[]).map(rawToStoreProduct));
      }
    } catch (e) {
      console.error('fetchOwnerInventory exception:', e);
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const client = createSupabaseClient();
    setSupabase(client);

    client.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setLoggedIn(!!s);
      if (s?.user) {
        const p = await client
          .from('profiles')
          .select('*')
          .eq('id', s.user.id)
          .maybeSingle();
        if (p.data) {
          setProfile(p.data as Profile);
          const isShopOwner = p.data.role === 'shop_owner';
          setIsOwner(isShopOwner);
          if (isShopOwner) {
            fetchOwnerInventory(client, s.user.id);
          }
        }
      }
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setLoggedIn(!!s);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (s?.user) {
          const p = await client
            .from('profiles')
            .select('*')
            .eq('id', s.user.id)
            .maybeSingle();
          if (p.data) {
            setProfile(p.data as Profile);
            const isShopOwner = p.data.role === 'shop_owner';
            setIsOwner(isShopOwner);
            if (isShopOwner) {
              fetchOwnerInventory(client, s.user.id);
            }
          }
        }
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsOwner(false);
        setOwnerShopId(null);
        setOwnerInventory(createOwnerInventory());
        setMode('customer');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchOwnerInventory]);

  const [ledger, setLedger] = useState<LedgerEntry[]>(() => INITIAL_LEDGER);
  const [expenses, setExpenses] = useState<Expense[]>(() => INITIAL_EXPENSES);
  const [reservations, setReservations] = useState<Reservation[]>(() => INITIAL_RESERVATIONS);
  const [promotions, setPromotions] = useState<Promotion[]>(() => INITIAL_PROMOTIONS);
  const [payments, setPayments] = useState<Payment[]>(() => INITIAL_PAYMENTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // ─── Owner business data (fetched from Supabase) ───────────────────────────
  const [ownerOrders, setOwnerOrders] = useState<RawOrder[]>([]);
  const [ownerOrderItems, setOwnerOrderItems] = useState<RawOrderItem[]>([]);
  const [ownerPayments, setOwnerPayments] = useState<RawPaymentRow[]>([]);
  const [ownerTransactions, setOwnerTransactions] = useState<RawTransactionRow[]>([]);
  const [ownerExpenses, setOwnerExpenses] = useState<RawExpenseRow[]>([]);
  const [ownerReservations, setOwnerReservations] = useState<RawReservationRow[]>([]);
  const [ownerReservationItems, setOwnerReservationItems] = useState<RawReservationItem[]>([]);
  const [ownerShopViews, setOwnerShopViews] = useState<RawShopViewRow[]>([]);
  const [ownerShopData, setOwnerShopData] = useState<RawShopData | null>(null);
  const [businessLoading, setBusinessLoading] = useState(false);

  const fetchOwnerBusinessData = useCallback(async (client: SupabaseClient, shopId: string) => {
    setBusinessLoading(true);
    try {
      const [
        ordersRes, paymentsRes, txRes, expRes, resRes, viewsRes, shopRes, promosRes,
      ] = await Promise.all([
        client.from('orders').select('*').eq('shop_id', shopId).order('created_at', { ascending: false }),
        client.from('payments').select('*').in('order_id',
          (await client.from('orders').select('id').eq('shop_id', shopId)).data?.map((o: {id:string}) => o.id) ?? ['00000000-0000-0000-0000-000000000000']
        ),
        client.from('transactions').select('*').eq('shop_id', shopId).order('transaction_date', { ascending: false }),
        client.from('expenses').select('*').eq('shop_id', shopId).order('expense_date', { ascending: false }),
        client.from('reservations').select('*').eq('shop_id', shopId).order('created_at', { ascending: false }),
        client.from('shop_views').select('id, created_at').eq('shop_id', shopId),
        client.from('shops').select('*').eq('id', shopId).single(),
        client.from('promotions').select('*').eq('shop_id', shopId).order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) {
        setOwnerOrders(ordersRes.data as RawOrder[]);
        // Fetch order items for all orders
        const orderIds = (ordersRes.data as RawOrder[]).map(o => o.id);
        if (orderIds.length) {
          const { data: oiData } = await client.from('order_items').select('*').in('order_id', orderIds);
          if (oiData) setOwnerOrderItems(oiData as RawOrderItem[]);
        }
      }
      if (paymentsRes.data) setOwnerPayments(paymentsRes.data as RawPaymentRow[]);
      if (txRes.data) setOwnerTransactions(txRes.data as RawTransactionRow[]);
      if (expRes.data) setOwnerExpenses(expRes.data as RawExpenseRow[]);
      if (resRes.data) {
        setOwnerReservations(resRes.data as RawReservationRow[]);
        const resIds = (resRes.data as RawReservationRow[]).map(r => r.id);
        if (resIds.length) {
          const { data: riData } = await client.from('reservation_items').select('*').in('reservation_id', resIds);
          if (riData) setOwnerReservationItems(riData as RawReservationItem[]);
        }
      }
      if (viewsRes.data) setOwnerShopViews(viewsRes.data as RawShopViewRow[]);
      if (shopRes.data) setOwnerShopData(shopRes.data as RawShopData);

      // Also sync mock state so existing components still work before we rewire
      // Map expenses
      if (expRes.data) {
        setExpenses((expRes.data as RawExpenseRow[]).map(e => ({
          supabaseId: e.id,
          date: e.expense_date,
          name: e.description,
          category: e.category,
          amount: e.amount,
        })));
      }
      // Map reservations
      if (resRes.data) {
        const riByRes = new Map<string, RawReservationItem[]>();
        // We'll populate reservationItems after fetching
        const { data: riAll } = resRes.data?.length
          ? await client.from('reservation_items').select('id, reservation_id, quantity, unit_price, shop_product_id').in('reservation_id', (resRes.data as RawReservationRow[]).map(r => r.id))
          : { data: [] };
        (riAll as RawReservationItem[] | null)?.forEach(ri => {
          const arr = riByRes.get(ri.reservation_id) ?? [];
          arr.push(ri);
          riByRes.set(ri.reservation_id, arr);
        });
        // Fetch product names from ownerInventory (already loaded)
        const spNameMap = new Map<string, string>();
        ownerInventory.forEach(sp => { if (sp.supabaseId) spNameMap.set(sp.supabaseId, sp.name); });
        // Fallback: fetch product names from shop_products joined
        const spIds = (riAll as RawReservationItem[] | null)?.map(ri => ri.shop_product_id).filter(Boolean) ?? [];
        if (spIds.length) {
          const { data: spData } = await client.from('shop_products').select('id, product_id, products(name)').in('id', spIds);
          (spData as unknown as {id:string;products?:{name:string}}[] | null)?.forEach(sp => {
            if (sp?.products?.name) spNameMap.set(sp.id, sp.products.name);
          });
        }
        setReservations((resRes.data as RawReservationRow[]).map(r => {
          const items = riByRes.get(r.id) ?? [];
          const productNames = items.map(ri => spNameMap.get(ri.shop_product_id) ?? 'Item').join(', ');
          const totalQty = items.reduce((sum, ri) => sum + ri.quantity, 0);
          return {
            id: r.id,
            supabaseId: r.id,
            customer: r.customer_id === 'a0000000-0000-0000-0000-000000000002' ? 'Demo Customer' : 'Customer',
            product: productNames || 'Multiple items',
            qty: totalQty || 1,
            time: r.created_at,
            status: r.status as Reservation['status'],
          };
        }));
      }
      // Map payments
      if (paymentsRes.data) {
        const custNameMap = new Map<string, string>();
        const custIds = [...new Set((paymentsRes.data as RawPaymentRow[]).map(p => p.customer_id))];
        if (custIds.length) {
          const { data: profs } = await client.from('profiles').select('id, full_name').in('id', custIds);
          (profs as {id:string;full_name:string|null}[] | null)?.forEach(p => custNameMap.set(p.id, p.full_name ?? 'Customer'));
        }
        setPayments((paymentsRes.data as RawPaymentRow[]).map(p => ({
          supabaseId: p.id,
          id: p.transaction_id ?? p.id.substring(0, 8),
          orderId: p.order_id,
          customer: custNameMap.get(p.customer_id) ?? 'Customer',
          amount: p.amount,
          method: p.payment_method as Payment['method'],
          date: (p.paid_at ?? p.created_at).substring(0, 10),
          status: p.status as Payment['status'],
        })));
      }
      // Map promotions
      if (promosRes.data) {
        setPromotions((promosRes.data as RawPromotion[]).map(p => ({
          supabaseId: p.id,
          id: p.id,
          name: p.name,
          products: ['All Products'],
          discountPct: 0,
          startDate: p.start_date.substring(0, 10),
          endDate: p.end_date.substring(0, 10),
          active: p.status === 'active',
        })));
      }
      // Map ledger
      if (txRes.data) {
        const txns = txRes.data as RawTransactionRow[];
        let runningBal = 0;
        const sorted = [...txns].sort((a, b) => (a.transaction_date ?? a.created_at).localeCompare(b.transaction_date ?? b.created_at));
        sorted.forEach(tx => {
          const isCredit = ['sale', 'deposit', 'subscription'].includes(tx.transaction_type);
          runningBal += isCredit ? tx.amount : -tx.amount;
        });
        let bal = runningBal;
        setLedger(txns.map(tx => {
          const isCredit = ['sale', 'deposit', 'subscription'].includes(tx.transaction_type);
          const entry: LedgerEntry = {
            supabaseId: tx.id,
            date: (tx.transaction_date ?? tx.created_at).substring(0, 10),
            desc: tx.description ?? tx.transaction_type,
            type: isCredit ? 'credit' : 'debit',
            amount: tx.amount,
            balance: bal,
          };
          if (!isCredit) bal += tx.amount; else bal -= tx.amount;
          return entry;
        }));
      }
    } catch (e) {
      console.error('fetchOwnerBusinessData exception:', e);
    } finally {
      setBusinessLoading(false);
    }
  }, [ownerInventory]);

  const [riderCtx, setRiderCtx] = useState<RiderContext | null>(null);
  const [riderJobs, setRiderJobs] = useState<DeliveryJob[]>([]);
  const [riderLoading, setRiderLoading] = useState(false);
  const [reserveCtx, setReserveCtx] = useState<ReserveContext | null>(null);
  const [productStoreId, setProductStoreId] = useState<number | null>(null);

  const [ownerSection, setOwnerSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch business data when ownerShopId is set
  useEffect(() => {
    if (ownerShopId && supabase) {
      fetchOwnerBusinessData(supabase, ownerShopId);
    }
  }, [ownerShopId, supabase, fetchOwnerBusinessData]);

  const showToast = useCallback((msg: string, type: ToastType = 'info') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
  }, []);

  const loadRiderJobs = useCallback(async () => {
    if (!supabase) return;
    setRiderLoading(true);
    try {
      const shopsRes = await supabase
        .from('shops')
        .select(
          'id,name,address_line_1,address_line_2,city,state,pincode,latitude,longitude,status'
        )
        .eq('status', 'active');
      const shops: RiderShopRow[] = shopsRes.data ?? [];

      const orderBased: DeliveryJob[] = [];
      try {
        const ordersRes = await supabase
          .from('orders')
          .select(
            `id,status,delivery_fee,delivery_address_id,
             shops(id,name,address_line_1,address_line_2,city,latitude,longitude),
             addresses:delivery_address_id(label,address_line_1,city,latitude,longitude)`
          )
          .in('status', ['pending', 'confirmed', 'preparing', 'ready_for_pickup'])
          .limit(25);
        const orders = ((ordersRes.data ?? []) as unknown as Array<{
          id: string;
          status: string;
          delivery_fee: number | null;
          delivery_address_id: string | null;
          shops: RiderOrderRow['shops'] | RiderOrderRow['shops'][];
          addresses: RiderOrderRow['addresses'] | RiderOrderRow['addresses'][];
        }>);
        orders.forEach((o) => {
          const shop = Array.isArray(o.shops) ? o.shops[0] ?? null : o.shops;
          const addr = Array.isArray(o.addresses) ? o.addresses[0] ?? null : o.addresses;
          const pickup = shop ? shopCoords(shop) : null;
          const dropoff = addr ? shopCoords(addr) : null;
          const pickupCoords: [number, number] = pickup ?? SVIT_FALLBACK;
          const dropoffCoords: [number, number] = dropoff ?? SVIT_FALLBACK;
          const distanceKm = roundDistanceKm(haversineKm(pickupCoords, dropoffCoords));
          orderBased.push({
            id: o.id,
            shopName: shop?.name ?? 'Unknown Shop',
            shopAddress: shop ? formatShopAddress(shop) : '',
            customerAddress: addr
              ? `${addr.label ?? 'Customer'} — ${formatShopAddress(addr)}`
              : 'Customer — Vasad, Gujarat',
            distanceKm,
            fee: o.delivery_fee && o.delivery_fee > 0 ? o.delivery_fee : feeFromDistance(distanceKm),
            status: 'available',
            shopCoords: pickupCoords,
            customerCoords: dropoffCoords,
          });
        });
      } catch (e) {
        console.error('loadRiderJobs orders query error:', e);
      }

      const fallback: DeliveryJob[] = shops
        .filter((s) => shopCoords(s) !== null)
        .map((s, i) => {
          const pickup = shopCoords(s)!;
          const dropoff = RIDER_DROPOFFS[i % RIDER_DROPOFFS.length];
          const distanceKm = roundDistanceKm(haversineKm(pickup, dropoff.coords));
          return {
            id: `shop-${s.id}`,
            shopName: s.name,
            shopAddress: formatShopAddress(s) || s.city || 'Vasad, Gujarat',
            customerAddress: `Customer — ${dropoff.label}`,
            distanceKm,
            fee: feeFromDistance(distanceKm),
            status: 'available',
            shopCoords: pickup,
            customerCoords: dropoff.coords,
          };
        });

      setRiderJobs(orderBased.length > 0 ? orderBased : fallback);
    } catch (e) {
      console.error('loadRiderJobs exception:', e);
      setRiderJobs([]);
    } finally {
      setRiderLoading(false);
    }
  }, [supabase]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const openModal = useCallback((m: Exclude<ModalName, null>) => setActiveModal(m), []);
  const closeModal = useCallback((m: Exclude<ModalName, null>) => {
    setActiveModal((cur) => (cur === m ? null : cur));
  }, []);

  const handleSearchInput = useCallback((value: string) => {
    setSearchTerm(value);
    const rawQ = value.trim();
    if (rawQ.length < 2 || !rawQ) {
      setSuggestions([]);
      return;
    }
    const ql = rawQ.toLowerCase();
    const mapped = LANG_KEYWORDS[ql] || ql;

    const all: string[] = [];
    STORES.forEach((s) =>
      s.products.forEach((p) => {
        if (p.name.toLowerCase().includes(mapped) && !all.includes(p.name)) all.push(p.name);
      })
    );
    ownerInventory.forEach((p) => {
      if (p.listed && p.name.toLowerCase().includes(mapped) && !all.includes(p.name)) all.push(p.name);
    });
    setSuggestions(all.length ? all.slice(0, 6) : []);
  }, [ownerInventory]);

  const doSearch = useCallback(
    (q?: string) => {
      const query = (q ?? searchTerm).trim();
      if (!query) {
        showToast('Enter a product to search', 'info');
        return;
      }
      const ql = query.toLowerCase();
      const mapped = LANG_KEYWORDS[ql] || ql;
      setCurrentQuery(query);
      setSuggestions([]);
      const results: StoreResult[] = STORES.map((store) => {
        // Mock injection of owner products if they belong to this mock store
        let dynamicProducts = store.products;
        if (store.name === 'SVIT Stationery Mart' && ownerInventory.length > 0) {
          const ownerListed = ownerInventory.filter(p => p.listed).map(p => ({
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            image: p.image,
            description: p.description
          }));
          // Merge avoiding duplicates by name
          const merged = [...dynamicProducts];
          ownerListed.forEach(op => {
            if (!merged.find(m => m.name === op.name)) merged.push(op);
          });
          dynamicProducts = merged;
        }

        const matches = dynamicProducts.filter((p) => p.name.toLowerCase().includes(mapped) || p.category.toLowerCase().includes(mapped));
        return { ...store, products: dynamicProducts, matchedProducts: matches };
      }).filter((s) => s.matchedProducts.length > 0);

      setRawResults(results);
      setCurrentResultView('list');

      let recs: string[] = [];
      for (const [key, val] of Object.entries(AI_RECS)) {
        if (ql.includes(key)) {
          recs = val;
          break;
        }
      }
      setAiRecs(recs);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
    [searchTerm, showToast]
  );

  const quickSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setSuggestions([]);
      doSearch(term);
    },
    [doSearch]
  );

  const toggleListing = useCallback((idx: number) => {
    setOwnerInventory((prev) => {
      const updated = prev.map((p, i) => (i === idx ? { ...p, listed: !p.listed } : p));
      // Sync to Supabase
      const item = updated[idx];
      if (item?.supabaseId && supabase) {
        supabase
          .from('shop_products')
          .update({ is_available: item.listed, updated_at: new Date().toISOString() })
          .eq('id', item.supabaseId)
          .then(({ error }) => { if (error) console.error('toggleListing sync:', error.message); });
      }
      return updated;
    });
  }, [supabase]);

  const saveProduct = useCallback(async (p: Omit<StoreProduct, 'id'> & { id?: number }) => {
    // Optimistic local update first
    setOwnerInventory((prev) => {
      if (typeof p.id === 'number') {
        return prev.map((x) => (x.id === p.id ? { ...x, ...p, id: x.id } : x));
      }
      return [...prev, { ...p, id: Date.now() }];
    });

    if (!supabase || !ownerShopId) return;

    try {
      // 1. Upsert into global products table
      let productId = '';
      if (p.supabaseId) {
        // Editing existing — get product_id from shop_products row
        const { data: sp } = await supabase
          .from('shop_products')
          .select('product_id')
          .eq('id', p.supabaseId)
          .single();
        productId = sp?.product_id ?? '';
      }

      if (!productId) {
        // Try to match existing product by name
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .ilike('name', p.name.trim())
          .limit(1)
          .maybeSingle();
        productId = existing?.id ?? '';
      }

      if (!productId) {
        // Insert new product into global catalog
        const { data: newProd, error: prodErr } = await supabase
          .from('products')
          .insert({
            name: p.name.trim(),
            description: p.description ?? null,
            brand: p.supplier ?? null,
            sku: p.sku ?? null,
            image_url: p.image ?? null,
          })
          .select('id')
          .single();
        if (prodErr || !newProd) {
          console.error('saveProduct insert product:', prodErr?.message);
          return;
        }
        productId = newProd.id;
      } else {
        // Update existing product metadata
        await supabase
          .from('products')
          .update({
            name: p.name.trim(),
            description: p.description ?? null,
            brand: p.supplier ?? null,
            sku: p.sku ?? null,
            image_url: p.image ?? null,
          })
          .eq('id', productId);
      }

      // 2. Upsert shop_products
      const { data: sp, error: spErr } = await supabase
        .from('shop_products')
        .upsert({
          shop_id: ownerShopId,
          product_id: productId,
          price: p.price,
          mrp: p.costPrice ? Math.round(p.costPrice / 0.65) : p.price,
          quantity: p.stock,
          low_stock_threshold: p.minThreshold ?? 10,
          is_available: p.listed,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'shop_id,product_id' })
        .select('id')
        .single();

      if (spErr || !sp) {
        console.error('saveProduct upsert shop_products:', spErr?.message);
        return;
      }

      // Patch local state with the real supabaseId
      setOwnerInventory((prev) =>
        prev.map((item) =>
          item.name === p.name && !item.supabaseId
            ? { ...item, supabaseId: sp.id, shopId: ownerShopId }
            : item
        )
      );
    } catch (e) {
      console.error('saveProduct exception:', e);
    }
  }, [supabase, ownerShopId]);

  const deleteProduct = useCallback(async (idx: number) => {
    const item = ownerInventory[idx];
    setOwnerInventory((prev) => prev.filter((_, i) => i !== idx));
    if (item?.supabaseId && supabase) {
      const { error } = await supabase
        .from('shop_products')
        .delete()
        .eq('id', item.supabaseId);
      if (error) console.error('deleteProduct sync:', error.message);
    }
  }, [supabase, ownerInventory]);

  const updateStock = useCallback(async (id: number, newStock: number) => {
    setOwnerInventory((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
    const item = ownerInventory.find((p) => p.id === id);
    if (item?.supabaseId && supabase) {
      const { error } = await supabase
        .from('shop_products')
        .update({ quantity: newStock, updated_at: new Date().toISOString() })
        .eq('id', item.supabaseId);
      if (error) console.error('updateStock sync:', error.message);
    }
  }, [supabase, ownerInventory]);

  const addTransaction = useCallback(async (t: Omit<LedgerEntry, 'balance'>) => {
    setLedger((prev) => {
      const lastBal = prev[0]?.balance ?? 0;
      const newBal = t.type === 'credit' ? lastBal + t.amount : lastBal - t.amount;
      return [{ ...t, balance: newBal }, ...prev];
    });
    if (supabase && ownerShopId) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          shop_id: ownerShopId,
          transaction_type: t.type === 'credit' ? 'sale' : 'expense',
          amount: t.amount,
          description: t.desc,
          transaction_date: `${t.date}T12:00:00+05:30`,
        })
        .select('id')
        .single();
      if (error) {
        console.error('addTransaction sync:', error.message);
      } else if (data) {
        setLedger((prev) => prev.map((x) => x.desc === t.desc && x.date === t.date && !x.supabaseId ? { ...x, supabaseId: data.id } : x));
      }
    }
  }, [supabase, ownerShopId]);

  const addExpense = useCallback(async (e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
    if (supabase && ownerShopId) {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          shop_id: ownerShopId,
          category: e.category,
          description: e.name,
          amount: e.amount,
          expense_date: e.date,
          payment_method: 'cash',
        })
        .select('id')
        .single();
      if (error) {
        console.error('addExpense sync:', error.message);
      } else if (data) {
        setExpenses((prev) => prev.map((x) => x.date === e.date && x.name === e.name ? { ...x, supabaseId: data.id } : x));
      }
    }
  }, [supabase, ownerShopId]);

  const deleteExpense = useCallback(async (id: string) => {
    setExpenses((prev) => prev.filter(e => e.supabaseId !== id && e.name + e.date !== id));
    if (supabase && ownerShopId && !id.includes('-mock-')) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) console.error('deleteExpense sync:', error.message);
    }
  }, [supabase, ownerShopId]);

  const addReservation = useCallback((r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
  }, []);

  const addPromotion = useCallback(async (p: Promotion) => {
    setPromotions((prev) => [p, ...prev]);
    if (supabase && ownerShopId) {
      const { data, error } = await supabase
        .from('promotions')
        .insert({
          shop_id: ownerShopId,
          name: p.name,
          budget: 0,
          start_date: p.startDate,
          end_date: p.endDate,
          status: p.active ? 'active' : 'paused',
        })
        .select('id')
        .single();
      if (error) {
        console.error('addPromotion sync:', error.message);
      } else if (data) {
        setPromotions((prev) => prev.map((x) => x.id === p.id ? { ...x, supabaseId: data.id } : x));
      }
    }
  }, [supabase, ownerShopId]);

  const togglePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }, []);

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPayment = useCallback((p: Payment) => {
    setPayments((prev) => [p, ...prev]);
  }, []);

  const addChatMessage = useCallback((m: ChatMessage) => {
    setChatMessages((prev) => [...prev, m]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const ownerLogout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsOwner(false);
    setLoggedIn(false);
    setProfile(null);
    setSession(null);
    setOwnerShopId(null);
    setOwnerInventory(createOwnerInventory());
    setMode('customer');
    setOwnerSection('dashboard');
    // Clear business data
    setOwnerOrders([]);
    setOwnerOrderItems([]);
    setOwnerPayments([]);
    setOwnerTransactions([]);
    setOwnerExpenses([]);
    setOwnerReservations([]);
    setOwnerReservationItems([]);
    setOwnerShopViews([]);
    setOwnerShopData(null);
    setLedger(INITIAL_LEDGER);
    setExpenses(INITIAL_EXPENSES);
    setReservations(INITIAL_RESERVATIONS);
    setPayments(INITIAL_PAYMENTS);
  }, [supabase]);

  const loginDemo = useCallback((role: 'shop_owner' | 'customer') => {
    const isShopOwner = role === 'shop_owner';
    const mockProfile: Profile = {
      id: isShopOwner
        ? 'a0000000-0000-0000-0000-000000000001'
        : 'a0000000-0000-0000-0000-000000000002',
      full_name: isShopOwner ? 'Shop Owner Admin' : 'Demo Customer',
      email: isShopOwner ? 'admin@gmail.com' : 'customer@gmail.com',
      phone: null,
      avatar_url: null,
      role,
      is_active: true,
    };
    setProfile(mockProfile);
    setLoggedIn(true);
    setIsOwner(isShopOwner);
    if (isShopOwner) setMode('owner');
  }, []);

  const riderLogout = useCallback(() => {
    setIsRider(false);
    setLoggedIn(false);
    setMode('customer');
  }, []);

  const openProductModal = useCallback((storeId: number) => {
    setProductStoreId(storeId);
    setActiveModal('product');
  }, []);

  const currentResults = useMemo(() => {
    const sorted = [...rawResults];
    if (sortBy === 'distance') sorted.sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'stock')
      sorted.sort((a, b) => {
        const as = a.matchedProducts.reduce((t, p) => t + p.stock, 0);
        const bs = b.matchedProducts.reduce((t, p) => t + p.stock, 0);
        return bs - as;
      });
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'updated') {
      const ord: Record<string, number> = {
        '30 minutes ago': 0,
        '2 hours ago': 1,
        '3 hours ago': 2,
        '5 hours ago': 3,
        '1 day ago': 4,
      };
      sorted.sort((a, b) => (ord[a.lastUpdated] ?? 99) - (ord[b.lastUpdated] ?? 99));
    }
    return sorted;
  }, [rawResults, sortBy]);

  const toggleSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      setMobileSidebarOpen((o) => !o);
    } else {
      setSidebarCollapsed((c) => !c);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Expose setIsOwner via setLoggedIn for owner login
  const handleSetLoggedIn = useCallback((v: boolean) => {
    setLoggedIn(v);
  }, []);

  // We need to expose isOwner setter separately; we'll do it via a special mechanism
  // The login modal will call switchMode('owner') which triggers mode change
  // We intercept switchMode to also set isOwner
  const handleSwitchMode = useCallback((m: Mode) => {
    setMode(m);
    if (m === 'owner') {
      setIsOwner(true);
      setIsRider(false);
    } else if (m === 'rider') {
      setIsOwner(false);
      // Removed setIsRider(true) to require login screen
    }
  }, []);

  const loginRider = useCallback(() => {
    setIsRider(true);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      mode,
      switchMode: handleSwitchMode,
      theme,
      toggleTheme,
      toast,
      showToast,
      activeModal,
      openModal,
      closeModal,
      searchTerm,
      handleSearchInput,
      setSearchTerm,
      suggestions,
      setSuggestions,
      currentQuery,
      currentResults,
      currentResultView,
      setCurrentResultView,
      sortBy,
      setSortBy,
      doSearch,
      quickSearch,
      aiRecs,
      resultsRef,
      lang,
      setLang,
      supabase,
      session,
      profile,
      loadingAuth,
      loggedIn,
      setLoggedIn: handleSetLoggedIn,
      isOwner,
      ownerLogout,
      isRider,
      loginRider,
      riderLogout,
      loginDemo,
      ownerShopId,
      inventoryLoading,
      ownerInventory,
      toggleListing,
      saveProduct,
      deleteProduct,
      updateStock,
      editProduct,
      setEditProduct,
      ledger,
      addTransaction,
      expenses,
      addExpense,
      deleteExpense,
      reservations,
      addReservation,
      promotions,
      addPromotion,
      togglePromotion,
      deletePromotion,
      payments,
      addPayment,
      businessLoading,
      ownerOrders,
      ownerOrderItems,
      ownerPayments,
      ownerTransactions,
      ownerExpenses,
      ownerReservations,
      ownerReservationItems,
      ownerShopViews,
      ownerShopData,
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
      setRiderCtx,
      riderJobs,
      riderLoading,
      loadRiderJobs,
      reserveCtx,
      setReserveCtx,
      productStoreId,
      openProductModal,
      ownerSection,
      setOwnerSection,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar,
      closeMobileSidebar,
    }),
    [
      mode,
      handleSwitchMode,
      theme,
      toggleTheme,
      toast,
      showToast,
      activeModal,
      openModal,
      closeModal,
      searchTerm,
      handleSearchInput,
      suggestions,
      currentQuery,
      currentResults,
      currentResultView,
      sortBy,
      setSortBy,
      doSearch,
      quickSearch,
      aiRecs,
      lang,
      supabase,
      session,
      profile,
      loadingAuth,
      loggedIn,
      handleSetLoggedIn,
      isOwner,
      ownerLogout,
      isRider,
      loginRider,
      riderLogout,
      loginDemo,
      ownerShopId,
      inventoryLoading,
      ownerInventory,
      toggleListing,
      saveProduct,
      deleteProduct,
      updateStock,
      editProduct,
      setEditProduct,
      ledger,
      addTransaction,
      expenses,
      addExpense,
      reservations,
      addReservation,
      promotions,
      addPromotion,
      togglePromotion,
      deletePromotion,
      payments,
      addPayment,
      businessLoading,
      ownerOrders,
      ownerOrderItems,
      ownerPayments,
      ownerTransactions,
      ownerExpenses,
      ownerReservations,
      ownerReservationItems,
      ownerShopViews,
      ownerShopData,
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
      riderJobs,
      riderLoading,
      loadRiderJobs,
      reserveCtx,
      productStoreId,
      openProductModal,
      ownerSection,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar,
      closeMobileSidebar,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}