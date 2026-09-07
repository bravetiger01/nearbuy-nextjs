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

  reservations: Reservation[];
  addReservation: (r: Reservation) => void;

  promotions: Promotion[];
  addPromotion: (p: Promotion) => void;
  togglePromotion: (id: string) => void;
  deletePromotion: (id: string) => void;

  payments: Payment[];
  addPayment: (p: Payment) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;

  riderCtx: RiderContext | null;
  setRiderCtx: (c: RiderContext | null) => void;
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
        setOwnerInventory((spData as RawShopProduct[]).map(rawToStoreProduct));
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

  const [riderCtx, setRiderCtx] = useState<RiderContext | null>(null);
  const [reserveCtx, setReserveCtx] = useState<ReserveContext | null>(null);
  const [productStoreId, setProductStoreId] = useState<number | null>(null);

  const [ownerSection, setOwnerSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = useCallback((msg: string, type: ToastType = 'info') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
  }, []);

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
    setSuggestions(all.length ? all.slice(0, 6) : []);
  }, []);

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
        const matches = store.products.filter((p) => p.name.toLowerCase().includes(mapped) || p.category.toLowerCase().includes(mapped));
        return { ...store, matchedProducts: matches };
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

  const addTransaction = useCallback((t: Omit<LedgerEntry, 'balance'>) => {
    setLedger((prev) => {
      const lastBal = prev[0]?.balance ?? 124680;
      const newBal = t.type === 'credit' ? lastBal + t.amount : lastBal - t.amount;
      return [{ ...t, balance: newBal }, ...prev];
    });
  }, []);

  const addExpense = useCallback((e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
  }, []);

  const addReservation = useCallback((r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
  }, []);

  const addPromotion = useCallback((p: Promotion) => {
    setPromotions((prev) => [p, ...prev]);
  }, []);

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
    }
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
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
      setRiderCtx,
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
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
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